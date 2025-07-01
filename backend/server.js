const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

// Route imports
const connectDB = require('./db');
const uploadRoute = require('./routes/upload');
const fileRoutes = require('./routes/fileRoutes');
const authRoutes = require('./routes/authRoutes');
const noteRoutes = require('./routes/noteRoutes');

// Connect to MongoDB
connectDB();

const app = express();

// ✅ CORS config (place before anything else)
const corsOptions = {
  origin: ['http://localhost:3000'],
  credentials: true
};
app.use(cors(corsOptions));

// ✅ Security middleware
app.use(helmet());

// ✅ Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { message: 'Too many requests from this IP, please try again later.' }
});
app.use('/api/', limiter);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { message: 'Too many authentication attempts, please try again later.' }
});
app.use('/api/auth', authLimiter);

// ✅ Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ✅ Static uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ Main API Routes
app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoute);
app.use('/api/files', fileRoutes);
app.use('/api/notes', noteRoutes);

// ✅ Health check route
app.get('/api/health', (req, res) => {
  res.json({
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// ✅ Catch-all for unknown routes
app.all('*', (req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

// ✅ Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);

  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(val => val.message);
    return res.status(400).json({ message: 'Validation Error', errors });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({ message: 'Invalid ID format' });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({ message: `${field} already exists` });
  }

  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({ message: 'CORS policy violation' });
  }

  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// ✅ Graceful shutdown
['SIGTERM', 'SIGINT'].forEach(signal => {
  process.on(signal, () => {
    console.log(`${signal} received. Shutting down gracefully...`);
    server.close(() => {
      console.log('Process terminated');
    });
  });
});

module.exports = app;
