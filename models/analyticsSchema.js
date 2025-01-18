const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
    shortUrl: { type: mongoose.Schema.Types.ObjectId, ref: 'ShortUrl' },
    timestamp: { type: Date, default: Date.now },
    userAgent: String,
    ipAddress: String,
    osType: String,
    deviceType: String, 
    location: String, 
});

const Analytics = mongoose.model('Analytics', analyticsSchema);
module.exports = Analytics;
