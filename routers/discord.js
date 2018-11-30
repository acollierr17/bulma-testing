const express = require('express');
const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
const passport = require('passport');
const refresh = require('passport-oauth2-refresh');
const { Strategy } = require('passport-discord');
const { Permissions, RichEmbed } = require('discord.js');
const fetch = require('node-fetch');
require('dotenv-flow').config();

const router = express.Router();

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((obj, done) => {
    done(null, obj);
});

const scopes = ['identify', 'guilds'];

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
        title: req.user.username,
        data: req.user,
        avatarURL: `https://cdn.discordapp.com/avatars/${req.user.id}/${req.user.avatar}.png`,
        client: getAppInfo(),
        perms: Permissions
    });

});

// router.get('/beta', checkAuth, (req, res, next) => {
//     res.status(200);

//     (async () => {

//         let appInfo = await fetch('https://discordapp.com/api/oauth2/applications/@me', {
//             method: 'GET',
//             headers: {
//                 Authorization: `Bot ${process.env.CLIENT_TOKEN}`
//             }
//         }).then(response => {
//             if (response.statusCode === 404) {
//                 return res.status(404).json({
//                     status: res.statusCode,
//                     error: 'Could not get bot application information.'
//                 });
//             } else {
//                 return response.json();
//             }
//         });
//     })();
// });

// router.get('/beta/:guildID', (req, res, next) => {

//     const guildID = req.params.guildID;
//     (async () => {

//         let guild = await fetch(`http://localhost:3000/api/v1/guild/${guildID}`, {
//             method: 'GET',
//             headers: {
//                 'Content-type': 'application/json'
//             }
//         }).then(response => {

//                 if (response.statusCode === 404) {
//                     return res.status(404).json({
//                         status: res.statusCode,
//                         error: 'This guild does exist or is inaccessible!'
//                     });
//                 }
//                 return response.json();
//             });

//         res.status(200).json({
//             status: guild.status,
//             guildName: guild.guildName,
//             memberCount: guild.memberCount
//         });
//     })();
// });

router.get('/manage', checkAuth, (req, res, next) => {
    res.redirect('/profile');
});

router.get('/manage/:guildID', checkAuth, (req, res, next) => {

    const guild = client.guilds.get(req.params.guildID);
    if (!guild) return res.status(404);
    const isManaged = guild && !!guild.member(req.user.id) ? guild.member(req.user.id).permissions.has('MANAGE_GUILD') : false;
    if (!isManaged) res.redirect('/profile');
    res.render('manage', {
        title: guild.name,
        data: req.user,
        client,
        guild
    });

});

router.post('/newmessage', checkAuth, //[

    // body('message')
    //     .not().isEmpty()
    //     .trim()
    //     .escape(),
    // sanitizeBody('notifyOnReply').toBoolean()
/*]*,*/ (req, res, next) => {

    // const errors = validationResult(req);
    // if (!errors.isEmpty()) return console.log({ errors: errors.array() });

    if (!req.body.embed) {
        let data = {
            channel: req.body.channel,
            message: req.body.message,
        };
    
        let dChannel = client.channels.find(c => c.name === data.channel);
        if (!dChannel) return;
        try {
            return dChannel.send(data.message);
        } catch (e) {
            console.log(e);
        }
    }

    if (req.body.embed && !req.body.edit) {

        let embedData = {
            channel: req.body.channel,
            message: req.body.message
        }

        let embed = new RichEmbed()
            .setTitle('New Message')
            .setDescription(embedData.message)
            .setColor(0xdd9323);

        try {
            return client.channels.find(c => c.name === embedData.channel).send(embed);
        } catch (e) {
            console.log(e);
        }
    }

    if (req.body.embed && req.body.edit) {

        let embedData = {
            channel: req.body.channel,
            id: req.body.id,
            message: req.body.message,
        }

        let c = client.channels.find(c => c.name === embedData.channel);
        (async () => {

            let fetched = await c.fetchMessage(embedData.id);

            let embed = fetched.embeds[0];
            if (!embed) return;

            const newEmbed = new RichEmbed(embed)
                .setDescription(embedData.message);

            if (embedData.id === fetched.id) {
                try {
                    fetched.edit(newEmbed);
                } catch (e) {
                    console.log(e.stack);
                }
            }
        })();
    }

});

router.post('/newcontact', (req, res, next) => {

    let data = {
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
        subject: req.body.message,
        message: req.body.message
    };

    let channel = client.channels.get('517173600151797760');
    let newMessage = new RichEmbed()
        .setDescription('New Message')
        .setColor(0xdd9323)
        .addField('Name', data.name, true)
        .addField('Username', data.username, true)
        .addField('Email', data.email, true)
        .addField('Subject', data.subject, true)
        .addField('Message', data.message)
        .setTimestamp();
    try {
        channel.send(newMessage);
    } catch (e) {
        console.log(e);        
    }

});

function checkAuth(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect('/?authorized=false');
}

async function getAppInfo() {

    let appInfo = await fetch('https://discordapp.com/api/oauth2/applications/@me', {
        method: 'GET',
        headers: {
            Authorization: `Bot ${process.env.CLIENT_TOKEN}`
        }
    }).then(response => {
        if (response.statusCode === 404) {
            return res.status(404).json({
                status: res.statusCode,
                error: 'Could not get bot application information.'
            });
        } else {
            return response.json();
        }
    });

    return appInfo;
}

module.exports = router;