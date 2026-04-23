const express = require('express');
const router = express.Router();
const bloodRequestController = require('../controllers/bloodRequestController');
const auth = require('../middleware/auth');
const validateRequest = require('../middleware/validateRequest');

/**
 * @route   POST /api/blood-requests
 * @desc    Create a new blood request
 * @access  Private
 */
router.post(
  '/',
  auth,
  bloodRequestController.createRequestValidation,
  validateRequest,
  bloodRequestController.createBloodRequest
);

/**
 * @route   GET /api/blood-requests
 * @desc    Get all blood requests with optional filters
 * @access  Public
 */
router.get('/', bloodRequestController.getAllBloodRequests);

/**
 * @route   GET /api/blood-requests/nearby
 * @desc    Get nearby blood requests based on location
 * @access  Public
 */
router.get('/nearby', bloodRequestController.getNearbyRequests);

/**
 * @route   GET /api/blood-requests/my-requests
 * @desc    Get current user's blood requests
 * @access  Private
 */
router.get('/my-requests', auth, bloodRequestController.getUserBloodRequests);

/**
 * @route   GET /api/blood-requests/:id
 * @desc    Get blood request by ID
 * @access  Public
 */
router.get('/:id', bloodRequestController.getBloodRequestById);

/**
 * @route   POST /api/blood-requests/:id/interest
 * @desc    Express interest in a blood request
 * @access  Private
 */
router.post('/:id/interest', auth, bloodRequestController.expressInterest);

/**
 * @route   PUT /api/blood-requests/:id/status
 * @desc    Update blood request status
 * @access  Private
 */
router.put('/:id/status', auth, bloodRequestController.updateRequestStatus);

/**
 * @route   DELETE /api/blood-requests/:id
 * @desc    Delete blood request
 * @access  Private
 */
router.delete('/:id', auth, bloodRequestController.deleteBloodRequest);

module.exports = router;
