require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const path = require('path');
const methodOverride = require('method-override');
const app = express();
const PORT = process.env.PORT || 3000;

const requiredEnvs = ['MONGODB_URI', 'SESSION_SECRET'];
const missingEnvs = requiredEnvs.filter((name) => !process.env[name]);
if (missingEnvs.length) {
    console.error(`Missing required environment variables: ${missingEnvs.join(', ')}`);
    process.exit(1);
}

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Connect to MongoDB and start server
const startServer = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Connected to MongoDB baby!');

        app.use(session({
            secret: process.env.SESSION_SECRET,
            resave: false,
            saveUninitialized: false,
            store: MongoStore.create({
                mongoUrl: process.env.MONGODB_URI,
                collectionName: 'sessions',
            }),
            cookie: {
                httpOnly: true,
                sameSite: 'lax',
                secure: process.env.NODE_ENV === 'production',
            },
        }));

        // Routes
        app.use('/', require('./routes/authRoutes'));
        app.use('/', require('./routes/conversationRoutes'));
        app.use('/', require('./routes/aiRoutes'));

        // Home Route
        app.get('/', (req, res) => {
            if (req.session.userId) {
                res.redirect('/dashboard');
            } else {
                res.redirect('/login');
            }
        });

        app.listen(PORT, () => {
            console.log(`Server is running on the beautiful port of http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

startServer();
