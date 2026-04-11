const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');

if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'temporary_fallback_secret_for_dev_only';
  console.warn('⚠️ Warning: JWT_SECRET is missing from .env, using fallback.');
}

const mockDb = require('./config/mockDb');

const app = express();

app.use(cors());
app.use(express.json());

console.log('Mock Database initialized.');

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));

// Serve uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, '127.0.0.1', () => {
    console.log(`Server running on http://127.0.0.1:${PORT}`);
  });
}

module.exports = app;
