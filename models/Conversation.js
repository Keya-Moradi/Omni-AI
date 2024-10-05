const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message'}],
    title: { type: String, required: true}
});

module.exports = mongoose.model('Conversation', conversationSchema);