const Conversation = require('./models/Conversation');
const Message = require('./models/Message');

// Fetch a conversation by ID
exports.getConversationById = async (conversationId, userId) => {
    try {
        const filter = { _id: conversationId };
        if (userId) {
            filter.user = userId;
        }
        return await Conversation.findOne(filter).populate('messages').exec();
    } catch (error) {
        console.error('Error fetching conversation by ID:', error);
        throw error;
    }
};

// Add messages to a conversation
exports.addMessagesToConversation = async (conversationId, messages, userId) => {
    try {
        const filter = { _id: conversationId };
        if (userId) {
            filter.user = userId;
        }
        return await Conversation.findOneAndUpdate(filter, { $push: { messages: { $each: messages } } });
    } catch (error) {
        console.error('Error adding messages to conversation:', error);
        throw error;
    }
};

// Create a new conversation
exports.createConversation = async (userId, title) => {
    try {
        const newConversation = new Conversation({ user: userId, title, messages: [] });
        await newConversation.save();
        return newConversation;
    } catch (error) {
        console.error('Error creating conversation:', error);
        throw error;
    }
};

// Delete a conversation by ID
exports.deleteConversationById = async (conversationId, userId) => {
    try {
        const filter = { _id: conversationId };
        if (userId) {
            filter.user = userId;
        }
        return await Conversation.findOneAndDelete(filter);
    } catch (error) {
        console.error('Error deleting conversation by ID:', error);
        throw error;
    }
};

// Update conversation title
exports.updateConversationTitle = async (conversationId, newTitle, userId) => {
    try {
        const filter = { _id: conversationId };
        if (userId) {
            filter.user = userId;
        }
        return await Conversation.findOneAndUpdate(filter, { title: newTitle });
    } catch (error) {
        console.error('Error updating conversation title:', error);
        throw error;
    }
};
