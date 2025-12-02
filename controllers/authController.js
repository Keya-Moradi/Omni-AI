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
            return res.render('login', { message: 'Username already exists.' });
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
        req.session.userId = newUser._id;
        res.redirect('/dashboard');
    } catch (error) {
        console.error('Signup error:', error);
        res.render('login', { message: 'An error occurred during signup. Please try again.' });
    }
};

// Render login page
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
            return res.render('login', { message: 'Invalid username or password.' });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.render('login', { message: 'Invalid username or password.' });
        }

        // Store user ID in session
        req.session.userId = user._id;
        res.redirect('/dashboard');
    } catch (error) {
        console.error('Login error:', error);
        res.render('login', { message: 'An error occurred during login. Please try again.' });
    }
};

// Handle user logout
exports.logout = (req, res) => {
    req.session.destroy(() => {
        res.render('logout', { message: 'You are now logged out. See you soon!' });
    });
};
