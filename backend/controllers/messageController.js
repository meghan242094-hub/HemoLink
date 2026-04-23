const { body } = require('express-validator');
const messageService = require('../services/messageService');

/**
 * Validation rules for sending message
 */
const sendMessageValidation = [
  body('recipient')
    .notEmpty().withMessage('Recipient is required'),
  body('bloodRequest')
    .notEmpty().withMessage('Blood request is required'),
  body('content')
    .trim()
    .notEmpty().withMessage('Message content is required')
    .isLength({ max: 1000 }).withMessage('Message cannot exceed 1000 characters')
];

/**
 * Validation rules for creating conversation
 */
const createConversationValidation = [
  body('recipient')
    .notEmpty().withMessage('Recipient is required'),
  body('bloodRequest')
    .notEmpty().withMessage('Blood request is required')
];

/**
 * Create a new conversation
 */
const createConversation = async (req, res) => {
  try {
    const conversationData = {
      sender: req.user._id,
      recipient: req.body.recipient,
      bloodRequest: req.body.bloodRequest
    };

    const conversation = await messageService.createConversation(conversationData);

    res.status(201).json({
      success: true,
      message: 'Conversation created successfully',
      data: conversation
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Send a message
 */
const sendMessage = async (req, res) => {
  try {
    const messageData = {
      sender: req.user._id,
      recipient: req.body.recipient,
      bloodRequest: req.body.bloodRequest,
      content: req.body.content
    };

    const message = await messageService.sendMessage(messageData);

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: message
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Get conversation between two users
 */
const getConversation = async (req, res) => {
  try {
    const { userId, bloodRequestId } = req.params;

    const messages = await messageService.getConversation(
      req.user._id,
      userId,
      bloodRequestId
    );

    res.status(200).json({
      success: true,
      count: messages.length,
      data: messages
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Get all user conversations
 */
const getUserConversations = async (req, res) => {
  try {
    const conversations = await messageService.getUserConversations(req.user._id);

    res.status(200).json({
      success: true,
      count: conversations.length,
      data: conversations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Mark messages as read
 */
const markAsRead = async (req, res) => {
  try {
    const { senderId, bloodRequestId } = req.body;

    const result = await messageService.markMessagesAsRead(
      req.user._id,
      senderId,
      bloodRequestId
    );

    res.status(200).json({
      success: true,
      message: result.message,
      data: { count: result.count }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Get unread message count
 */
const getUnreadCount = async (req, res) => {
  try {
    const count = await messageService.getUnreadCount(req.user._id);

    res.status(200).json({
      success: true,
      data: { unreadCount: count }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  createConversation,
  sendMessage,
  getConversation,
  getUserConversations,
  markAsRead,
  getUnreadCount,
  sendMessageValidation,
  createConversationValidation
};
