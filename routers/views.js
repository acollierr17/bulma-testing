const express = require('express');
require('dotenv-flow').config();

const router = express.Router();

router.get('/', (req, res, next) => {

    res.render('index', {
        title: 'Bulma Testing',
        data: req.user || false
    });
});

router.get('/contact', (req, res, next) => {
    res.render('contact', {
        title: 'Contact',
        data: req.user || false
    });
});

function checkAuth(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.send('not logged in :(');
}

module.exports = router;