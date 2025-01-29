const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const urlRoutes = require('./routes/urlRoutes');
const connectDB = require('./config/db');

dotenv.config();

const app = express();

// Connect to databse
connectDB();

app.use(express.json()); // Parse JSON bodies

// Routes
app.use('/', urlRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});