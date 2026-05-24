const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const authRoutes = require('./routes/auth');
const cropRoutes = require('./routes/crops');
const fertilizerRoutes = require('./routes/fertilizers');
const weatherRoutes = require('./routes/weather');
const diseaseRoutes = require('./routes/diseases');
const adminRoutes = require('./routes/admin');
const userRoutes = require('./routes/users');
const contactRoutes = require('./routes/contact');
const publicRoutes = require('./routes/public');
const marketplaceRoutes = require('./routes/marketplace');

const errorHandler = require('./middleware/errorHandler');

const app = express();

// Match routes with or without trailing slash (Amplify may add trailing slashes)
app.use((req, res, next) => {
  if (req.path.length > 1 && req.path.endsWith('/')) {
    const query = req.url.includes('?') ? req.url.slice(req.path.length) : '';
    return res.redirect(308, req.path.slice(0, -1) + query);
  }
  next();
});

const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(',').map((o) => o.trim())
  : true;

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.options('*', cors({ origin: allowedOrigins, credentials: true }));

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

const skipOptions = (req) => req.method === 'OPTIONS';

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: { message: 'Too many attempts. Please try again later.' },
  skip: skipOptions,
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { message: 'Too many requests. Please slow down.' },
  skip: skipOptions,
});

app.use('/api/auth', authLimiter);
app.use('/api', apiLimiter);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/crops', cropRoutes);
app.use('/api/fertilizers', fertilizerRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/diseases', diseaseRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/marketplace', marketplaceRoutes);

app.get('/api/health', (req, res) => {
  const dbState = mongoose.connection.readyState;
  const dbOk = dbState === 1;
  res.status(dbOk ? 200 : 503).json({
    status: dbOk ? 'OK' : 'DEGRADED',
    message: 'Smart AgriTech API',
    database: dbOk ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
  });
});

app.use(errorHandler);

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB Connected Successfully');
  })
  .catch((err) => {
    console.error('❌ MongoDB Connection Error:', err.message);
    process.exit(1);
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
