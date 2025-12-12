const express = require('express');
const router = express.Router();
const conversationController = require('../controllers/conversationController');
const { body, param } = require('express-validator');

// Conversation routes
router.get('/dashboard', conversationController.viewConversations);
router.post('/conversation/start',
    body('prompt').trim().isLength({ min: 1, max: 2000 }).withMessage('Prompt is required and must be under 2000 characters.'),
    conversationController.startConversation
);
router.put('/conversation/edit',
    body('conversationId').trim().isMongoId().withMessage('Valid conversation ID required.'),
    body('newTitle').trim().isLength({ min: 1, max: 200 }).withMessage('New title is required and must be under 200 characters.'),
    conversationController.editConversation
);
router.delete('/conversation/delete/:conversationId',
    param('conversationId').isMongoId().withMessage('Valid conversation ID required.'),
    conversationController.deleteConversation
);
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
