const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const User = require('../models/User');

// Render the dashboard with the users's conversations
exports.viewConversations = async (req, res) => {
    try {
        const userId = req.session.userId;
        if (!userId) {
            return res.redirect('/login');
        }

        //find user conversations iin reverse-chronological order
        const user = await User.findById(userId).populate('conversations').exec();
        const conversations = user.conversations.sort((a, b) => b._id.getTimestamp() -a._id.getTimestamp());

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
            return res.redirect('/login');
        }

        const { title } = req.body

        // Create a new conversation
        const newConversation = new Conversation({
            user: userId,
            title, 
            messages: []
        });

        await newConversation.save();

        /// Add conversation to user's conversations
        await User.findByIdAndUpdate(userId, { $push: { conversations: newConversation._id }});

        res.redirect('/dashboard');
    } catch (error) {
        console.error('Error starting conversation:', error);
        res.redirect('/dashboard');
    }
};

// Delete a conversation
exports.deleteConversation = async (req, res) => {
    try {
        const userId = req.session.userId;
        const { conversationId } = req.params;

        if (!userId) {
            return res.redirect('/login');
        }

        // Find and delete the conversation
        await Conversation.findByIdAndDelete(conversationId);

        // Remove conversation from user's conversations
        await User.findByIdAndUpdate(userId, { $pull: { conversations: conversationId}});

        res.redirect('/dashboard');
    } catch (error) {
        console.error('Error deleting conversation:', error);
        res.redirect('/dashboard');
    }
        };

// Edit a previous conversation (restarts the conversation with new prompts)
exports.editConversation = async (req, res) => {
    try {
        const userId = req.session.userId;
        const { conversationId, newTitle } = req.body;

        if (!userId) {
            return res.redirect('/login');
        }

        // Update the conversation title
        await Conversation.findByIdAndUpdate(conversationId, { title: newTitle});

        res.redirect('/dashboard');
        } catch (error) {
            console.error('Error editing conversation:', error);
            res.redirect('/dashboard');
        }
    };