const User = require('../models/User');

const checkUser = async (req, res, next) => {
  try {
    const fingerprint = req.headers?.["x-fingerprint"];
    if (!fingerprint) {
      return res.status(400).json({ error: "Fingerprint is required" });
    }

    let user = await User.findOne({ fingerprint });
   /* if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }*/

    if (!user) {
      // Create a new user
      user = new User({ fingerprint });
      await user.save();
    }
    req.user = user;
    next();
  } catch (error) {
    console.error("Database Error in checkUser middleware:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = checkUser;
