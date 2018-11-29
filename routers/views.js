const express = require('express');
require('dotenv-flow').config();

const router = express.Router();

router.get('/', (req, res, next) => {

    res.render('index', {
        title: 'Bulma Testing',
        data: req.user || false,
        avatarURL: `https://cdn.discordapp.com/avatars/${req.user.id}/${req.user.avatar}.png`
    });
});

router.get('/contact', (req, res, next) => {
    res.render('contact', {
        title: 'Contact',
        data: req.user || false,
        avatarURL: `https://cdn.discordapp.com/avatars/${req.user.id}/${req.user.avatar}.png`
    });
});

router.get('/beta', checkAuth, (req, res, next) => {
    let guilds = [];
    req.user.guilds.forEach(g => {
        guilds.push(`${g.name} - ${g.id}`);
    });
    res.status(200).send(guilds);
});

function checkAuth(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.send('not logged in :(');
}

module.exports = router;