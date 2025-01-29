const Url = require('../models/Url');
const Log = require("../models/Log");

const getLogsForUrl = async (req, res) => {
    try {
        const { shortId } = req.params;
        console.log(shortId);
        
        const url = await Url.findOne({ shortId });
        if (!url) {
            return res.status(404).json({ error: "URL not found" });
        }

        const logs = await Log.find({ url: url._id }).sort({ createdAt: -1 });

        res.status(200).json(logs);
    } catch (error) {
        console.error("Fetch logs error:", error);
        res.status(500).json({ error: "Server error while fetching logs" });
    }
};

module.exports = {
    getLogsForUrl
};