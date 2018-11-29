const express = require('express');
const passport = require('passport');
const ejsLayouts = require('express-ejs-layouts');
const session = require('express-session');
const path = require('path');
const app = express();
const uuid = require('uuid');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);
const { Views, Discord } = require('./routers');
const { Client } = require('discord.js');
require('dotenv-flow').config();

module.exports = (client) = new Client({ disableEveryone: true });

const dbOptions = {
    useNewUrlParser: true,
    autoIndex: false,
    reconnectTries: Number.MAX_VALUE,
    reconnectInterval: 500,
    poolSize: 5,
    connectTimeoutMS: 10000,
    family: 4
};

app.use(helmet());

mongoose.connect(process.env.MONGO_URI, dbOptions);
mongoose.Promise = global.Promise;
const db = mongoose.connection;

app.use(session({
    genid: (req) => {
        return uuid();
    },
    name: process.env.SNAME,
    secret: process.env.SSECRET,
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({ mongooseConnection: db })
}));

app.use(passport.initialize());
app.use(passport.session());

app.set('view engine', 'ejs');
app.use(ejsLayouts);
app.set('layout', 'includes/main');;

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/public', express.static(path.join(__dirname, '/public')));
app.set('views', path.join(__dirname, '/views'));
app.use('/', Views);
app.use('/', Discord);

app.use((err, req, res, next) => {
    switch (err.message) {
        case 'NoCodeProvided':
            return res.status(400).send({
                status: 'ERROR',
                error: err.stack
            });
        default:
            return res.status(500).send({
                status: 'ERROR',
                error: err.stack
            });
    }
});

app.listen(process.env.PORT, (err) => {
    if (err) return console.log(err);
    console.info(`Success! Listening at ${process.env.PORT}`);
});

// bot stuff
const prefix = '^';

client
    .on('ready', async () => {
        console.log(`${client.user.tag} (${client.user.id}) is logged into ${client.guilds.size} server(s).`);

        client.appInfo = await client.fetchApplication();
        setInterval(async () => {
            client.appInfo = await client.fetchApplication();
        }, 60000);

    })
    .on('message', async message => {
        
        if (message.author.bot) return;
        if (message.content.indexOf(prefix) !== 0) return;

        const args = message.content.slice(prefix.length).trim().split(/ +/g);
        const command = args.shift().toLowerCase();

        switch (command) {
            case 'ping':
                message.channel.send('Pong!');
                break;
            default:
        }
    })
    .on('error', () => console.error)
    .on('disconnect', () => console.log('Reconnecting...'))
    .on('reconnecting', () => console.log('Lost connection! Reconnecting...'))
    .on('warn', () => console.warn)
    .login()

process.on('unhandledRejection', error => {
    console.log(`Unhandled Rejection: ${error}`);
});