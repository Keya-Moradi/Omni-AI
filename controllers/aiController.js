const axios = require('axios');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Helper function to send a request to the ChatGPT API
const getChatGPTResponse = async (conversationHistory) => {
    try {
        const response = await axios.post('https://api.openai.com/v1/completions', {
            model: 'gpt-4',
            prompt: conversationHistory,
            max_tokens: 150
        }, {
            headers: {
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            }
        });
        return response.data.choices[0].text.trim();
    } catch (error) {
        console.error('Error getting ChatGPT response:', error);
        return 'Error communicating with ChatGPT.';
    }
};

// Helper function to send a request to the Gemini API (placeholder URL)
const getGeminiResponse = async (conversationHistory) => {
    try {
        const response = await axios.post('https://api.gemini.com/v1/conversations', {
            prompt: conversationHistory,
            max_tokens: 150
        }, {
            headers: {
                'Authorization': `Bearer ${GEMINI_API_KEY}`
            }
        });
        return response.data.response.trim();
    } catch (error) {
        console.error('Error getting Gemini response:', error);
        return 'Error communicating with Gemini.';
    }
};

// Handle AI conversation flow
exports.startAIConversation = async (req, res) => {
    try {
        const userId = req.session.userId;
        const { conversationId, prompt } = req.body;

        if (!userId) {
            return res.status(401).send('Unauthorized');
        }

        // Fetch the existing conversation to get the previous messages
        const conversation = await Conversation.findById(conversationId).populate('messages').exec();
        let conversationHistory = conversation.messages.map((msg) => `${msg.sender}: ${msg.content}`).join('\n');
        
        // Include the original prompt in the conversation history
        conversationHistory += `\nUser: ${prompt}`;

        // Step 1: Get response from ChatGPT using the entire conversation history
        const chatGPTResponse = await getChatGPTResponse(conversationHistory);

        // Step 2: Append ChatGPT's response to the conversation history and pass it to Gemini
        conversationHistory += `\nChatGPT: ${chatGPTResponse}`;
        const geminiResponse = await getGeminiResponse(conversationHistory);

        // Step 3: Store all responses as messages in the conversation
        const messages = [
            { sender: 'user', content: prompt },
            { sender: 'ChatGPT', content: chatGPTResponse },
            { sender: 'Gemini', content: geminiResponse }
        ];

        // Create message entries in the database
        const messageDocs = await Message.insertMany(messages);
        const messageIds = messageDocs.map((msg) => msg._id);

        // Add messages to the conversation
        await Conversation.findByIdAndUpdate(conversationId, { $push: { messages: { $each: messageIds } } });

        res.status(200).send('AI conversation completed');
    } catch (error) {
        console.error('Error in AI conversation:', error);
        res.status(500).send('Error processing AI conversation.');
    }
};
