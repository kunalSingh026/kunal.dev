require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const sequelize = require('./config/db');

// Import routes
const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const experienceRoutes = require('./routes/experienceRoutes');
const messageRoutes = require('./routes/messageRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware configuration
const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Static folder (for project images, etc.)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Register API Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/experiences', experienceRoutes);
app.use('/api/messages', messageRoutes);

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date() });
});

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ message: 'Resource not found' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    message: 'An unexpected server error occurred.',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// Connect database and run server
async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('Successfully connected to SQLite database.');

    // Sync models (creates tables if they do not exist)
    await sequelize.sync();
    console.log('Database models synchronized.');

    app.listen(PORT, () => {
      console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to start the application server:', error);
    process.exit(1);
  }
}

startServer();
