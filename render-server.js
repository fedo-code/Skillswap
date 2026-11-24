// render-server.js - Special for Render.com
const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const connectDB = require('./server/config/db');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Static files for React build
app.use(express.static(path.join(__dirname, 'build')));

// ✅ API Routes (SAME AS YOUR ORIGINAL)
app.use('/api/auth', require('./server/routes/authRoutes'));
app.use('/api/users', require('./server/routes/userRoutes'));
app.use('/api/match', require('./server/routes/matchRoutes'));
app.use('/api/messages', require('./server/routes/messageRoutes'));
app.use('/api/swaps', require('./server/routes/swapRoutes'));

app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is working!' });
});

// ✅ SPA Support
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🔥 Server running on port ${PORT}`));