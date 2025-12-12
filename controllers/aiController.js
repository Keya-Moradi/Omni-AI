const axios = require('axios');
const { validationResult } = require('express-validator');
const queries = require('../queries');
const Message = require('../models/Message');

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const GEMINI_MODEL = process.env.GOOGLE_GEMINI_MODEL || 'gemini-1.5-flash-latest';
const GEMINI_API_BASE = process.env.GOOGLE_GEMINI_API_BASE || 'https://generativelanguage.googleapis.com';
const MAX_AI_TURNS = parseInt(process.env.AI_TURNS_LIMIT || '1', 10);
const CHATGPT_SYSTEM_PROMPT = 'You are ChatGPT. Respond concisely and label yourself as ChatGPT. Do not impersonate Gemini.';
const GEMINI_SYSTEM_PROMPT = 'You are Gemini. Respond concisely and label yourself as Gemini. Do not impersonate ChatGPT.';

// Call ChatGPT with a shared history and a persona reminder
const getChatGPTResponse = async (conversationHistory) => {
    try {
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-3.5-turbo',
                messages: [
                    { role: 'system', content: CHATGPT_SYSTEM_PROMPT },
                    { role: 'user', content: conversationHistory }
                ],
                max_tokens: 150
            },
            {
                headers: {
                    'Authorization': `Bearer ${OPENAI_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        return response.data.choices[0].message.content;
    } catch (error) {
        console.error('Error getting ChatGPT response:', error.response ? error.response.data : error.message);
        return 'Error communicating with ChatGPT.';
    }
};

// Call Gemini with shared history and a persona reminder
const getGeminiResponse = async (conversationHistory) => {
    try {
        const response = await axios.post(
            `${GEMINI_API_BASE}/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GOOGLE_API_KEY}`,
            {
                contents: [
                    { 
                        parts: [
                            { 
                                text: `${GEMINI_SYSTEM_PROMPT}\n\n${conversationHistory}` 
                            }
                        ] 
                    }
                ]
            },
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
        
        // Correct path to access Gemini response
        if (response.data && response.data.candidates && response.data.candidates[0]) {
            return response.data.candidates[0].content.parts[0].text;
        } else {
            return 'No response from Gemini.';
        }
    } catch (error) {
        const errorMsg = error.response?.data?.error?.message || error.message;
        console.error('Error getting Gemini response:', error.response ? error.response.data : error.message);
        return `Error communicating with Gemini: ${errorMsg}`;
    }
};

// Core AI sequence: appends user prompt + alternating ChatGPT/Gemini turns, returns new messages
const runAISequence = async (userId, conversationId, prompt) => {
    if (!OPENAI_API_KEY || !GOOGLE_API_KEY) {
        throw new Error('AI services are not configured. Please set OPENAI_API_KEY and GOOGLE_API_KEY.');
    }

    const conversation = await queries.getConversationById(conversationId, userId);
    if (!conversation) {
        throw new Error('Conversation not found or unauthorized');
    }

    let conversationHistory = conversation.messages.map((msg) => `${msg.sender}: ${msg.content}`).join('\n');
    conversationHistory += `\nUser: ${prompt}`;

    const newMessages = [{ sender: 'user', content: prompt }];

    for (let turn = 0; turn < MAX_AI_TURNS; turn += 1) {
        const chatGPTResponse = await getChatGPTResponse(conversationHistory);
        newMessages.push({ sender: 'ChatGPT', content: chatGPTResponse });
        conversationHistory += `\nChatGPT: ${chatGPTResponse}`;

        const geminiResponse = await getGeminiResponse(conversationHistory);
        newMessages.push({ sender: 'Gemini', content: geminiResponse });
        conversationHistory += `\nGemini: ${geminiResponse}`;
    }

    const messageDocs = await Message.insertMany(newMessages);
    const messageIds = messageDocs.map((msg) => msg._id);
    await queries.addMessagesToConversation(conversationId, messageIds, userId);
    return newMessages;
};

// Handle AI conversation flow: validate, load convo, then loop ChatGPT/Gemini turns
exports.startAIConversation = async (req, res) => {
    try {
        const userId = req.session.userId;
        const { conversationId, prompt } = req.body;

        if (!userId) {
            return res.status(401).send('Unauthorized');
        }

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).send(errors.array()[0].msg);
        }

        await runAISequence(userId, conversationId, prompt);

        res.redirect(`/conversation/${conversationId}`);
    } catch (error) {
        console.error('Error in AI conversation:', error);
        const message = error.message || 'An error occurred while processing the AI conversation. Please try again.';
        res.status(500).send(message);
    }
};

exports.runAISequence = runAISequence;
