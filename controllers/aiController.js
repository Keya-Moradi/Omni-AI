const axios = require('axios');
const Convention = require('../models/Conversation');
const Message = require('../models/Message');

const OPENAI_API_KEY = process.env.OPENAI_API_KEY
const GEMINI_API_KEY = process.env.GEMINI_API_KEY

// Helper function to send a request to the ChatGPT API
const sendChatGPTRequest = async (prompt) => {
    try {
        const response = await axios.post('https://api.openai.com/v1/engines/davinci-codex/completions', {
            model: 'gpt-4',
            prompt: prompt,
            max_tokens: 150
        }, {
            headers: {
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            }
        });

        return response.data.choices[0].text;
    } catch (error) {
        console.error('Error fetching response from ChatGPT:', error);
        return 'Error fetching response from ChatGPT';
    }
};

// Helper function to send a request to the Gemini API
const sendGeminiRequest = async (message) => {
    try {
        const response = await axios.post('https://api.gemini.com/v2/ticker/btcusd', {
            prompt: prompt,
            max_tokens: 150
        }, {
            headers: {
                'Authorization': `Bearer ${GEMINI_API_KEY}`
            }
        });

        return response.data.response;
    } catch (error) {
        console.error('Error fetching response from Gemini:', error);
        return 'Error fetching response from Gemini';
    }
};

// Handle AI conversation flow
exports.startAIConversation = async (req, res) => {
    try {
        const userId = req.session.userID;
        const { conversationID, prompt } = req.body;

        if (!userId) {
            return res.status(401).send('Unauthorized');
        }

        // Step1: Get response from ChatGPT
        const chatGPTResponse = await sendChatGPTRequest(prompt);

        // Step2: Pass ChatGPT's response to Gemini
        const geminiResponse = await sendGeminiRequest(chatGPTResponse);

        // Step 3: Store both responses as messages in conversation 
        const messages = [
            { sender: 'user', content: prompt },
            { sender: 'ChatGPT', content: chatGPTResponse },
            { sender: 'Gemini', content: geminiResponse }
        ];

        // Create message entries in the database
        const messageDocs = await Message.insertMany(messages);
        const messageIds = messageDocs.map((msg) => msg._id);

        // Add messages to the conversation
        await Conversation.findByIdAndUpdate(conversationId, { $push: { messages: { $each: messageIds} }});

        res.status(200).send('AI conversation completed');
    } catch (error) {
        console.error('Error in AI conversation:', error);
        res.status(500).send('Error in AI conversation');
    }
};
