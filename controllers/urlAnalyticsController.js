
const ShortUrl = require('../models/shortUrlSchema');
const Analytics = require('../models/analyticsSchema');
const moment = require('moment');

const getUrlAnalytics = async (req,res)=>{
    try {
        const { alias } = req.params;

        const shortUrl = await ShortUrl.findOne({ customAlias: alias });
        if (!shortUrl) {
            return res.status(404).json({ message: 'Short URL not found' });
        }

        const analyticsData = await Analytics.aggregate([
            { $match: { shortUrl: shortUrl._id } },
            { $group: {
                _id: null,
                totalClicks: { $sum: 1 },
                uniqueUsers: { $addToSet: "$ipAddress" },
                clicksByDate: { $push: { date: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } }, count: 1 } },
                osType: { $push: "$osType" },
                deviceType: { $push: "$deviceType" },
            }},
            { $project: {
                totalClicks: 1,
                uniqueUsers: { $size: { $setUnion: ["$uniqueUsers", "$uniqueUsers"] } },
                clicksByDate: 1,
                osType: 1,
                deviceType: 1,
            }}
        ]);
        
        

        if (analyticsData.length === 0) {
            return res.status(404).json({ message: 'No analytics data found for this short URL' });
        }

        const data = analyticsData[0];

        const clicksByDate = formatClicksByDate(data.clicksByDate);

        const osType = formatOsAndDeviceData(data.osType, 'osName');
        const deviceType = formatOsAndDeviceData(data.deviceType, 'deviceName');

        console.log(
            {
            "totalClicks": data.totalClicks,
            "uniqueUsers": data.uniqueUsers,
            'clicksByDate': clicksByDate,
            "osType": osType,
            "deviceType": deviceType,
            }
        )

        res.status(200).json({
            totalClicks: data.totalClicks,
            uniqueUsers: data.uniqueUsers,
            clicksByDate: clicksByDate,
            osType: osType,
            deviceType: deviceType,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

const formatClicksByDate = (clicksByDate) => {
    const last7Days = moment().subtract(7, 'days').startOf('day');
    const formatted = clicksByDate.filter(click => moment(click.date).isAfter(last7Days))
        .reduce((acc, click) => {
         const existing = acc.find(c => c.date === click.date);
         if (existing) {
         existing.count += 1;
         } else {
         acc.push({ date: click.date, count: 1 });
         }
         return acc;
         }, []);
    return formatted;
};


const formatOsAndDeviceData = (data, field) => {
    const formatted = data.reduce((acc, item) => {
        const existing = acc.find(i => i[field] === item);
        if (existing) {
            existing.uniqueClicks += 1;
            existing.uniqueUsers += 1;
        } else {
            acc.push({ [field]: item, uniqueClicks: 1, uniqueUsers: 1 });
        }
        return acc;
    }, []);
    return formatted;
};

module.exports = { getUrlAnalytics }