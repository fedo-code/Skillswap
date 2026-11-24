require("dotenv").config();
const mongoose = require('mongoose');
console.log("CURRENT URI:", process.env.MONGO_URI);
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected');
  } catch (err) {
    console.error('❌ DB Connection Failed:', err);
    process.exit(1);
  }
};

module.exports = connectDB;
