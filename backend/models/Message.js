const mongoose = require('mongoose');

/**
 * Message Schema
 * Represents a message between users (donor and recipient)
 */
const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Sender is required']
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Recipient is required']
  },
  bloodRequest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BloodRequest',
    required: [true, 'Blood request reference is required']
  },
  content: {
    type: String,
    required: [true, 'Message content is required'],
    trim: true,
    maxlength: [1000, 'Message cannot exceed 1000 characters']
  },
  isRead: {
    type: Boolean,
    default: false
  },
  readAt: {
    type: Date,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for finding conversations between two users
messageSchema.index({ sender: 1, recipient: 1, bloodRequest: 1 });

// Index for finding unread messages
messageSchema.index({ recipient: 1, isRead: 1 });

// Index for finding messages by blood request
messageSchema.index({ bloodRequest: 1, createdAt: -1 });

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
