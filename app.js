const express = require('express');
const passport = require('passport');
const session = require('express-session');
const path = require('path');
const app = express();
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);
require('dotenv-flow');

const dbOptions = {
    useNewUrlParser: true,
    autoIndex: false,
    reconnectTries: Number.MAX_VALUE,
    reconnectInterval: 500,
    poolSize: 5,
    connectTimeoutMS: 10000,
    family: 4
};

mongoose.connect(`mongodb://localhost/bulma-db`, dbOptions);
mongoose.Promise = global.Promise;
const db = mongoose.connection;

app.use(session({
    secret: 'goneapeshityandhi',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: db })
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(cookieParser());
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public'), {
    extensions: ['html', 'htm']
}));
app.use('/public/includes', express.static(path.join(__dirname, '/public/includes')))
app.use('/public/assets/css', express.static(path.join(__dirname, '/public/assets/css')));
app.use('/public/assets/js', express.static(path.join(__dirname, '/public/assets/js')));
app.use('/public/assets/img', express.static(path.join(__dirname, '/public/assets/img')));
app.use('/node_modules/bulma/css', express.static(path.join(__dirname, '/node_modules/bulma/css')));
app.set('views', path.join(__dirname, '/views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use('/', require('./routers/discord'));

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

app.listen(5000, (err) => {
    if (err) return console.log(err);
    console.info('Listening on port 5000!');
});