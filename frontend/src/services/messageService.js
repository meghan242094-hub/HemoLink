import api from './api';

/**
 * Create a new conversation
 * @param {Object} conversationData - Conversation data with recipient and bloodRequest
 * @returns {Promise} - API response
 */
export const createConversation = async (conversationData) => {
  const response = await api.post('/messages/conversations', conversationData);
  return response.data;
};

/**
 * Send a message
 * @param {Object} messageData - Message data
 * @returns {Promise} - API response
 */
export const sendMessage = async (messageData) => {
  const response = await api.post('/messages', messageData);
  return response.data;
};

/**
 * Get conversation between two users
 * @param {string} userId - Other user ID
 * @param {string} bloodRequestId - Blood request ID
 * @returns {Promise} - API response
 */
export const getConversation = async (userId, bloodRequestId) => {
  const response = await api.get(`/messages/${userId}/${bloodRequestId}`);
  return response.data;
};

/**
 * Get all user conversations
 * @returns {Promise} - API response
 */
export const getUserConversations = async () => {
  const response = await api.get('/messages/conversations');
  return response.data;
};

/**
 * Mark messages as read
 * @param {Object} data - Data with senderId and bloodRequestId
 * @returns {Promise} - API response
 */
export const markAsRead = async (data) => {
  const response = await api.put('/messages/mark-read', data);
  return response.data;
};

/**
 * Get unread message count
 * @returns {Promise} - API response
 */
export const getUnreadCount = async () => {
  const response = await api.get('/messages/unread-count');
  return response.data;
};
