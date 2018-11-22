const express = require('express');
const path = require('path');
const passport = require('passport');
const refresh = require('passport-oauth2-refresh');
const DiscordStrategy = require('passport-discord').Strategy;
require('dotenv-flow').config();

const router = express.Router();

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((obj, done) => {
    done(null, obj);
});

let scopes = ['identify', 'guilds'];

let strat = new DiscordStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL,
    scope: scopes
}, async (accessToken, refreshToken, profile, cb) => {

    profile.accessToken = accessToken;
    profile.refreshToken = refreshToken;

    process.nextTick(function() {
        return cb(null, profile);
    });
});

passport.use(strat);
refresh.use(strat);

router.get('/login', passport.authenticate('discord', { 
    scope: scopes 
}), (req, res) => {});

router.get('/callback', passport.authenticate('discord', {
    failureRedirect: '/'
}), (req, res) => {
    res.redirect('/profile');
});

router.get('/auth', checkAuth, (req, res, next) => {
    res.sendFile(path.join(__dirname, '../views/auth.html'));
});

router.get('/logout', (req, res, next) => {
    req.logout();
    res.redirect('/');
});

router.get('/profile', checkAuth, (req, res, next) => {

    let data = {
        id: req.user.id,
        username: req.user.username,
        discriminator: req.user.discriminator,
        avatar: req.user.avatar,
        verified: req.user.verified,
        guildSize: req.user.guilds.length
    };

    res.render('profile.html', { 
        data: data,
        avatarURL: `https://cdn.discordapp.com/avatars/${data.id}/${data.avatar}.png`
    });
});

function checkAuth(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.send('not logged in :(');
}

module.exports = router;