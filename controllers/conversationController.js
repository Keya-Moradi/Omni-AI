const queries = require('../queries');
const Conversation = require('../models/Conversation');
const User = require('../models/User');

// Render the dashboard with the user's conversations
exports.viewConversations = async (req, res) => {
    try {
        const userId = req.session.userId;
        if (!userId) {
            return res.redirect('/login');
        }

        // Fetch user conversations
        const user = await User.findById(userId).populate('conversations').exec();
        const conversations = user.conversations.sort((a, b) => b._id.getTimestamp() - a._id.getTimestamp());

        res.render('dashboard', { conversations });
    } catch (error) {
        console.error('Error fetching conversations:', error);
        res.redirect('/login');
    }
};

// Start a new conversation
exports.startConversation = async (req, res) => {
    try {
        const userId = req.session.userId;
        if (!userId) {
            return res.status(401).send('Unauthorized');
        }

        const { title } = req.body;

        // Create a new conversation
        const newConversation = new Conversation({
            user: userId,
            title,
            messages: []
        });

        await newConversation.save();

        // Add conversation to user's conversations
        await User.findByIdAndUpdate(userId, { $push: { conversations: newConversation._id } });

        res.redirect('/dashboard');
    } catch (error) {
        console.error('Error starting conversation:', error);
        res.status(500).send('An error occurred while starting the conversation. Please try again.');
    }
};

// Delete a conversation
exports.deleteConversation = async (req, res) => {
    try {
        const userId = req.session.userId;
        const { conversationId } = req.params;

        if (!userId) {
            return res.status(401).send('Unauthorized');
        }

        // Find and delete the conversation
        await Conversation.findByIdAndDelete(conversationId);

        // Remove conversation reference from user's conversations
        await User.findByIdAndUpdate(userId, { $pull: { conversations: conversationId } });

        res.status(200).send('Conversation deleted successfully.');
    } catch (error) {
        console.error('Error deleting conversation:', error);
        res.status(500).send('An error occurred while deleting the conversation. Please try again.');
    }
};

// Edit a past conversation (restarts the conversation with new prompts)
exports.editConversation = async (req, res) => {
    try {
        const userId = req.session.userId;
        const { conversationId, newTitle } = req.body;

        if (!userId) {
            return res.status(401).send('Unauthorized');
        }

        // Update the conversation title
        await Conversation.findByIdAndUpdate(conversationId, { title: newTitle });

        res.status(200).send('Conversation updated successfully.');
    } catch (error) {
        console.error('Error editing conversation:', error);
        res.status(500).send('An error occurred while editing the conversation. Please try again.');
    }
};
