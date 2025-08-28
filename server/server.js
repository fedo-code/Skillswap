const express = require('express');
const cors = require('cors');
const path = require('path'); // ✅ ADD THIS LINE
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ ADD THESE LINES FOR STATIC FILES (Render ke liye important)
app.use(express.static(path.join(__dirname, '../build')));

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/match', require('./routes/matchRoutes'));
app.use('/api/messages', require('./routes/messageRoutes'));

// ✅ ADD THIS CATCH-ALL ROUTE (SPA ke liye important)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🔥 Server running on port ${PORT}`));