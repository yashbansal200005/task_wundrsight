const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    slotId: { type: String, required: true, unique: true }, // e.g., "2025-08-10T09:00:00Z"
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);