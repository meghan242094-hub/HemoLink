const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const auth = require('../middleware/auth');
const validateRequest = require('../middleware/validateRequest');

/**
 * @route   POST /api/messages/conversations
 * @desc    Create a new conversation
 * @access  Private
 */
router.post(
  '/conversations',
  auth,
  messageController.createConversationValidation,
  validateRequest,
  messageController.createConversation
);

/**
 * @route   POST /api/messages
 * @desc    Send a message
 * @access  Private
 */
router.post(
  '/',
  auth,
  messageController.sendMessageValidation,
  validateRequest,
  messageController.sendMessage
);

/**
 * @route   GET /api/messages/conversations
 * @desc    Get all user conversations
 * @access  Private
 */
router.get('/conversations', auth, messageController.getUserConversations);

/**
 * @route   GET /api/messages/unread-count
 * @desc    Get unread message count
 * @access  Private
 */
router.get('/unread-count', auth, messageController.getUnreadCount);

/**
 * @route   GET /api/messages/:userId/:bloodRequestId
 * @desc    Get conversation between two users
 * @access  Private
 */
router.get('/:userId/:bloodRequestId', auth, messageController.getConversation);

/**
 * @route   PUT /api/messages/mark-read
 * @desc    Mark messages as read
 * @access  Private
 */
router.put('/mark-read', auth, messageController.markAsRead);

module.exports = router;
