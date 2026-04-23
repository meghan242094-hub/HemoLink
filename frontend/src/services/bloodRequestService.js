import api from './api';

/**
 * Create a new blood request
 * @param {Object} requestData - Blood request data
 * @returns {Promise} - API response
 */
export const createBloodRequest = async (requestData) => {
  const response = await api.post('/blood-requests', requestData);
  return response.data;
};

/**
 * Get all blood requests with optional filters
 * @param {Object} filters - Filter options
 * @returns {Promise} - API response
 */
export const getAllBloodRequests = async (filters = {}) => {
  const response = await api.get('/blood-requests', { params: filters });
  return response.data;
};

/**
 * Get nearby blood requests
 * @param {number} longitude - Longitude coordinate
 * @param {number} latitude - Latitude coordinate
 * @param {number} maxDistance - Maximum distance in meters
 * @returns {Promise} - API response
 */
export const getNearbyRequests = async (longitude, latitude, maxDistance) => {
  const response = await api.get('/blood-requests/nearby', {
    params: { longitude, latitude, maxDistance }
  });
  return response.data;
};

/**
 * Get blood request by ID
 * @param {string} requestId - Blood request ID
 * @returns {Promise} - API response
 */
export const getBloodRequestById = async (requestId) => {
  const response = await api.get(`/blood-requests/${requestId}`);
  return response.data;
};

/**
 * Get current user's blood requests
 * @returns {Promise} - API response
 */
export const getUserBloodRequests = async () => {
  const response = await api.get('/blood-requests/my-requests');
  return response.data;
};

/**
 * Express interest in a blood request
 * @param {string} requestId - Blood request ID
 * @returns {Promise} - API response
 */
export const expressInterest = async (requestId) => {
  const response = await api.post(`/blood-requests/${requestId}/interest`);
  return response.data;
};

/**
 * Update blood request status
 * @param {string} requestId - Blood request ID
 * @param {Object} statusData - Status update data
 * @returns {Promise} - API response
 */
export const updateRequestStatus = async (requestId, statusData) => {
  const response = await api.put(`/blood-requests/${requestId}/status`, statusData);
  return response.data;
};

/**
 * Delete blood request
 * @param {string} requestId - Blood request ID
 * @returns {Promise} - API response
 */
export const deleteBloodRequest = async (requestId) => {
  const response = await api.delete(`/blood-requests/${requestId}`);
  return response.data;
};
