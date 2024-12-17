const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  className: {
    type: String,
    enum: ['Full Body', 'Funcional'],
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['confirmada', 'cancelada'],
    default: 'confirmada'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Índice compuesto para evitar reservas duplicadas
bookingSchema.index({ user: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Booking', bookingSchema);