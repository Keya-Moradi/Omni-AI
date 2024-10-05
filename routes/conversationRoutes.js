const express = require('express');
const router = express.Router();
const conversationController = require('../controllers/conversationController');

// Conversation routes
router.get('/dashboard', conversationController.viewConversations);
router.post('/conversation/start', conversationController.startConversation);
router.put('/conversation/edit', conversationController.editConversation);
router.delete('/conversation/delete/:conversationId', conversationController.deleteConversation);

module.exports = router;
