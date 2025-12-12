// Bootstrap core libs and security middleware
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const path = require('path');
const methodOverride = require('method-override');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const csrf = require('csurf');
const app = express();
const PORT = process.env.PORT || 3000;

// Ensure required env vars exist before booting
const requiredEnvs = ['MONGODB_URI', 'SESSION_SECRET'];
const missingEnvs = requiredEnvs.filter((name) => !process.env[name]);
if (missingEnvs.length) {
    console.error(`Missing required environment variables: ${missingEnvs.join(', ')}`);
    process.exit(1);
}

// Trust proxy when running behind HTTPS terminators
if (process.env.NODE_ENV === 'production' || process.env.TRUST_PROXY === 'true') {
    app.set('trust proxy', 1);
}

// Rate limits for auth and AI endpoints
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
});

const aiLimiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 30,
    standardHeaders: true,
    legacyHeaders: false,
});

const csrfProtection = csrf();

// Core middleware stack
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));
app.use(helmet());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Connect to MongoDB and start server
const startServer = async () => {
    try {
        // Connect to Mongo and only start the app once the DB is reachable
        await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Connected to MongoDB baby!');

        // Persist sessions in Mongo
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

        // CSRF protection for all state-changing requests
        app.use(csrfProtection);
        app.use((req, res, next) => {
            res.locals.csrfToken = req.csrfToken();
            next();
        });

        // Rate limiting
        app.use(['/login', '/signup'], authLimiter);
        app.use(['/conversation/start', '/conversation/edit', '/conversation/delete', '/conversation/ai'], aiLimiter);

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

// CSRF error handler
app.use((err, req, res, next) => {
    if (err.code === 'EBADCSRFTOKEN') {
        return res.status(403).send('Invalid CSRF token');
    }
    return next(err);
});
