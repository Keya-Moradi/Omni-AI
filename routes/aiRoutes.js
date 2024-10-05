const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

// AI conversation route
router.post('/conversation/ai', aiController.startAIConversation);

module.exports = router;
