const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  skillsOffered: [String],
  skillsWanted: [String],
}, { timestamps: true });

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
