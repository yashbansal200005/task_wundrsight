const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

exports.register = async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ error: { code: 'BAD_REQUEST', message: 'All fields are required.' } });
    }

    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ error: { code: 'USER_EXISTS', message: 'User already exists.' } });
        }

        const user = new User({ name, email, passwordHash: password });
        await user.save();

        res.status(201).json({
            message: 'User registered successfully.'
        });
    } catch (error) {
        res.status(500).json({ error: { code: 'SERVER_ERROR', message: error.message } });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: { code: 'BAD_REQUEST', message: 'Email and password are required.' } });
    }

    try {
        const user = await User.findOne({ email });
        if (user && (await user.matchPassword(password))) {
            res.status(200).json({
                token: generateToken(user._id, user.role),
                role: user.role
            });
        } else {
            res.status(401).json({ error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password.' } });
        }
    } catch (error) {
        res.status(500).json({ error: { code: 'SERVER_ERROR', message: error.message } });
    }
};