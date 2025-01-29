const User = require('../models/User');

const checkUser = async (req, res, next) => {
    const { fingerprint } = req.body;
  
    if (!fingerprint) {
      return res.status(400).json({ error: 'Fingerprint is required' });
    }
  
    // Check if the user already exists
    let user = await User.findOne({ fingerprint });
  
    if (!user) {
      const { name } = req.body;
  
      if (!name) {
        return res.status(400).json({ error: 'Please provide your name' });
      }
  
      // Create a new user
      user = new User({ name, fingerprint });
      await user.save();
    }
  
    req.user = user;
    next();
};
  

module.exports = checkUser;