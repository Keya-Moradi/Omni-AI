const express = require('express');
const router = express.Router();
const conversationController = require('../controllers/conversationController');

// Conversation routes
router.get('/dashboard', conversationController.viewConversations);
router.post('/conversation/start', conversationController.startConversation);
router.put('/conversation/edit', conversationController.editConversation);
router.delete('/conversation/delete/:conversationId', conversationController.deleteConversation);
router.get('/conversation/:conversationId', async (req, res) => {
    try {
        const userId = req.session.userId;
        if (!userId) {
            return res.redirect('/login');
        }
        
        const queries = require('../queries');
        const conversation = await queries.getConversationById(req.params.conversationId, userId);
        
        if (!conversation) {
            return res.redirect('/dashboard');
        }
        
        res.render('chatbox', { conversation });
    } catch (error) {
        console.error('Error viewing conversation:', error);
        res.redirect('/dashboard');
    }
});
module.exports = router;
