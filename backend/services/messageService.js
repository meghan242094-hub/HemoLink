const Message = require('../models/Message');

/**
 * Create a new conversation (initial message)
 * @param {Object} conversationData - Conversation data with sender, recipient, bloodRequest
 * @returns {Object} - Created message
 */
const createConversation = async (conversationData) => {
  try {
    // Check if conversation already exists
    const existingConversation = await Message.findOne({
      sender: conversationData.sender,
      recipient: conversationData.recipient,
      bloodRequest: conversationData.bloodRequest
    });

    if (existingConversation) {
      return existingConversation;
    }

    // Create a system message to start the conversation
    const message = await Message.create({
      sender: conversationData.sender,
      recipient: conversationData.recipient,
      bloodRequest: conversationData.bloodRequest,
      content: 'Conversation started',
      isSystem: true
    });

    // Populate sender and recipient details
    await message.populate('sender', 'name bloodGroup');
    await message.populate('recipient', 'name bloodGroup');

    return message;
  } catch (error) {
    throw error;
  }
};

/**
 * Send a message
 * @param {Object} messageData - Message data
 * @returns {Object} - Created message
 */
const sendMessage = async (messageData) => {
  try {
    const message = await Message.create(messageData);

    // Populate sender and recipient details
    await message.populate('sender', 'name bloodGroup');
    await message.populate('recipient', 'name bloodGroup');

    return message;
  } catch (error) {
    throw error;
  }
};

/**
 * Get conversation between two users for a specific blood request
 * @param {string} user1Id - First user ID
 * @param {string} user2Id - Second user ID
 * @param {string} bloodRequestId - Blood request ID
 * @returns {Array} - Array of messages
 */
const getConversation = async (user1Id, user2Id, bloodRequestId) => {
  try {
    const messages = await Message.find({
      bloodRequest: bloodRequestId,
      $or: [
        { sender: user1Id, recipient: user2Id },
        { sender: user2Id, recipient: user1Id }
      ]
    })
    .populate('sender', 'name bloodGroup')
    .sort({ createdAt: 1 });

    return messages;
  } catch (error) {
    throw error;
  }
};

/**
 * Get all conversations for a user
 * @param {string} userId - User ID
 * @returns {Array} - Array of conversations with latest message
 */
const getUserConversations = async (userId) => {
  try {
    // Get all messages where user is sender or recipient
    const messages = await Message.find({
      $or: [
        { sender: userId },
        { recipient: userId }
      ]
    })
    .populate('sender', 'name bloodGroup')
    .populate('recipient', 'name bloodGroup')
    .populate('bloodRequest', 'bloodGroup urgency status')
    .sort({ createdAt: -1 });

    // Group messages by conversation (sender + recipient + bloodRequest)
    const conversations = {};
    messages.forEach(message => {
      const otherUserId = message.sender._id.toString() === userId 
        ? message.recipient._id.toString() 
        : message.sender._id.toString();
      
      const key = `${otherUserId}_${message.bloodRequest._id.toString()}`;
      
      if (!conversations[key]) {
        conversations[key] = {
          otherUser: message.sender._id.toString() === userId 
            ? message.recipient 
            : message.sender,
          bloodRequest: message.bloodRequest,
          lastMessage: message,
          unreadCount: 0
        };
      }
      
      // Count unread messages
      if (message.recipient._id.toString() === userId && !message.isRead) {
        conversations[key].unreadCount++;
      }
    });

    return Object.values(conversations);
  } catch (error) {
    throw error;
  }
};

/**
 * Mark messages as read
 * @param {string} userId - User ID (recipient)
 * @param {string} senderId - Sender ID
 * @param {string} bloodRequestId - Blood request ID
 * @returns {Object} - Update result
 */
const markMessagesAsRead = async (userId, senderId, bloodRequestId) => {
  try {
    const result = await Message.updateMany(
      {
        recipient: userId,
        sender: senderId,
        bloodRequest: bloodRequestId,
        isRead: false
      },
      {
        isRead: true,
        readAt: new Date()
      }
    );

    return { 
      message: 'Messages marked as read',
      count: result.modifiedCount 
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Get unread message count for a user
 * @param {string} userId - User ID
 * @returns {number} - Unread message count
 */
const getUnreadCount = async (userId) => {
  try {
    const count = await Message.countDocuments({
      recipient: userId,
      isRead: false
    });

    return count;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createConversation,
  sendMessage,
  getConversation,
  getUserConversations,
  markMessagesAsRead,
  getUnreadCount
};
