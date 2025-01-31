const Url = require('../models/Url');
const Log = require("../models/Log");

const getLogsForUrl = async (req, res) => {
    try {
        const { shortId } = req.params;
        const user = req.user;
        const page = req.query.page && !isNaN(req.query.page) ? parseInt(req.query.page) : null;
        const limit = req.query.limit && !isNaN(req.query.limit) ? parseInt(req.query.limit) : null;
        
        if (page === null || limit === null || page < 1 || limit < 1) {
            return res.status(400).json({
                code: "API.LOG.LIST.FAIL",
                message: "Invalid pagination parameters",
                success: false,
                error: "Invalid pagination parameters"
            });
        }

        const url = await Url.findOne({ shortId });
        if (!url) {
            return res.status(404).json({
                code: "API.LOG.LIST.FAIL",
                message: "URL not found",
                success: false,
                error: "URL not found"
            });
        }

        // Check if the user has permission to view the logs
        if (url.user._id.toString() !== user._id.toString()) {
            return res.status(401).json({
                code: "API.LOG.LIST.FAIL",
                message: "unauthorized",
                success: false,
                error: "unauthorized"
            });
        }

        const skip = (page - 1) * limit;
        const logs = await Log.find({ url: url._id })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));
        //Total 
        const totalLogs = await Log.countDocuments({ url: url._id });
        
        return res.status(200).json({
            code: "API.LOG.LIST.ACCEPT",
            message: "accepted",
            success: true,
            data: logs,
            pagination: {
                total: totalLogs,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(totalLogs / limit)
            }
        });
    } catch (error) {
        console.error("Fetch logs error:", error);
        res.status(500).json({ error: "Server error while fetching logs" });
    }
};

module.exports = {
    getLogsForUrl
};