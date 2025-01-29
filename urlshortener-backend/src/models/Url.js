const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
  longUrl: { type: String, required: true },
  shortId: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date }, // Optional expiry date
  clicks: { type: Number, default: 0 }, // Track how many times the URL was accessed
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the User schema
});

module.exports = mongoose.model('Url', urlSchema);