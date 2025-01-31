const validator = require('../utils/validator');
const Url = require('../models/Url');
const useragent = require("useragent");
const Log = require("../models/Log");

const shortenUrl = async (req, res) => {
  try {
    const { nanoid } = await import('nanoid');
    const { longUrl,name,expiresAt } = req.body;
    const user = req.user;

    if (!validator.isURL(longUrl)) {
      return res.status(400).json({
        code: "API.SHORTURL.CREATION.FAIL",
        message: "Invalid URL",
        success: false,
        error: 'Invalid URL'
      });
    }
  
    // Generate a unique short ID
    const shortId = nanoid(6);
    const shortUrl = `${process.env.url}/v1/${shortId}`;
    
    const url = new Url({ longUrl, shortId, shortUrl, user: user._id, name, expiresAt });
    await url.save();
  
    return res.status(201).json({
      code: "API.SHORTURL.CREATION.ACCEPT",
      message: "new shortul created",
      success: true,
      data: url
    });
  } catch (error) {
    console.error("Shorten URL Error:", error);
    return res.status(500).json({
      code: "API.SHORTURL.CREATION.FAIL",
      message: "Internal Error",
      success: false,
      error: error.message
    });
  }
};

const listUserUrls = async (req, res) => {
  try{
    const user = req.user;

    const urls = await Url.find({ user: user._id }).sort({ createdAt: -1 }).populate('user', 'name');
    return res.status(200).json({
      code: "API.SHORTURL.LIST.ACCEPT",
      message: "get utls list",
      success: true,
      data: urls
    });
  }catch (error) {
    res.status(500).json({
      code: "API.SHORTURL.LIST.FAIL",
      message: "Internal Error",
      success: false,
      error: error
    });
  }
};

const updateUrl = async (req, res) => {
  try{
    const { shortId } = req.params;
    const { longUrl, expiresAt, name } = req.body;
    const user = req.user;
  
    const url = await Url.findOne({ shortId });

    // Test if user has permission to update the URL
    if (url.user._id.toString() != user._id.toString()) {
      return res.status(401).json({
        code: "API.SHORTURL.UPDATE.FAIL",
        message: "URL not found or unauthorized",
        success: false,
        error: "URL not found or unauthorized"
      });
    }

    if (!url) {
      return res.status(404).json({
        code: "API.SHORTURL.UPDATE.FAIL",
        message: "URL not found or unauthorized",
        success: false,
        error: "URL not found or unauthorized"
      });
    }
  
    if (longUrl) url.longUrl = longUrl;
    if (expiresAt) url.expiresAt = expiresAt;
    if (name) url.name = name;
    await url.save();
  
    return res.status(200).json({
      code: "API.SHORTURL.UPDATE.ACCEPT",
      message: "URL updated",
      success: true,
      data: url
    });
  }catch (error) {
    res.status(500).json({
      code: "API.SHORTURL.UPDATE.FAIL",
      message: "Internal Error",
      success: false,
      error: error
    });
  }
    
};
  
const deleteUrl = async (req, res) => {
    const { shortId } = req.params;
    const user = req.user;
  
    const url = await Url.findOneAndDelete({ shortId, user: user._id });
  
    if (!url) {
      return res.status(404).json({
        code: "API.SHORTURL.DELETE.FAIL",
        message: "URL not found or unauthorized",
        success: false,
        error: "URL not found or unauthorized"
      });
    }
  
    return res.status(200).json({
      code: "API.SHORTURL.DELETE.ACCEPT",
      message: "URL DELETED",
      success: true,
      data: "Accept"
    });
};

const redirectToUrl = async (req, res) => {
  try {
    const { shortened_id } = req.params;
    const url = await Url.findOne({ shortId: shortened_id });
    
    if (!url) {
        return res.status(404).json({ error: "URL not found" });
    }

    if (url.expiresAt && new Date(url.expiresAt) < new Date()) {
      return res.status(410).json({ message: "This URL has expired" });
    }

    url.clicks += 1;
    await url.save();

    const visitorIP = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    const agent = useragent.parse(req.headers["user-agent"]);
    const browser = agent.family; 

    
    await Log.create({
        visitorIP,
        browser,
        url: url._id,
    });

    res.redirect(url.longUrl);

  } catch (error) {
      console.error("Redirect error:", error);
      res.status(500).json({ error: "Server error during redirection" });
  }
};
  
module.exports = {
    shortenUrl,
    listUserUrls,
    updateUrl,
    deleteUrl,
    redirectToUrl
};