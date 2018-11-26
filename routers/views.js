const express = require('express');
require('dotenv-flow').config();

const router = express.Router();

router.get('/', (req, res, next) => {

    res.render('index', {
        title: 'Bulma Testing',
        data: resData(req.user || false),
        avatarURL: `https://cdn.discordapp.com/avatars/${data.id}/${data.avatar}.png`
    });
});

router.get('/contact', (req, res, next) => {
    res.render('contact', {
        title: 'Contact',
        data: resData(req.user || false),
        avatarURL: `https://cdn.discordapp.com/avatars/${data.id}/${data.avatar}.png`
    });
});

function checkAuth(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.send('not logged in :(');
}

function resData(user) {
    return data = {
        id: user.id,
        username: user.username,
        discriminator: user.discriminator,
        avatar: user.avatar,
        verified: user.verified,
        guilds: user.guilds
    };
}

module.exports = router;