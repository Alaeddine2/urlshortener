const express = require('express');
const dotenv = require('dotenv');
const mainRoute = require('./routes/mainRoutes');
const connectDB = require('./config/db');
const cors = require("cors");
dotenv.config();


const app = express();
app.use(cors());

// Connect to databse
if (process.env.NODE_ENV !== "test") {
  connectDB(); 
}

app.use(express.json());

// Routes
app.use('/v1/', mainRoute)


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

module.exports = app;


if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
