const mongoose = require('mongoose');

/**
 * Blood Request Schema
 * Represents a blood donation request from a recipient
 */
const bloodRequestSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Recipient is required']
  },
  bloodGroup: {
    type: String,
    required: [true, 'Blood group is required'],
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
  },
  unitsNeeded: {
    type: Number,
    required: [true, 'Number of units needed is required'],
    min: [1, 'At least 1 unit is required'],
    max: [10, 'Cannot request more than 10 units at once']
  },
  urgency: {
    type: String,
    required: [true, 'Urgency level is required'],
    enum: ['critical', 'urgent', 'normal'],
    default: 'normal'
  },
  hospitalName: {
    type: String,
    required: [true, 'Hospital name is required'],
    trim: true
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      required: [true, 'Location coordinates are required']
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true
    },
    state: {
      type: String,
      required: [true, 'State is required'],
      trim: true
    }
  },
  patientName: {
    type: String,
    required: [true, 'Patient name is required'],
    trim: true
  },
  patientAge: {
    type: Number,
    required: [true, 'Patient age is required'],
    min: [0, 'Age cannot be negative'],
    max: [120, 'Invalid age']
  },
  contactPerson: {
    type: String,
    required: [true, 'Contact person name is required'],
    trim: true
  },
  contactPhone: {
    type: String,
    required: [true, 'Contact phone is required'],
    trim: true
  },
  additionalNotes: {
    type: String,
    trim: true,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  },
  status: {
    type: String,
    enum: ['active', 'fulfilled', 'cancelled'],
    default: 'active'
  },
  interestedDonors: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  fulfilledBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  fulfilledAt: {
    type: Date,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date,
    default: function() {
      // Request expires after 7 days
      const expires = new Date(this.createdAt);
      expires.setDate(expires.getDate() + 7);
      return expires;
    }
  }
});

// Index for geospatial queries
bloodRequestSchema.index({ 'location.coordinates': '2dsphere' });

// Index for finding active requests
bloodRequestSchema.index({ status: 1, expiresAt: 1 });

// Index for finding requests by blood group
bloodRequestSchema.index({ bloodGroup: 1, status: 1 });

const BloodRequest = mongoose.model('BloodRequest', bloodRequestSchema);

module.exports = BloodRequest;
