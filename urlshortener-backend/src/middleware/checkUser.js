const User = require('../models/User');

const checkUser = async (req, res, next) => {
  const fingerprint = req.headers["x-fingerprint"]; // get the fingerprint as an identificator of the deivce user
  console.log(fingerprint);
  
  if (!fingerprint) {
      return res.status(400).json({ error: "Fingerprint is required" });
  }

  try {
      // Check if the user already exists
      let user = await User.findOne({ fingerprint });

      if (!user) {

          // Create a new user
          user = new User({ fingerprint });
          await user.save();
      }

      req.user = user;
      next();
  } catch (error) {
      console.error("Error in checkUser middleware:", error);
      res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = checkUser;
