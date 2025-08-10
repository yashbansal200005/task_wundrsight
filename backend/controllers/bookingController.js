const Booking = require('../models/Booking');
const mongoose = require('mongoose');

// Generate available slots for a given day range
exports.getAvailableSlots = async (req, res) => {
    const { from, to } = req.query; // Expecting YYYY-MM-DD format
    if (!from || !to) {
        return res.status(400).json({ error: { code: 'BAD_REQUEST', message: 'Date range (from, to) is required.' } });
    }

    try {
        const startDate = new Date(`${from}T00:00:00Z`);
        const endDate = new Date(`${to}T23:59:59Z`);

        const bookedSlots = await Booking.find({
            startTime: { $gte: startDate, $lte: endDate }
        }).select('slotId -_id');

        const bookedSlotIds = new Set(bookedSlots.map(b => b.slotId));
        const availableSlots = [];

        for (let day = new Date(startDate); day <= endDate; day.setDate(day.getDate() + 1)) {
            // Only generate for the next 7 days from today
            const today = new Date();
            today.setHours(0,0,0,0);
            const sevenDaysFromNow = new Date(today);
            sevenDaysFromNow.setDate(today.getDate() + 7);

            if (day < today || day >= sevenDaysFromNow) continue;
            
            for (let hour = 9; hour < 17; hour++) {
                for (let minute = 0; minute < 60; minute += 30) {
                    const slotTime = new Date(Date.UTC(day.getFullYear(), day.getMonth(), day.getDate(), hour, minute));
                    const slotId = slotTime.toISOString();
                    if (!bookedSlotIds.has(slotId)) {
                        availableSlots.push({
                            slotId,
                            startTime: slotTime,
                            endTime: new Date(slotTime.getTime() + 30 * 60000)
                        });
                    }
                }
            }
        }
        res.status(200).json(availableSlots);
    } catch (error) {
        res.status(500).json({ error: { code: 'SERVER_ERROR', message: error.message } });
    }
};

// Book a new slot
exports.createBooking = async (req, res) => {
    const { slotId } = req.body;
    if (!slotId) {
        return res.status(400).json({ error: { code: 'BAD_REQUEST', message: 'slotId is required.' } });
    }

    try {
        const startTime = new Date(slotId);
        const endTime = new Date(startTime.getTime() + 30 * 60000);

        const booking = new Booking({
            userId: req.user.id,
            slotId,
            startTime,
            endTime
        });

        await booking.save();
        res.status(201).json(booking);
    } catch (error) {
        if (error.code === 11000) { // Mongo duplicate key error
            return res.status(409).json({ error: { code: 'SLOT_TAKEN', message: 'This slot has already been booked.' } });
        }
        res.status(500).json({ error: { code: 'SERVER_ERROR', message: error.message } });
    }
};

// Get bookings for the authenticated patient
exports.getMyBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ userId: req.user.id }).sort({ startTime: 'asc' });
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ error: { code: 'SERVER_ERROR', message: error.message } });
    }
};

// Get all bookings (admin only)
exports.getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({}).populate('userId', 'name email').sort({ startTime: 'asc' });
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ error: { code: 'SERVER_ERROR', message: error.message } });
    }
};