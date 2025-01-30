const express = require('express');
const { getLogsForUrl} = require('../controllers/logController');
const checkUser = require('../middleware/checkUser');

const router = express.Router();

router.use(checkUser);

// GET /logs/:shortId - List all logs of a specific url
router.get('/:shortId', getLogsForUrl);

module.exports = router;