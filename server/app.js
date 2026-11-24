const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// make sure the DB is connected before any other /api route (needed for serverless cold starts)
app.use('/api', async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error('DB connection failed:', err.message);
    res.status(503).json({ message: 'Database unavailable. Check MONGO_URI and Atlas network access.' });
  }
});

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/match', require('./routes/matchRoutes'));
app.use('/api/messages', require('./routes/messageRoutes'));
app.use('/api/swaps', require('./routes/swapRoutes'));

module.exports = app;
