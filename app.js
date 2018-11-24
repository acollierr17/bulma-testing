const express = require('express');
const passport = require('passport');
const session = require('express-session');
const path = require('path');
const app = express();
const uuid = require('uuid');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);
require('dotenv-flow').config();

const dbOptions = {
    useNewUrlParser: true,
    autoIndex: false,
    reconnectTries: Number.MAX_VALUE,
    reconnectInterval: 500,
    poolSize: 5,
    connectTimeoutMS: 10000,
    family: 4
};

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
    store: new MongoStore({ mongooseConnection: db }),
    // cookie: {
    //     path: '/',
    //     secure: true,
    //     httpOnly: true,
    //     maxAge: 60000000
    // }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(cookieParser());
app.use(bodyParser.json());

app.use('/public/assets/css', express.static(path.join(__dirname, '/public/assets/css')));
app.use('/public/assets/js', express.static(path.join(__dirname, '/public/assets/js')));
app.use('/public/assets/img', express.static(path.join(__dirname, '/public/assets/img')));
app.use('/node_modules/bulma/css', express.static(path.join(__dirname, '/node_modules/bulma/css')));
app.set('views', path.join(__dirname, '/views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use('/', require('./routers').Views);
app.use('/', require('./routers').Discord);

app.use((err, req, res, next) => {
    switch (err.message) {
        case 'NoCodeProvided':
            return res.status(400).send({
                status: 'ERROR',
                error: err.message
            });
        default:
            return res.status(500).send({
                status: 'ERROR',
                error: err.message
            });
    }
});

app.use(helmet());

app.listen(process.env.PORT, (err) => {
    if (err) return console.log(err);
    console.info(`Success! Listening at ${process.env.PORT}`);
});