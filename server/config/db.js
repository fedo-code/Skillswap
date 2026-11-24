require('dotenv').config();
const mongoose = require('mongoose');

// Cached across invocations: serverless functions reuse warm instances, so we must not
// open a new connection on every request (and must never process.exit()).
let connecting = null;

const connectDB = () => {
  if (mongoose.connection.readyState === 1) return Promise.resolve(mongoose.connection);
  if (!process.env.MONGO_URI) return Promise.reject(new Error('MONGO_URI is not set'));
  if (!connecting) {
    connecting = mongoose
      .connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 8000 })
      .then((m) => {
        console.log('✅ MongoDB Connected');
        return m.connection;
      })
      .catch((err) => {
        connecting = null; // allow a retry on the next request
        throw err;
      });
  }
  return connecting;
};

module.exports = connectDB;
