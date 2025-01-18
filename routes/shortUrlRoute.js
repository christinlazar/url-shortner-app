const express = require('express');
const { createShortUrl,shortUrlRedirecter } = require('../controllers/shortUrlController');
const {getUrlAnalytics} = require('../controllers/urlAnalyticsController')
const {rateLimiter} = require('../config/rateLimiter');
const { topicBasedAnalytics } = require('../controllers/topicBasedAnalytics');
const { getOverallAnalytics } = require('../controllers/overallAnalyticsController');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/shorten', rateLimiter, authMiddleware, createShortUrl);
router.get('/shorten/:alias',authMiddleware,shortUrlRedirecter)
router.get('/analytics/overall',authMiddleware, getOverallAnalytics)
router.get('/analytics/:alias',authMiddleware,getUrlAnalytics)
router.get('/analytics/topic/:topic',authMiddleware,topicBasedAnalytics)

module.exports = router;
