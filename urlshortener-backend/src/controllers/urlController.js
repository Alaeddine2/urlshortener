const validator = require('../utils/validator');
const Url = require('../models/Url');
const authMiddleware = require('../middleware/checkUser');

const shortenUrl = async (req, res) => {
    const { nanoid } = await import('nanoid');
    const { longUrl } = req.body;
    const user = req.user; // get user

    if (!validator.isURL(longUrl)) {
      return res.status(400).json({ error: 'Invalid URL' });
    }
  
    // Generate a unique short ID
    const shortId = nanoid(6);
  
    // Save the URL to the database
    const url = new Url({ longUrl, shortId, user: user._id });
    await url.save();
  
    // Return the shortened URL
    res.status(201).json({ shortUrl: `http://localhost:5000/${shortId}` });
};

const listUserUrls = async (req, res) => {
    const user = req.user;

    // Find all URLs created by the user
    const urls = await Url.find({ user: user._id }).populate('user', 'name');
    res.status(200).json(urls);
};

const updateUrl = async (req, res) => {
    const { shortId } = req.params;
    const { longUrl, expiresAt } = req.body;
    const user = req.user;
  
    
    const url = await Url.findOne({ shortId, user: user._id });
  
    if (!url) {
      return res.status(404).json({ error: 'URL not found or unauthorized' }); // if the user is not correct throw an error
    }
  
    if (longUrl) url.longUrl = longUrl;
    if (expiresAt) url.expiresAt = expiresAt;
    await url.save();
  
    res.status(200).json(url);
};
  
const deleteUrl = async (req, res) => {
    const { shortId } = req.params;
    const user = req.user;
  
    const url = await Url.findOneAndDelete({ shortId, user: user._id });
  
    if (!url) {
      return res.status(404).json({ error: 'URL not found or unauthorized' });
    }
  
    res.status(200).json({ message: 'URL deleted successfully' });
};

const redirectToUrl = async (req, res) => {
    try {
      const { shortId } = req.params;
      
      const url = await Url.findOne({ shortId });
  
      if (!url) {
        return res.status(404).json({ error: 'URL not found' });
      }
  
      url.clicks += 1;
      await url.save();
  
      res.redirect(url.longUrl);
  
    } catch (error) {
      console.error('Redirect error:', error);
      res.status(500).json({ error: 'Server error during redirection' });
    }
  };
  
module.exports = {
    shortenUrl,
    listUserUrls,
    updateUrl,
    deleteUrl,
    redirectToUrl
};