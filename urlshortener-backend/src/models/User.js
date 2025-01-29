const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String },
  fingerprint: { type: String, unique: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('m_user', userSchema);