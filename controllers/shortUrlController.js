const ShortUrl = require('../models/shortUrlSchema')
const shortid = require('shortid'); 
const Analytics = require('../models/analyticsSchema')

const redis = require('redis');

const client = redis.createClient({
  url: 'redis://redis:6379'  
});

client.on('connect', () => {
    console.log('Connected to Redis');
});

client.on('error', (err) => {
    console.error('Redis Client Error:', err);
});

(async () => {
    await client.connect();
})();



const createShortUrl = async (req, res) => {
  const { longUrl, customAlias, topic } = req.body;
 
  const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
  if (!urlRegex.test(longUrl)) {
    return res.status(400).json({ message: 'Invalid URL format' });
  }
  try {
    let alias = customAlias || shortid.generate(); 

    let existingAlias = await ShortUrl.findOne({ shortUrl: alias });
    if (existingAlias) {
      return res.status(400).json({ message: 'Custom alias already exists' });
    }
    const newShortUrl = new ShortUrl({
      longUrl,
      shortUrl: alias,
      customAlias,
      topic,
      user:req.user.id
    });
    await newShortUrl.save();
    res.status(201).json({
      shortUrl: `${req.protocol}://${req.get('host')}/api/shorten/${alias}`,
      createdAt: newShortUrl.createdAt
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const shortUrlRedirecter = async (req, res) => {
  try {
      const { alias } = req.params;
      const cachedUrl = await client.get(alias);
      if (cachedUrl) {
          const shortUrl = JSON.parse(cachedUrl);

          const analyticsData = new Analytics({
              shortUrl: shortUrl._id,
              userAgent: req.headers['user-agent'],
              ipAddress: req.ip,
              osType: req.headers['user-agent'],
              deviceType: req.headers['user-agent'],
              location: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
          });

          await analyticsData.save();
          res.redirect(shortUrl.longUrl);
          return;
      }
      const shortUrl = await ShortUrl.findOne({ customAlias: alias });

      if (!shortUrl) {
          return res.status(404).json({ message: 'Short URL not found' });
      }

      const analyticsData = new Analytics({
          shortUrl: shortUrl._id,
          userAgent: req.headers['user-agent'],
          ipAddress: req.ip,
          osType: req.headers['user-agent'],
          deviceType: req.headers['user-agent'],
          location: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
      });

      await analyticsData.save();

      shortUrl.clicks += 1;
      shortUrl.uniqueUsers += 1;
      shortUrl.clicksByDate.push({ date: new Date(), count: 1 });

      await shortUrl.save();

      await client.set(alias, JSON.stringify(shortUrl), {
          EX: 3600, 
      });

      res.redirect(shortUrl.longUrl);
  } catch (error) {
      res.status(500).json({ message: 'Internal Server Error' });
  }
};







module.exports = { createShortUrl,shortUrlRedirecter };