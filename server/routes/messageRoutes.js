// routes/messageRoutes.js
const express = require('express');
const router = express.Router();
const { sendMessage, getMessages, getAllUserMessages } = require('../controllers/messageController');
const protect = require('../middlewares/authMiddlewares');

// Get all messages between current user and a recipient
router.get('/:recipientId', protect, getMessages);

// Get all messages for current user (NEW)
router.get('/', protect, getAllUserMessages);

// Send message
router.post('/', protect, sendMessage);

module.exports = router;
