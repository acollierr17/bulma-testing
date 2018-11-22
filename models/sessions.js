const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
    access_token: {
        type: String,
        unique: true,
        required: true
    },
    refresh_token: {
        type: String,
        unique: true,
        required: true
    },
    timestamp: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Sessions', sessionSchema);