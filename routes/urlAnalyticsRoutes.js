const express = require('express');
const router = express.Router();
const { getUrlAnalytics } = require('../controllers/urlAnalyticsController');
const { topicBasedAnalytics } = require('../controllers/topicBasedAnalytics');

router.get('/analytics/:alias', getUrlAnalytics);


module.exports = router;
