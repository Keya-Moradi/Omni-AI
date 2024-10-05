const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Render signup page
exports.signupPage = (req, res) => {
    res.render('login', { message: '' });
};

// Handle user signup
exports.signup = async (req, res) => {
    try {
        const { username, password, email, profile_info, preferences } = req.body;

        // Check if username already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.render('login', { message: 'Username already exists baby!' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({
            username,
            password: hashedPassword,
            email,
            profile_info,
            preferences,
            conversations: []
        });

        await newUser.save();
        req.session.userID = newUser._id;
        res.redirect('/dashboard');
    } catch (error) {
        console.error('Signup error:', error);
        res.render('login', { message: 'Signup failed. Try again baby!' })
    }
};

// Render login pager
exports.loginPage = (req, res) => {
    res.render('login', { message: '' });
};

// Handle user login
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find user by username
        const user = await User.findOne({ username });
        if (!user) {
            return res.render('login', { message: 'Please try again. Invalid credentials baby!' });
        }
        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.render('login', { message: 'Please try again. Invalid credentials baby!' });
        }

        // Store user ID in session
        req.session.userID = user._id;
        res.redirect('/dashboard');
    } catch (error) {
        console.error('Login error:', error);
        res.render('login', { message: 'Login failed. Try again baby!' });
    }
};

// Handle Logout for user
exports.logout = (req, res) => {
    req.session.destroy(() => {
        res.render('logout', { message: 'You have been logged out. See you soon baby!' });
    });
};