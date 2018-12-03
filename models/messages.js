const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({ 
    _id: mongoose.Schema.Types.ObjectId,
    userID: String,
    userName: String,
    userAvatar: String,
    message: String,
    messageID: Number,
    submittedOn: String,
    updatedOn: String
});

module.exports = mongoose.model('Message', messageSchema);
