const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    sender: { type: String, required: true, enum: ['user', 'ChatGPT', 'Gemini']},
    content: { type: String, required: true },
    date_created: { type: Date, default: Date.now, required: true}
});

module.exports = mongoose.model('Message', messageSchema);



