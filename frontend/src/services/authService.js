import api from './api';

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @returns {Promise} - API response
 */
export const register = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

/**
 * Login user
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise} - API response
 */
export const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

/**
 * Get current user profile
 * @returns {Promise} - API response
 */
export const getProfile = async () => {
  const response = await api.get('/auth/profile');
  return response.data;
};

/**
 * Update user profile
 * @param {Object} updateData - Data to update
 * @returns {Promise} - API response
 */
export const updateProfile = async (updateData) => {
  const response = await api.put('/auth/profile', updateData);
  return response.data;
};
