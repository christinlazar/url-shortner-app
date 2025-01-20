const Analytics = require('../models/analyticsSchema'); 
const ShortUrl = require('../models/shortUrlSchema'); 


const formatOsAndDeviceData = (data, field) => {
    const formatted = data.reduce((acc, item) => {
        const existing = acc.find(i => i[field] === item[field]);
        if (existing) {
            existing.uniqueClicks += 1;
            existing.uniqueUsers += 1;
        } else {
            acc.push({ [field]: item[field], uniqueClicks: 1, uniqueUsers: 1 });
        }
        return acc;
    }, []);
    return formatted;
};

const getOverallAnalytics = async (req, res) => {
    try {
        const userId = req.user.id; 
        const userShortUrls = await ShortUrl.find({ user: userId });
        if (!userShortUrls || userShortUrls.length === 0) {
            return res.status(404).json({ message: 'No short URLs found for this user.' });
        }
        const analyticsData = await Analytics.aggregate([
            {
                $match: {
                    shortUrl: { $in: userShortUrls.map((url) => url._id) },
                },
            },
            {
                $group: {
                    _id: '$shortUrl',
                    totalClicks: { $sum: 1 },
                    uniqueUsers: { $addToSet: '$ipAddress' }, 
                    clicksByDate: {
                        $push: {
                            date: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
                            ip: '$ipAddress',
                        },
                    },
                    osType: {
                        $push: { osName: '$osType', ip: '$ipAddress' },
                    },
                    deviceType: {
                        $push: { deviceName: '$deviceType', ip: '$ipAddress' },
                    },
                },
            },
            {
                $project: {
                    shortUrl: '$_id',
                    totalClicks: 1,
                    uniqueUsers: { $size: '$uniqueUsers' }, 
                    clicksByDate: 1,
                    osType: 1,
                    deviceType: 1,
                },
            },
        ]);
        const response = {
            totalUrls: userShortUrls.length,
            totalClicks: analyticsData.reduce((sum, data) => sum + data.totalClicks, 0),
            uniqueUsers:analyticsData[0].uniqueUsers,
            clicksByDate: analyticsData.reduce((dates, data) => {
                data.clicksByDate.forEach((dateData) => {
                    const existing = dates.find((d) => d.date === dateData.date);
                    if (existing) {
                        existing.count += 1; 
                    } else {
                        dates.push({ date: dateData.date, count: 1 });
                    }
                });
                return dates;
            }, []),
            osType: formatOsAndDeviceData(analyticsData.flatMap(data => data.osType), 'osName'),
            deviceType: formatOsAndDeviceData(analyticsData.flatMap(data => data.deviceType), 'deviceName'),
        };

        res.json(response);
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving overall analytics.' });
    }
};


module.exports = { getOverallAnalytics };

