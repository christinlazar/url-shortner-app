const ShortUrl = require('../models/shortUrlSchema');
const Analytics = require('../models/analyticsSchema');

const topicBasedAnalytics = async (req,res)=>{
    try {
        console.log("in topic based analytics",req.params)
                const { topic } = req.params;
                const shortUrls = await ShortUrl.find({ topic:topic })
                console.log(shortUrls)
                if (shortUrls.length === 0) {
                    return res.status(404).json({ message: 'No URLs found for the specified topic' });
                }

                const analyticsData = await Analytics.aggregate([
                    {
                        $match: {
                            shortUrl: { $in: shortUrls.map((url) => url._id) },
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
                        },
                    },
                    {
                        $project: {
                            shortUrl: '$_id',
                            totalClicks: 1,
                            uniqueUsers: { $size: '$uniqueUsers' },
                            clicksByDate: {
                                $map: {
                                    input: '$clicksByDate',
                                    as: 'click',
                                    in: {
                                        date: '$$click.date',
                                        count: {
                                            $size: {
                                                $filter: {
                                                    input: '$clicksByDate',
                                                    as: 'd',
                                                    cond: { $eq: ['$$d.date', '$$click.date'] },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                ]);
                
                const response = {
                    totalClicks: analyticsData.reduce((sum, data) => sum + data.totalClicks, 0),
                    uniqueUsers: analyticsData.reduce((users, data) => {
                        users.add(data.uniqueUsers);
                        return users;
                    }, new Set()).size,
                    clicksByDate: analyticsData.reduce((dates, data) => {
                        data.clicksByDate.forEach((dateData) => {
                            const existing = dates.find((d) => d.date === dateData.date);
                            if (existing) {
                                existing.count += dateData.count;
                            } else {
                                dates.push(dateData);
                            }
                        });
                        return dates;
                    }, []),
                    urls: analyticsData.map((data) => ({
                        shortUrl: shortUrls.find((url) => String(url._id) === String(data.shortUrl)).shortUrl,
                        totalClicks: data.totalClicks,
                        uniqueUsers: data.uniqueUsers, 
                    })),
                };
        
                res.json(response);
        
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

module.exports = {topicBasedAnalytics}