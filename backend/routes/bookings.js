const express = require('express');
const { getAvailableSlots, createBooking, getMyBookings, getAllBookings } = require('../controllers/bookingController');
const { protect, isAdmin } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/slots', getAvailableSlots);
router.post('/book', protect, createBooking);
router.get('/my-bookings', protect, getMyBookings);
router.get('/all-bookings', protect, isAdmin, getAllBookings);

module.exports = router;