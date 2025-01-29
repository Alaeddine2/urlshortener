const express = require('express');
const { shortenUrl, redirectToUrl, listUserUrls, updateUrl, deleteUrl } = require('../controllers/urlController');
const checkUser = require('../middleware/checkUser');
const rateLimit = require('express-rate-limit');

const router = express.Router();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
});

router.use(checkUser);

// POST /shorten - Shorten a URL
router.post('/shorten', limiter, shortenUrl);

// GET /:shortId - Redirect to the original URL
router.get('/:shortId', redirectToUrl);

// GET /user/urls - List all URLs created by a specific user
router.get('/user/urls', listUserUrls);

// PUT /user/urls/:shortId - Update an URL
router.put('/user/urls/:shortId', updateUrl);

// DELETE /user/urls/:shortId - Delete an URL
router.delete('/user/urls/:shortId', deleteUrl);

module.exports = router;