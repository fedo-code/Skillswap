// Local development entry. On Vercel the app is served by api/index.js instead.
const app = require('./app');
const connectDB = require('./config/db');

connectDB().catch((err) => console.error('❌ DB Connection Failed:', err.message));

// PORT belongs to the React dev server (3000); the API must stay on 5000 to match the proxy.
const PORT = process.env.SERVER_PORT || 5000;
app.listen(PORT, () => console.log(`🔥 Server running on port ${PORT}`));
