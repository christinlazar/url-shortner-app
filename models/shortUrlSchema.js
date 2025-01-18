const mongoose = require('mongoose')

const shortUrlSchema = new mongoose.Schema({
    longUrl: {
         type: String, 
         required: true
    },
    shortUrl: {
         type: String, 
         required: true,
          unique: true 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
    customAlias: { 
        type: String, 
        unique: true 
    },
    topic: { 
        type: String, 
        enum: ['acquisition', 'activation', 'retention'], 
        default: 'acquisition' 
    },
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    },
    clicks: {
        type: Number,
        default: 0, 
    },
    uniqueUsers: {
        type: Number,
        default: 0,  
    },
    clicksByDate: [{
        date: { type: Date },
        count: { type: Number, default: 0 }, 
    }],
    osType: [{
        osName: { type: String },
        uniqueClicks: { type: Number, default: 0 },  
        uniqueUsers: { type: Number, default: 0 },  
    }],
    deviceType: [{
        deviceName: { type: String },
        uniqueClicks: { type: Number, default: 0 },  
        uniqueUsers: { type: Number, default: 0 }, 
    }],  
}

);
  
  module.exports = mongoose.model('ShortUrl', shortUrlSchema);