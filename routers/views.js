const express = require('express');
const path = require('path');
require('dotenv-flow').config();

const router = express.Router();

router.get('/', (req, res, next) => {

    res.render('index.html', {
        data: resData(req.user || false),
        avatarURL: `https://cdn.discordapp.com/avatars/${data.id}/${data.avatar}.png`
    });
});

router.get('/contact', (req, res, next) => {
    res.render('contact.html', {
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