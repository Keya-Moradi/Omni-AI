require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo'); // Import connect-mongo
const path = require('path');
const methodOverride = require('method-override');
const app = express();
const PORT = process.env.PORT || 3000;

// Imported Controllers
const authController = require('./controllers/authController');
const conversationController = require('./controllers/conversationController');
const aiController = require('./controllers/aiController');

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB baby!');
    })
    .catch((error) => {
        console.error('MongoDB connection error:', error);
    });

// Session Management using MongoDB store
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI,
        collectionName: 'sessions',
    }),
}));

// Home Route
app.get('/', (req, res) => {
    if (req.session.userId) {
        res.redirect('/dashboard');
    } else {
        res.redirect('/login');
    }
});

// Routes for authentication
app.get('/signup', authController.signupPage);
app.post('/signup', authController.signup);
app.get('/login', authController.loginPage);
app.post('/login', authController.login);
app.get('/logout', authController.logout);

// Routes for conversations
app.get('/dashboard', conversationController.viewConversations);
app.post('/conversation/start', conversationController.startConversation);
app.put('/conversation/edit', conversationController.editConversation);
app.delete('/conversation/delete/:conversationId', conversationController.deleteConversation);

// Routes to start AI conversation
app.post('/conversation/ai', aiController.startAIConversation);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on the beautiful port of http://localhost:${PORT}`);
});
