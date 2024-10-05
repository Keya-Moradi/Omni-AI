const Conversation = require('./models/Conversation');
const Message = require('./models/Message');

// Fetch a conversation by ID
exports.getConversationById = async (conversationId) => {
    return await Conversation.findById(conversationId).populate('messages').exec();
};

// Add messages to a conversation
exports.addMessagesToConversation = async (conversationId, messages) => {
    return await Conversation.findByIdAndUpdate(conversationId, { $push: { messages: { $each: messages } } });
};