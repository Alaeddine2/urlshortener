const express = require('express');
const { shortenUrl, redirectToUrl, listUserUrls, updateUrl, deleteUrl } = require('../controllers/urlController');
const checkUser = require('../middleware/checkUser');

const router = express.Router();


// GET /:shortId - Redirect to the original URL
router.get("/:shortened_id", redirectToUrl);

router.use(checkUser);

// POST /shorten - Shorten a URL
router.post('/shorten', shortenUrl);

// GET /user/urls - List all URLs created by a specific user
router.get('/user/urls', listUserUrls);

// PUT /user/urls/:shortId - Update an URL
router.put('/user/urls/:shortId', updateUrl);

// DELETE /user/urls/:shortId - Delete an URL
router.delete('/user/urls/:shortId', deleteUrl);

module.exports = router;