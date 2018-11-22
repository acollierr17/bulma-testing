const express = require('express');
const passport = require('passport');
const refresh = require('passport-oauth2-refresh');
const DiscordStrategy = require('passport-discord').Strategy;
const fetch = require('node-fetch');
const btoa = require('btoa');
const { catchAsync } = require('../utils');
const Session = require('../models/sessions');
require('dotenv-flow').config();

const router = express.Router();

let scopes = ['identify', 'email', 'guilds', 'guilds.join'];

let strat = new DiscordStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL,
    scope: scopes
}, async (accessToken, refreshToken, profile, cb) => {

    profile.accessToken = accessToken;
    profile.refreshToken = refreshToken;

    const newSession = await new Session({
        profile_id: profile.id,
        access_token: accessToken,
        refresh_token: refreshToken,
        timestamp: new Date()
    });

    newSession.save().catch(err => {
        return cb(err);
    });

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
    res.redirect('/auth');
});

router.get('/auth', checkAuth, (req, res, next) => {
    // res.status(200).send('Authenticated...');
    res.json(req.user);
});

function checkAuth(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.send('not logged in :(');
}

// router.get('/login', (req, res) => {
//     res.redirect(`https://discordapp.com/oauth2/authorize?client_id=${CLIENT_ID}&scope=identify&response_type=code&redirect_uri=${redirect}`);
// });

// router.get('/callback', catchAsync(async (req, res, next) => {
//     if (!req.query.code) throw new Error('NoCodeProvided');
//     const code = req.query.code;
//     const creds = btoa(`${CLIENT_ID}:${CLIENT_SECRET}`);
//     const response = await fetch(`https://discordapp.com/api/oauth2/token?grant_type=authorization_code&code=${code}&redirect_uri=${redirect}`, {
//         method: 'POST',
//         headers: {
//             Authorization: `Basic ${creds}`,
//         },
//     });
//     const json = await response.json();

//     let getSession = await Session.findOne({ access_token: json.access_token })
//         .catch(err => {
//             console.log(err);
//             return next(err);
//         });

//     if (getSession) return res.redirect('/auth');
    
    // const newSession = await new Session({
    //     access_token: json.access_token,
    //     refresh_token: json.refresh_token,
    //     timestamp: new Date()
    // });

    // newSession.save().catch(err => {
    //     console.log(err);
    //     return next(err);
    // });

//     res.redirect(`/`);
// }));

// router.get('/auth', catchAsync(async (req, res, next) => {

//     let getSession = await Session.findOne({ access_token: json.access_token })
//         .catch(err => {
//             console.log(err);
//             return next(err);
//         });

//     const response = await fetch('https://discordapp.com/api/users/@me', {
//         method: 'GET',
//         headers: {
//             Authorization: `Bearer ${getSession.access_token}`,
//         },
//     });

    

//     if (response) return res.send('Already authenticated...');
//     else {
//         let err = new Error('Unauthorized');
//         return res.redirect(`/`);
//     }
// }));

module.exports = router;