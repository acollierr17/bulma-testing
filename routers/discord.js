const express = require('express');
const passport = require('passport');
const refresh = require('passport-oauth2-refresh');
const {
    Strategy
} = require('passport-discord');
require('dotenv-flow').config();

const router = express.Router();

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((obj, done) => {
    done(null, obj);
});

let scopes = ['identify', 'guilds'];

let discord = new Strategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL,
    scope: scopes
}, async (accessToken, refreshToken, profile, cb) => {

    profile.accessToken = accessToken;
    profile.refreshToken = refreshToken;

    process.nextTick(function () {
        return cb(null, profile);
    });
});

passport.use(discord);
refresh.use(discord);

router.get('/login', passport.authenticate('discord', {
    scope: scopes
}), (req, res) => {});

router.get('/callback', passport.authenticate('discord', {
    failureRedirect: '/'
}), (req, res) => {
    res.redirect('/profile');
});

router.get('/auth', checkAuth, (req, res, next) => {
    res.render('auth', {
        title: 'Authenticated'
    })
});

router.get('/logout', (req, res, next) => {
    req.logout();
    res.redirect('/');
});

router.get('/profile', checkAuth, (req, res, next) => {

    res.render('profile', {
        title: resData(req.user).username,
        data: resData(req.user),
        avatarURL: `https://cdn.discordapp.com/avatars/${data.id}/${data.avatar}.png`
    });
});

function checkAuth(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect('/?authorized=false');
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