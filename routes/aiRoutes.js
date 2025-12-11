const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const { body } = require('express-validator');

// AI conversation route
router.post('/conversation/ai',
    body('conversationId').trim().isMongoId().withMessage('Valid conversation ID required.'),
    body('prompt').trim().isLength({ min: 1, max: 2000 }).withMessage('Prompt is required and must be under 2000 characters.'),
    aiController.startAIConversation
);

module.exports = router;
