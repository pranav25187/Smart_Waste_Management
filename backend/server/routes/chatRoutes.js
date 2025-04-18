// backend/routes/chatRoutes.js
const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, chatController.getOrCreateChat);
router.get('/:chat_id/messages', authMiddleware, chatController.getChatMessages);
router.get('/user/:user_id', authMiddleware, chatController.getUserChats);

module.exports = router;