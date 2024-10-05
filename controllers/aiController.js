const axios = require('axios');
const { GoogleAuth } = require('google-auth-library');
const queries = require('../queries');
const Message = require('../models/Message');

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const GOOGLE_PROJECT_ID = process.env.GOOGLE_PROJECT_ID; // Your Google Cloud Project ID
const GOOGLE_SERVICE_ACCOUNT_PATH = process.env.GOOGLE_SERVICE_ACCOUNT_PATH; // Path to your service account JSON file

// Set up Google Auth client
const auth = new GoogleAuth({
    keyFile: GOOGLE_SERVICE_ACCOUNT_PATH,
    scopes: ['https://www.googleapis.com/auth/cloud-platform'],
});

// Helper function to send a request to the ChatGPT API
const getChatGPTResponse = async (conversationHistory) => {
    try {
        const response = await axios.post(
            'https://api.openai.com/v1/completions',
            {
                model: 'gpt-4',
                prompt: conversationHistory,
                max_tokens: 150
            },
            {
                headers: {
                    'Authorization': `Bearer ${OPENAI_API_KEY}`
                }
            }
        );
        return response.data.choices[0].text.trim();
    } catch (error) {
        console.error('Error getting ChatGPT response:', error.response ? error.response.data : error.message);
        return 'Error communicating with ChatGPT.';
    }
};

// Helper function to send a request to the Gemini API
const getGeminiResponse = async (conversationHistory) => {
    try {
        const response = await axios.post(
            'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=' + process.env.GOOGLE_API_KEY,
            {
                contents: [{ parts: [{ text: conversationHistory }] }]
            },
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
        return response.data.response.trim(); // Adjust based on actual API response structure
    } catch (error) {
        console.error('Error getting Gemini response:', error.response ? error.response.data : error.message);
        return 'Error communicating with Gemini.';
    }
};

// Handle AI conversation flow
exports.startAIConversation = async (req, res) => {
    console.log('startAIConversation method called');
    try {
        const userId = req.session.userId;
        const { conversationId, prompt } = req.body;

        if (!userId) {
            return res.status(401).send('Unauthorized');
        }

        // Debugging API keys
        console.log('OpenAI API Key:', OPENAI_API_KEY);
        console.log('Google API Key:', process.env.GOOGLE_API_KEY);

        console.log('Received prompt:', prompt); // Debugging
        console.log('Conversation ID:', conversationId); // Debugging

        // Fetch the existing conversation to get the previous messages
        const conversation = await queries.getConversationById(conversationId);
        if (!conversation) {
            return res.status(404).send('Conversation not found');
        }

        let conversationHistory = conversation.messages.map((msg) => `${msg.sender}: ${msg.content}`).join('\n');
        
        // Include the original prompt in the conversation history
        conversationHistory += `\nUser: ${prompt}`;

        // Step 1: Get response from ChatGPT
        const chatGPTResponse = await getChatGPTResponse(conversationHistory);
        console.log('ChatGPT Response:', chatGPTResponse); // Debugging

        // Step 2: Append ChatGPT's response to conversation history and pass it to Gemini
        conversationHistory += `\nChatGPT: ${chatGPTResponse}`;
        const geminiResponse = await getGeminiResponse(conversationHistory);
        console.log('Gemini Response:', geminiResponse); // Debugging

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
        await queries.addMessagesToConversation(conversationId, messageIds);

        // Redirect to display the updated conversation
        res.redirect(`/conversation/${conversationId}`);
    } catch (error) {
        console.error('Error in AI conversation:', error);
        res.status(500).send('An error occurred while processing the AI conversation. Please try again.');
    }
};
