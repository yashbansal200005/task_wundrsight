const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const User = require('./models/User'); // Import User model for seeding

dotenv.config();

const authRoutes = require('./routes/auth');
const bookingRoutes = require('./routes/bookings');

const app = express();

// --- START: MODIFIED CORS CONFIGURATION ---
// This list holds all the web addresses that are allowed to make requests to this backend.
const allowedOrigins = [
    'http://localhost:5173', // Your Vite frontend's development URL
    // When you deploy your frontend to Vercel/Netlify, add its URL here.
    // e.g., 'https://my-booking-app.vercel.app'
];

app.use(cors({
    origin: function (origin, callback) {
        // If the incoming request's origin is in our `allowedOrigins` list, allow it.
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            // Otherwise, block it with a CORS error.
            callback(new Error('Not allowed by CORS'));
        }
    }
}));
// --- END: MODIFIED CORS CONFIGURATION ---


app.use(express.json());

// API Routes
app.use('/api', authRoutes);
app.use('/api', bookingRoutes);

// Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error(err));

// Seed Admin User
const seedAdmin = async () => {
    try {
        const adminExists = await User.findOne({ email: 'admin@example.com' });
        if (!adminExists) {
            const admin = new User({
                name: 'Admin User',
                email: 'admin@example.com',
                passwordHash: 'Password!', // Password will be hashed by the pre-save hook
                role: 'admin'
            });
            await admin.save();
            console.log('Admin user seeded.');
        }
    } catch (error) {
        console.error('Error seeding admin user:', error);
    }
};

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    seedAdmin();
});