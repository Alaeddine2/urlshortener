const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  Status: { type: Boolean, default: true },
  visitorIP: { type: String, required: true},
  createdAt: { type: Date, default: Date.now },
  browser: { type: String },
  url: { type: mongoose.Schema.Types.ObjectId, ref: 'm_url', required: true },
});

module.exports = mongoose.model('m_log', logSchema);