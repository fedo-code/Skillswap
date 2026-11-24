



const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/match', require('./routes/matchRoutes'));
app.use('/api/messages', require('./routes/messageRoutes'));
app.use('/api/swaps', require('./routes/swapRoutes'));

<<<<<<< HEAD
// PORT belongs to the React dev server (3000); the API must stay on 5000 to match the proxy.
const PORT = process.env.SERVER_PORT || 5000;
=======
const PORT = process.env.SERVER_PORT || process.env.PORT || 5000;
>>>>>>> 7c3fc543dc70aadbedfc116e4352f58f324588f3
app.listen(PORT, () => console.log(`🔥 Server running on port ${PORT}`));