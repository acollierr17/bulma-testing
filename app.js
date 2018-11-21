const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use('/public/includes', express.static(path.join(__dirname, '/public/includes')))
app.use('/public/assets', express.static(path.join(__dirname, '/public/assets')));
app.use('/public/assets/css', express.static(path.join(__dirname, '/public/assets/css')));
app.use('/public/assets/js', express.static(path.join(__dirname, '/public/assets/js')));
app.use('/public/assets/img',express.static(path.join(__dirname, '/public/assets/img')));
app.use('/node_modules/bulma/css', express.static(path.join(__dirname, '/node_modules/bulma/css')));
app.use('/api/discord', require('./api/discord'));

app.listen(5000, () => {
    console.info('Listening on port 5000!');
});

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
                error: err.mesage
            });
    }
});