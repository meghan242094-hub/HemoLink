const { body } = require('express-validator');
const bloodRequestService = require('../services/bloodRequestService');

/**
 * Validation rules for creating blood request
 */
const createRequestValidation = [
  body('bloodGroup')
    .notEmpty().withMessage('Blood group is required')
    .isIn(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']).withMessage('Invalid blood group'),
  body('unitsNeeded')
    .notEmpty().withMessage('Units needed is required')
    .isInt({ min: 1, max: 10 }).withMessage('Units must be between 1 and 10'),
  body('urgency')
    .notEmpty().withMessage('Urgency is required')
    .isIn(['critical', 'urgent', 'normal']).withMessage('Invalid urgency level'),
  body('hospitalName')
    .trim()
    .notEmpty().withMessage('Hospital name is required'),
  body('location.address')
    .trim()
    .notEmpty().withMessage('Address is required'),
  body('location.city')
    .trim()
    .notEmpty().withMessage('City is required'),
  body('location.state')
    .trim()
    .notEmpty().withMessage('State is required'),
  body('location.coordinates')
    .isArray({ min: 2, max: 2 }).withMessage('Coordinates must be an array of [longitude, latitude]'),
  body('patientName')
    .trim()
    .notEmpty().withMessage('Patient name is required'),
  body('patientAge')
    .notEmpty().withMessage('Patient age is required')
    .isInt({ min: 0, max: 120 }).withMessage('Invalid age'),
  body('contactPerson')
    .trim()
    .notEmpty().withMessage('Contact person is required'),
  body('contactPhone')
    .trim()
    .notEmpty().withMessage('Contact phone is required')
];

/**
 * Create a new blood request
 */
const createBloodRequest = async (req, res) => {
  try {
    const bloodRequest = await bloodRequestService.createBloodRequest(req.body, req.user._id);

    res.status(201).json({
      success: true,
      message: 'Blood request created successfully',
      data: bloodRequest
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Get all blood requests with optional filters
 */
const getAllBloodRequests = async (req, res) => {
  try {
    const filters = {
      bloodGroup: req.query.bloodGroup,
      urgency: req.query.urgency,
      city: req.query.city,
      status: req.query.status
    };

    const requests = await bloodRequestService.getAllBloodRequests(filters);

    res.status(200).json({
      success: true,
      count: requests.length,
      data: requests
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Get nearby blood requests
 */
const getNearbyRequests = async (req, res) => {
  try {
    const { longitude, latitude, maxDistance } = req.query;

    if (!longitude || !latitude) {
      return res.status(400).json({
        success: false,
        message: 'Longitude and latitude are required'
      });
    }

    const coordinates = [parseFloat(longitude), parseFloat(latitude)];
    const distance = maxDistance ? parseInt(maxDistance) : 50000;

    const requests = await bloodRequestService.getNearbyBloodRequests(coordinates, distance);

    res.status(200).json({
      success: true,
      count: requests.length,
      data: requests
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Get blood request by ID
 */
const getBloodRequestById = async (req, res) => {
  try {
    const request = await bloodRequestService.getBloodRequestById(req.params.id);

    res.status(200).json({
      success: true,
      data: request
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Get current user's blood requests
 */
const getUserBloodRequests = async (req, res) => {
  try {
    const requests = await bloodRequestService.getUserBloodRequests(req.user._id);

    res.status(200).json({
      success: true,
      count: requests.length,
      data: requests
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Express interest in a blood request
 */
const expressInterest = async (req, res) => {
  try {
    const request = await bloodRequestService.expressInterest(req.params.id, req.user._id);

    res.status(200).json({
      success: true,
      message: 'Interest expressed successfully',
      data: request
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Update blood request status
 */
const updateRequestStatus = async (req, res) => {
  try {
    const { status, fulfilledBy } = req.body;
    const request = await bloodRequestService.updateBloodRequestStatus(
      req.params.id,
      status,
      fulfilledBy
    );

    res.status(200).json({
      success: true,
      message: 'Request status updated successfully',
      data: request
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Delete blood request
 */
const deleteBloodRequest = async (req, res) => {
  try {
    const result = await bloodRequestService.deleteBloodRequest(req.params.id, req.user._id);

    res.status(200).json({
      success: true,
      message: result.message
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  createBloodRequest,
  getAllBloodRequests,
  getNearbyRequests,
  getBloodRequestById,
  getUserBloodRequests,
  expressInterest,
  updateRequestStatus,
  deleteBloodRequest,
  createRequestValidation
};
