const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    maxLength: 8
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  plan: {
    type: String,
    enum: ['Full', 'Medio', 'Base'],
    required: true
  },
  classesRemaining: {
    type: Number,
    required: true
  },
  isBlocked: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);