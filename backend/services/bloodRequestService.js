const BloodRequest = require('../models/BloodRequest');
const User = require('../models/User');

/**
 * Create a new blood request
 * @param {Object} requestData - Blood request data
 * @param {string} recipientId - ID of the user creating the request
 * @returns {Object} - Created blood request
 */
const createBloodRequest = async (requestData, recipientId) => {
  try {
    // Add recipient to request data
    requestData.recipient = recipientId;

    // Create blood request
    const bloodRequest = await BloodRequest.create(requestData);

    // Populate recipient details
    await bloodRequest.populate('recipient', 'name email phone bloodGroup');

    return bloodRequest;
  } catch (error) {
    throw error;
  }
};

/**
 * Get all blood requests with optional filters
 * @param {Object} filters - Filter options
 * @returns {Array} - Array of blood requests
 */
const getAllBloodRequests = async (filters = {}) => {
  try {
    const { bloodGroup, urgency, city, status = 'active' } = filters;

    // Build query
    const query = { status };

    if (bloodGroup) {
      query.bloodGroup = bloodGroup;
    }

    if (urgency) {
      query.urgency = urgency;
    }

    if (city) {
      query['location.city'] = { $regex: city, $options: 'i' };
    }

    // Exclude expired requests
    query.expiresAt = { $gt: new Date() };

    // Get requests sorted by urgency and creation date
    const requests = await BloodRequest.find(query)
      .populate('recipient', 'name email phone')
      .sort({ urgency: -1, createdAt: -1 });

    return requests;
  } catch (error) {
    throw error;
  }
};

/**
 * Get nearby blood requests based on user location
 * @param {Array} coordinates - [longitude, latitude]
 * @param {number} maxDistance - Maximum distance in meters (default: 50km)
 * @returns {Array} - Array of nearby blood requests
 */
const getNearbyBloodRequests = async (coordinates, maxDistance = 50000) => {
  try {
    const requests = await BloodRequest.find({
      status: 'active',
      expiresAt: { $gt: new Date() },
      'location.coordinates': {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: coordinates
          },
          $maxDistance: maxDistance
        }
      }
    })
    .populate('recipient', 'name email phone')
    .sort({ urgency: -1, createdAt: -1 });

    return requests;
  } catch (error) {
    throw error;
  }
};

/**
 * Get blood request by ID
 * @param {string} requestId - Blood request ID
 * @returns {Object} - Blood request details
 */
const getBloodRequestById = async (requestId) => {
  try {
    const request = await BloodRequest.findById(requestId)
      .populate('recipient', 'name email phone bloodGroup location')
      .populate('interestedDonors', 'name bloodGroup location');

    if (!request) {
      throw new Error('Blood request not found');
    }

    return request;
  } catch (error) {
    throw error;
  }
};

/**
 * Get blood requests created by a user
 * @param {string} userId - User ID
 * @returns {Array} - Array of user's blood requests
 */
const getUserBloodRequests = async (userId) => {
  try {
    const requests = await BloodRequest.find({ recipient: userId })
      .populate('interestedDonors', 'name bloodGroup phone')
      .populate('fulfilledBy', 'name bloodGroup phone')
      .sort({ createdAt: -1 });

    return requests;
  } catch (error) {
    throw error;
  }
};

/**
 * Express interest in a blood request
 * @param {string} requestId - Blood request ID
 * @param {string} donorId - Donor user ID
 * @returns {Object} - Updated blood request
 */
const expressInterest = async (requestId, donorId) => {
  try {
    const request = await BloodRequest.findById(requestId);

    if (!request) {
      throw new Error('Blood request not found');
    }

    if (request.status !== 'active') {
      throw new Error('This request is no longer active');
    }

    // Check if donor already expressed interest
    if (request.interestedDonors.includes(donorId)) {
      throw new Error('You have already expressed interest in this request');
    }

    // Add donor to interested donors
    request.interestedDonors.push(donorId);
    await request.save();

    await request.populate('interestedDonors', 'name bloodGroup phone');

    return request;
  } catch (error) {
    throw error;
  }
};

/**
 * Update blood request status
 * @param {string} requestId - Blood request ID
 * @param {string} status - New status
 * @param {string} fulfilledBy - ID of donor who fulfilled the request (optional)
 * @returns {Object} - Updated blood request
 */
const updateBloodRequestStatus = async (requestId, status, fulfilledBy = null) => {
  try {
    const request = await BloodRequest.findById(requestId);

    if (!request) {
      throw new Error('Blood request not found');
    }

    request.status = status;

    if (status === 'fulfilled' && fulfilledBy) {
      request.fulfilledBy = fulfilledBy;
      request.fulfilledAt = new Date();
    }

    await request.save();

    await request.populate('recipient', 'name email phone');
    await request.populate('fulfilledBy', 'name bloodGroup phone');

    return request;
  } catch (error) {
    throw error;
  }
};

/**
 * Delete blood request
 * @param {string} requestId - Blood request ID
 * @param {string} userId - User ID (for authorization)
 * @returns {Object} - Deleted request
 */
const deleteBloodRequest = async (requestId, userId) => {
  try {
    const request = await BloodRequest.findById(requestId);

    if (!request) {
      throw new Error('Blood request not found');
    }

    // Check if user is the recipient
    if (request.recipient.toString() !== userId) {
      throw new Error('You are not authorized to delete this request');
    }

    await BloodRequest.findByIdAndDelete(requestId);

    return { message: 'Blood request deleted successfully' };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createBloodRequest,
  getAllBloodRequests,
  getNearbyBloodRequests,
  getBloodRequestById,
  getUserBloodRequests,
  expressInterest,
  updateBloodRequestStatus,
  deleteBloodRequest
};
