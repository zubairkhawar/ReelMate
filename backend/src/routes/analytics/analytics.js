const express = require('express');
const router = express.Router();

// Mock analytics data (replace with Supabase in production)
let analyticsData = [];

// Generate mock analytics data
function generateMockAnalytics() {
  const platforms = ['tiktok', 'instagram', 'facebook'];
  const campaigns = ['Summer Sale', 'Product Launch', 'Holiday Special'];
  
  for (let i = 0; i < 30; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    platforms.forEach(platform => {
      campaigns.forEach(campaign => {
        const views = Math.floor(Math.random() * 10000) + 1000;
        const clicks = Math.floor(Math.random() * 500) + 50;
        const conversions = Math.floor(Math.random() * 50) + 5;
        const revenue = conversions * (Math.random() * 50 + 20);
        
        analyticsData.push({
          id: `analytics_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          date: date.toISOString().split('T')[0],
          platform,
          campaign,
          views,
          clicks,
          conversions,
          revenue: Math.round(revenue * 100) / 100,
          ctr: Math.round((clicks / views) * 10000) / 100,
          conversionRate: Math.round((conversions / clicks) * 10000) / 100,
          cpm: Math.round((revenue / views) * 1000 * 100) / 100,
          cpc: Math.round((revenue / clicks) * 100) / 100
        });
      });
    });
  }
}

// Initialize mock data
generateMockAnalytics();

// @route   GET /api/analytics/overview
// @desc    Get analytics overview for dashboard
// @access  Private
router.get('/overview', async (req, res) => {
  try {
    const { startDate, endDate, platform, campaign } = req.query;
    
    let filteredData = [...analyticsData];
    
    // Filter by date range if provided
    if (startDate && endDate) {
      filteredData = filteredData.filter(item => 
        item.date >= startDate && item.date <= endDate
      );
    }
    
    // Filter by platform if provided
    if (platform) {
      filteredData = filteredData.filter(item => item.platform === platform);
    }
    
    // Filter by campaign if provided
    if (campaign) {
      filteredData = filteredData.filter(item => item.campaign === campaign);
    }
    
    // Calculate totals
    const totals = filteredData.reduce((acc, item) => {
      acc.views += item.views;
      acc.clicks += item.clicks;
      acc.conversions += item.conversions;
      acc.revenue += item.revenue;
      return acc;
    }, { views: 0, clicks: 0, conversions: 0, revenue: 0 });
    
    // Calculate averages
    const avgCtr = totals.views > 0 ? (totals.clicks / totals.views) * 100 : 0;
    const avgConversionRate = totals.clicks > 0 ? (totals.conversions / totals.clicks) * 100 : 0;
    const avgCpm = totals.views > 0 ? (totals.revenue / totals.views) * 1000 : 0;
    const avgCpc = totals.clicks > 0 ? totals.revenue / totals.clicks : 0;
    
    // Get top performing campaigns
    const campaignPerformance = filteredData.reduce((acc, item) => {
      if (!acc[item.campaign]) {
        acc[item.campaign] = {
          campaign: item.campaign,
          views: 0,
          clicks: 0,
          conversions: 0,
          revenue: 0
        };
      }
      
      acc[item.campaign].views += item.views;
      acc[item.campaign].clicks += item.clicks;
      acc[item.campaign].conversions += item.conversions;
      acc[item.campaign].revenue += item.revenue;
      
      return acc;
    }, {});
    
    const topCampaigns = Object.values(campaignPerformance)
      .map(campaign => ({
        ...campaign,
        ctr: Math.round((campaign.clicks / campaign.views) * 10000) / 100,
        conversionRate: Math.round((campaign.conversions / campaign.clicks) * 10000) / 100
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
    
    // Get platform performance
    const platformPerformance = filteredData.reduce((acc, item) => {
      if (!acc[item.platform]) {
        acc[item.platform] = {
          platform: item.platform,
          views: 0,
          clicks: 0,
          conversions: 0,
          revenue: 0
        };
      }
      
      acc[item.platform].views += item.views;
      acc[item.platform].clicks += item.clicks;
      acc[item.platform].conversions += item.conversions;
      acc[item.platform].revenue += item.revenue;
      
      return acc;
    }, {});
    
    const platforms = Object.values(platformPerformance)
      .map(platform => ({
        ...platform,
        ctr: Math.round((platform.clicks / platform.views) * 10000) / 100,
        conversionRate: Math.round((platform.conversions / platform.clicks) * 10000) / 100
      }))
      .sort((a, b) => b.revenue - a.revenue);
    
    res.json({
      overview: {
        totalViews: totals.views,
        totalClicks: totals.clicks,
        totalConversions: totals.conversions,
        totalRevenue: Math.round(totals.revenue * 100) / 100,
        avgCtr: Math.round(avgCtr * 100) / 100,
        avgConversionRate: Math.round(avgConversionRate * 100) / 100,
        avgCpm: Math.round(avgCpm * 100) / 100,
        avgCpc: Math.round(avgCpc * 100) / 100
      },
      topCampaigns,
      platformPerformance: platforms,
      dateRange: {
        startDate: startDate || 'all',
        endDate: endDate || 'all'
      }
    });
    
  } catch (error) {
    console.error('Get analytics overview error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch analytics overview'
    });
  }
});

// @route   GET /api/analytics/trends
// @desc    Get analytics trends over time
// @access  Private
router.get('/trends', async (req, res) => {
  try {
    const { startDate, endDate, platform, campaign, metric } = req.query;
    
    let filteredData = [...analyticsData];
    
    // Filter by date range if provided
    if (startDate && endDate) {
      filteredData = filteredData.filter(item => 
        item.date >= startDate && item.date <= endDate
      );
    }
    
    // Filter by platform if provided
    if (platform) {
      filteredData = filteredData.filter(item => item.platform === platform);
    }
    
    // Filter by campaign if provided
    if (campaign) {
      filteredData = filteredData.filter(item => item.campaign === campaign);
    }
    
    // Group by date and calculate daily totals
    const dailyTrends = filteredData.reduce((acc, item) => {
      if (!acc[item.date]) {
        acc[item.date] = {
          date: item.date,
          views: 0,
          clicks: 0,
          conversions: 0,
          revenue: 0
        };
      }
      
      acc[item.date].views += item.views;
      acc[item.date].clicks += item.clicks;
      acc[item.date].conversions += item.conversions;
      acc[item.date].revenue += item.revenue;
      
      return acc;
    }, {});
    
    // Convert to array and sort by date
    const trends = Object.values(dailyTrends)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .map(day => ({
        ...day,
        ctr: Math.round((day.clicks / day.views) * 10000) / 100,
        conversionRate: Math.round((day.conversions / day.clicks) * 10000) / 100,
        revenue: Math.round(day.revenue * 100) / 100
      }));
    
    res.json({
      trends,
      metric: metric || 'all',
      dateRange: {
        startDate: startDate || 'all',
        endDate: endDate || 'all'
      }
    });
    
  } catch (error) {
    console.error('Get analytics trends error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch analytics trends'
    });
  }
});

// @route   GET /api/analytics/campaigns
// @desc    Get detailed campaign analytics
// @access  Private
router.get('/campaigns', async (req, res) => {
  try {
    const { startDate, endDate, platform, limit = 50, offset = 0 } = req.query;
    
    let filteredData = [...analyticsData];
    
    // Filter by date range if provided
    if (startDate && endDate) {
      filteredData = filteredData.filter(item => 
        item.date >= startDate && item.date <= endDate
      );
    }
    
    // Filter by platform if provided
    if (platform) {
      filteredData = filteredData.filter(item => item.platform === platform);
    }
    
    // Group by campaign
    const campaignAnalytics = filteredData.reduce((acc, item) => {
      if (!acc[item.campaign]) {
        acc[item.campaign] = {
          campaign: item.campaign,
          views: 0,
          clicks: 0,
          conversions: 0,
          revenue: 0,
          platforms: new Set(),
          dates: new Set()
        };
      }
      
      acc[item.campaign].views += item.views;
      acc[item.campaign].clicks += item.clicks;
      acc[item.campaign].conversions += item.conversions;
      acc[item.campaign].revenue += item.revenue;
      acc[item.campaign].platforms.add(item.platform);
      acc[item.campaign].dates.add(item.date);
      
      return acc;
    }, {});
    
    // Convert to array and calculate metrics
    const campaigns = Object.values(campaignAnalytics)
      .map(campaign => ({
        campaign: campaign.campaign,
        views: campaign.views,
        clicks: campaign.clicks,
        conversions: campaign.conversions,
        revenue: Math.round(campaign.revenue * 100) / 100,
        ctr: Math.round((campaign.clicks / campaign.views) * 10000) / 100,
        conversionRate: Math.round((campaign.conversions / campaign.clicks) * 10000) / 100,
        cpm: Math.round((campaign.revenue / campaign.views) * 1000 * 100) / 100,
        cpc: Math.round((campaign.revenue / campaign.clicks) * 100) / 100,
        platforms: Array.from(campaign.platforms),
        dateRange: {
          start: Array.from(campaign.dates).sort()[0],
          end: Array.from(campaign.dates).sort().reverse()[0]
        }
      }))
      .sort((a, b) => b.revenue - a.revenue);
    
    // Apply pagination
    const paginatedCampaigns = campaigns.slice(offset, offset + parseInt(limit));
    
    res.json({
      campaigns: paginatedCampaigns,
      pagination: {
        total: campaigns.length,
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: offset + parseInt(limit) < campaigns.length
      }
    });
    
  } catch (error) {
    console.error('Get campaign analytics error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch campaign analytics'
    });
  }
});

// @route   GET /api/analytics/platforms
// @desc    Get detailed platform analytics
// @access  Private
router.get('/platforms', async (req, res) => {
  try {
    const { startDate, endDate, campaign, limit = 50, offset = 0 } = req.query;
    
    let filteredData = [...analyticsData];
    
    // Filter by date range if provided
    if (startDate && endDate) {
      filteredData = filteredData.filter(item => 
        item.date >= startDate && item.date <= endDate
      );
    }
    
    // Filter by campaign if provided
    if (campaign) {
      filteredData = filteredData.filter(item => item.campaign === campaign);
    }
    
    // Group by platform
    const platformAnalytics = filteredData.reduce((acc, item) => {
      if (!acc[item.platform]) {
        acc[item.platform] = {
          platform: item.platform,
          views: 0,
          clicks: 0,
          conversions: 0,
          revenue: 0,
          campaigns: new Set(),
          dates: new Set()
        };
      }
      
      acc[item.platform].views += item.views;
      acc[item.platform].clicks += item.clicks;
      acc[item.platform].conversions += item.conversions;
      acc[item.platform].revenue += item.revenue;
      acc[item.platform].campaigns.add(item.campaign);
      acc[item.platform].dates.add(item.date);
      
      return acc;
    }, {});
    
    // Convert to array and calculate metrics
    const platforms = Object.values(platformAnalytics)
      .map(platform => ({
        platform: platform.platform,
        views: platform.views,
        clicks: platform.clicks,
        conversions: platform.conversions,
        revenue: Math.round(platform.revenue * 100) / 100,
        ctr: Math.round((platform.clicks / platform.views) * 10000) / 100,
        conversionRate: Math.round((platform.conversions / platform.clicks) * 10000) / 100,
        cpm: Math.round((platform.revenue / platform.views) * 1000 * 100) / 100,
        cpc: Math.round((platform.revenue / platform.clicks) * 100) / 100,
        campaigns: Array.from(platform.campaigns),
        dateRange: {
          start: Array.from(platform.dates).sort()[0],
          end: Array.from(platform.dates).sort().reverse()[0]
        }
      }))
      .sort((a, b) => b.revenue - a.revenue);
    
    // Apply pagination
    const paginatedPlatforms = platforms.slice(offset, offset + parseInt(limit));
    
    res.json({
      platforms: paginatedPlatforms,
      pagination: {
        total: platforms.length,
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: offset + parseInt(limit) < platforms.length
      }
    });
    
  } catch (error) {
    console.error('Get platform analytics error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch platform analytics'
    });
  }
});

// @route   GET /api/analytics/export
// @desc    Export analytics data
// @access  Private
router.get('/export', async (req, res) => {
  try {
    const { startDate, endDate, platform, campaign, format = 'json' } = req.query;
    
    let filteredData = [...analyticsData];
    
    // Apply filters
    if (startDate && endDate) {
      filteredData = filteredData.filter(item => 
        item.date >= startDate && item.date <= endDate
      );
    }
    
    if (platform) {
      filteredData = filteredData.filter(item => item.platform === platform);
    }
    
    if (campaign) {
      filteredData = filteredData.filter(item => item.campaign === campaign);
    }
    
    if (format === 'csv') {
      // Convert to CSV format
      const csvHeaders = 'Date,Platform,Campaign,Views,Clicks,Conversions,Revenue,CTR,Conversion Rate,CPM,CPC\n';
      const csvRows = filteredData.map(item => 
        `${item.date},${item.platform},${item.campaign},${item.views},${item.clicks},${item.conversions},${item.revenue},${item.ctr}%,${item.conversionRate}%,$${item.cpm},$${item.cpc}`
      ).join('\n');
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=analytics-export.csv');
      res.send(csvHeaders + csvRows);
    } else {
      // Return JSON format
      res.json({
        data: filteredData,
        exportInfo: {
          format: 'json',
          totalRecords: filteredData.length,
          dateRange: {
            startDate: startDate || 'all',
            endDate: endDate || 'all'
          },
          filters: {
            platform: platform || 'all',
            campaign: campaign || 'all'
          }
        }
      });
    }
    
  } catch (error) {
    console.error('Export analytics error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to export analytics data'
    });
  }
});

module.exports = router;
