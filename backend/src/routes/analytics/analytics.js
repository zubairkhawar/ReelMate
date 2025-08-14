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

// @route   GET /api/analytics/campaign-breakdown
// @desc    Get detailed campaign breakdown analysis
// @access  Private
router.get('/campaign-breakdown', async (req, res) => {
  try {
    const { startDate, endDate, platform } = req.query;
    
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
    
    // Group by campaign and calculate detailed metrics
    const campaignBreakdown = filteredData.reduce((acc, item) => {
      if (!acc[item.campaign]) {
        acc[item.campaign] = {
          campaign: item.campaign,
          platform: item.platform,
          views: 0,
          clicks: 0,
          conversions: 0,
          revenue: 0,
          dailyData: {},
          platformBreakdown: {}
        };
      }
      
      acc[item.campaign].views += item.views;
      acc[item.campaign].clicks += item.clicks;
      acc[item.campaign].conversions += item.conversions;
      acc[item.campaign].revenue += item.revenue;
      
      // Daily breakdown
      if (!acc[item.campaign].dailyData[item.date]) {
        acc[item.campaign].dailyData[item.date] = {
          views: 0,
          clicks: 0,
          conversions: 0,
          revenue: 0
        };
      }
      acc[item.campaign].dailyData[item.date].views += item.views;
      acc[item.campaign].dailyData[item.date].clicks += item.clicks;
      acc[item.campaign].dailyData[item.date].conversions += item.conversions;
      acc[item.campaign].dailyData[item.date].revenue += item.revenue;
      
      // Platform breakdown
      if (!acc[item.campaign].platformBreakdown[item.platform]) {
        acc[item.campaign].platformBreakdown[item.platform] = {
          views: 0,
          clicks: 0,
          conversions: 0,
          revenue: 0
        };
      }
      acc[item.campaign].platformBreakdown[item.platform].views += item.views;
      acc[item.campaign].platformBreakdown[item.platform].clicks += item.clicks;
      acc[item.campaign].platformBreakdown[item.platform].conversions += item.conversions;
      acc[item.campaign].platformBreakdown[item.platform].revenue += item.revenue;
      
      return acc;
    }, {});
    
    // Convert to array and calculate final metrics
    const breakdown = Object.values(campaignBreakdown).map(campaign => {
      const ctr = campaign.views > 0 ? (campaign.clicks / campaign.views) * 100 : 0;
      const conversionRate = campaign.clicks > 0 ? (campaign.conversions / campaign.clicks) * 100 : 0;
      const cpm = campaign.views > 0 ? (campaign.revenue / campaign.views) * 1000 : 0;
      const cpc = campaign.clicks > 0 ? campaign.revenue / campaign.clicks : 0;
      
      // Convert daily data to array
      const dailyData = Object.entries(campaign.dailyData).map(([date, data]) => ({
        date,
        ...data,
        ctr: data.views > 0 ? (data.clicks / data.views) * 100 : 0,
        conversionRate: data.clicks > 0 ? (data.conversions / data.clicks) * 100 : 0
      })).sort((a, b) => new Date(a.date) - new Date(b.date));
      
      // Convert platform breakdown to array
      const platformBreakdown = Object.entries(campaign.platformBreakdown).map(([platform, data]) => ({
        platform,
        ...data,
        ctr: data.views > 0 ? (data.clicks / data.views) * 100 : 0,
        conversionRate: data.clicks > 0 ? (data.conversions / data.clicks) * 100 : 0
      }));
      
      return {
        ...campaign,
        ctr: Math.round(ctr * 100) / 100,
        conversionRate: Math.round(conversionRate * 100) / 100,
        cpm: Math.round(cpm * 100) / 100,
        cpc: Math.round(cpc * 100) / 100,
        revenue: Math.round(campaign.revenue * 100) / 100,
        dailyData,
        platformBreakdown
      };
    }).sort((a, b) => b.revenue - a.revenue);
    
    res.json({
      campaignBreakdown: breakdown,
      summary: {
        totalCampaigns: breakdown.length,
        totalViews: breakdown.reduce((sum, c) => sum + c.views, 0),
        totalRevenue: breakdown.reduce((sum, c) => sum + c.revenue, 0),
        avgCtr: breakdown.reduce((sum, c) => sum + c.ctr, 0) / breakdown.length,
        avgConversionRate: breakdown.reduce((sum, c) => sum + c.conversionRate, 0) / breakdown.length
      }
    });
    
  } catch (error) {
    console.error('Get campaign breakdown error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch campaign breakdown'
    });
  }
});

// @route   GET /api/analytics/traffic-sources
// @desc    Get detailed traffic sources analysis
// @access  Private
router.get('/traffic-sources', async (req, res) => {
  try {
    const { startDate, endDate, campaign } = req.query;
    
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
    
    // Group by platform and calculate detailed metrics
    const trafficSources = filteredData.reduce((acc, item) => {
      if (!acc[item.platform]) {
        acc[item.platform] = {
          platform: item.platform,
          views: 0,
          clicks: 0,
          conversions: 0,
          revenue: 0,
          campaigns: new Set(),
          dailyData: {},
          audienceData: {
            ageGroups: { '18-24': 0, '25-34': 0, '35-44': 0, '45-54': 0, '55+': 0 },
            genders: { male: 0, female: 0, other: 0 },
            locations: {}
          }
        };
      }
      
      acc[item.platform].views += item.views;
      acc[item.platform].clicks += item.clicks;
      acc[item.platform].conversions += item.conversions;
      acc[item.platform].revenue += item.revenue;
      acc[item.platform].campaigns.add(item.campaign);
      
      // Daily breakdown
      if (!acc[item.platform].dailyData[item.date]) {
        acc[item.platform].dailyData[item.date] = {
          views: 0,
          clicks: 0,
          conversions: 0,
          revenue: 0
        };
      }
      acc[item.platform].dailyData[item.date].views += item.views;
      acc[item.platform].dailyData[item.date].clicks += item.clicks;
      acc[item.platform].dailyData[item.date].conversions += item.conversions;
      acc[item.platform].dailyData[item.date].revenue += item.revenue;
      
      // Mock audience data (in real app, this would come from analytics platform)
      const mockAudience = {
        ageGroups: { '18-24': 0.3, '25-34': 0.4, '35-44': 0.2, '45-54': 0.08, '55+': 0.02 },
        genders: { male: 0.45, female: 0.52, other: 0.03 },
        locations: { 'US': 0.6, 'UK': 0.15, 'CA': 0.1, 'AU': 0.08, 'Other': 0.07 }
      };
      
      Object.keys(mockAudience.ageGroups).forEach(age => {
        acc[item.platform].audienceData.ageGroups[age] += Math.round(item.views * mockAudience.ageGroups[age]);
      });
      
      Object.keys(mockAudience.genders).forEach(gender => {
        acc[item.platform].audienceData.genders[gender] += Math.round(item.views * mockAudience.genders[gender]);
      });
      
      Object.keys(mockAudience.locations).forEach(location => {
        if (!acc[item.platform].audienceData.locations[location]) {
          acc[item.platform].audienceData.locations[location] = 0;
        }
        acc[item.platform].audienceData.locations[location] += Math.round(item.views * mockAudience.locations[location]);
      });
      
      return acc;
    }, {});
    
    // Convert to array and calculate final metrics
    const sources = Object.values(trafficSources).map(source => {
      const ctr = source.views > 0 ? (source.clicks / source.views) * 100 : 0;
      const conversionRate = source.clicks > 0 ? (source.conversions / source.clicks) * 100 : 0;
      const cpm = source.views > 0 ? (source.revenue / source.views) * 1000 : 0;
      const cpc = source.clicks > 0 ? source.revenue / source.clicks : 0;
      
      // Convert daily data to array
      const dailyData = Object.entries(source.dailyData).map(([date, data]) => ({
        date,
        ...data,
        ctr: data.views > 0 ? (data.clicks / data.views) * 100 : 0,
        conversionRate: data.clicks > 0 ? (data.conversions / data.clicks) * 100 : 0
      })).sort((a, b) => new Date(a.date) - new Date(b.date));
      
      // Convert audience data to arrays
      const ageGroups = Object.entries(source.audienceData.ageGroups).map(([age, views]) => ({
        age,
        views,
        percentage: Math.round((views / source.views) * 10000) / 100
      }));
      
      const genders = Object.entries(source.audienceData.genders).map(([gender, views]) => ({
        gender,
        views,
        percentage: Math.round((views / source.views) * 10000) / 100
      }));
      
      const locations = Object.entries(source.audienceData.locations).map(([location, views]) => ({
        location,
        views,
        percentage: Math.round((views / source.views) * 10000) / 100
      }));
      
      return {
        ...source,
        ctr: Math.round(ctr * 100) / 100,
        conversionRate: Math.round(conversionRate * 100) / 100,
        cpm: Math.round(cpm * 100) / 100,
        cpc: Math.round(cpc * 100) / 100,
        revenue: Math.round(source.revenue * 100) / 100,
        campaigns: Array.from(source.campaigns),
        dailyData,
        audienceData: {
          ageGroups,
          genders,
          locations
        }
      };
    }).sort((a, b) => b.revenue - a.revenue);
    
    res.json({
      trafficSources: sources,
      summary: {
        totalSources: sources.length,
        totalViews: sources.reduce((sum, s) => sum + s.views, 0),
        totalRevenue: sources.reduce((sum, s) => sum + s.revenue, 0),
        avgCtr: sources.reduce((sum, s) => sum + s.ctr, 0) / sources.length,
        avgConversionRate: sources.reduce((sum, s) => sum + s.conversionRate, 0) / sources.length
      }
    });
    
  } catch (error) {
    console.error('Get traffic sources error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch traffic sources'
    });
  }
});

// @route   GET /api/analytics/engagement-details
// @desc    Get detailed engagement analysis
// @access  Private
router.get('/engagement-details', async (req, res) => {
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
    
    // Calculate engagement metrics
    const engagementMetrics = filteredData.reduce((acc, item) => {
      // Mock engagement data (in real app, this would come from analytics platform)
      const mockEngagement = {
        likes: Math.round(item.views * 0.08),
        comments: Math.round(item.views * 0.02),
        shares: Math.round(item.views * 0.015),
        saves: Math.round(item.views * 0.01),
        watchTime: Math.round(item.views * 0.6 * (Math.random() * 30 + 10)), // 10-40 seconds
        completionRate: Math.round((Math.random() * 30 + 60) * 100) / 100, // 60-90%
        bounceRate: Math.round((Math.random() * 20 + 10) * 100) / 100 // 10-30%
      };
      
      acc.totalViews += item.views;
      acc.totalLikes += mockEngagement.likes;
      acc.totalComments += mockEngagement.comments;
      acc.totalShares += mockEngagement.shares;
      acc.totalSaves += mockEngagement.saves;
      acc.totalWatchTime += mockEngagement.watchTime;
      acc.completionRates.push(mockEngagement.completionRate);
      acc.bounceRates.push(mockEngagement.bounceRate);
      
      // Platform breakdown
      if (!acc.platformBreakdown[item.platform]) {
        acc.platformBreakdown[item.platform] = {
          views: 0,
          likes: 0,
          comments: 0,
          shares: 0,
          saves: 0,
          watchTime: 0
        };
      }
      
      acc.platformBreakdown[item.platform].views += item.views;
      acc.platformBreakdown[item.platform].likes += mockEngagement.likes;
      acc.platformBreakdown[item.platform].comments += mockEngagement.comments;
      acc.platformBreakdown[item.platform].shares += mockEngagement.shares;
      acc.platformBreakdown[item.platform].saves += mockEngagement.saves;
      acc.platformBreakdown[item.platform].watchTime += mockEngagement.watchTime;
      
      // Campaign breakdown
      if (!acc.campaignBreakdown[item.campaign]) {
        acc.campaignBreakdown[item.campaign] = {
          views: 0,
          likes: 0,
          comments: 0,
          shares: 0,
          saves: 0,
          watchTime: 0
        };
      }
      
      acc.campaignBreakdown[item.campaign].views += item.views;
      acc.campaignBreakdown[item.campaign].likes += mockEngagement.likes;
      acc.campaignBreakdown[item.campaign].comments += mockEngagement.comments;
      acc.campaignBreakdown[item.campaign].shares += mockEngagement.shares;
      acc.campaignBreakdown[item.campaign].saves += mockEngagement.saves;
      acc.campaignBreakdown[item.campaign].watchTime += mockEngagement.watchTime;
      
      return acc;
    }, {
      totalViews: 0,
      totalLikes: 0,
      totalComments: 0,
      totalShares: 0,
      totalSaves: 0,
      totalWatchTime: 0,
      completionRates: [],
      bounceRates: [],
      platformBreakdown: {},
      campaignBreakdown: {}
    });
    
    // Calculate averages
    const avgCompletionRate = engagementMetrics.completionRates.length > 0 
      ? engagementMetrics.completionRates.reduce((sum, rate) => sum + rate, 0) / engagementMetrics.completionRates.length 
      : 0;
    
    const avgBounceRate = engagementMetrics.bounceRates.length > 0 
      ? engagementMetrics.bounceRates.reduce((sum, rate) => sum + rate, 0) / engagementMetrics.bounceRates.length 
      : 0;
    
    // Convert breakdowns to arrays
    const platformBreakdown = Object.entries(engagementMetrics.platformBreakdown).map(([platform, data]) => ({
      platform,
      ...data,
      likeRate: data.views > 0 ? Math.round((data.likes / data.views) * 10000) / 100 : 0,
      commentRate: data.views > 0 ? Math.round((data.comments / data.views) * 10000) / 100 : 0,
      shareRate: data.views > 0 ? Math.round((data.shares / data.views) * 10000) / 100 : 0,
      saveRate: data.views > 0 ? Math.round((data.saves / data.views) * 10000) / 100 : 0,
      avgWatchTime: data.views > 0 ? Math.round(data.watchTime / data.views) : 0
    }));
    
    const campaignBreakdown = Object.entries(engagementMetrics.campaignBreakdown).map(([campaign, data]) => ({
      campaign,
      ...data,
      likeRate: data.views > 0 ? Math.round((data.likes / data.views) * 10000) / 100 : 0,
      commentRate: data.views > 0 ? Math.round((data.comments / data.views) * 10000) / 100 : 0,
      shareRate: data.views > 0 ? Math.round((data.shares / data.views) * 10000) / 100 : 0,
      saveRate: data.views > 0 ? Math.round((data.saves / data.views) * 10000) / 100 : 0,
      avgWatchTime: data.views > 0 ? Math.round(data.watchTime / data.views) : 0
    }));
    
    res.json({
      engagementMetrics: {
        totalViews: engagementMetrics.totalViews,
        totalLikes: engagementMetrics.totalLikes,
        totalComments: engagementMetrics.totalComments,
        totalShares: engagementMetrics.totalShares,
        totalSaves: engagementMetrics.totalSaves,
        totalWatchTime: engagementMetrics.totalWatchTime,
        avgCompletionRate: Math.round(avgCompletionRate * 100) / 100,
        avgBounceRate: Math.round(avgBounceRate * 100) / 100,
        likeRate: engagementMetrics.totalViews > 0 ? Math.round((engagementMetrics.totalLikes / engagementMetrics.totalViews) * 10000) / 100 : 0,
        commentRate: engagementMetrics.totalViews > 0 ? Math.round((engagementMetrics.totalComments / engagementMetrics.totalViews) * 10000) / 100 : 0,
        shareRate: engagementMetrics.totalViews > 0 ? Math.round((engagementMetrics.totalShares / engagementMetrics.totalViews) * 10000) / 100 : 0,
        saveRate: engagementMetrics.totalViews > 0 ? Math.round((engagementMetrics.totalSaves / engagementMetrics.totalViews) * 10000) / 100 : 0,
        avgWatchTime: engagementMetrics.totalViews > 0 ? Math.round(engagementMetrics.totalWatchTime / engagementMetrics.totalViews) : 0
      },
      platformBreakdown,
      campaignBreakdown
    });
    
  } catch (error) {
    console.error('Get engagement details error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch engagement details'
    });
  }
});

// @route   GET /api/analytics/retention-curve
// @desc    Get video retention curve analysis
// @access  Private
router.get('/retention-curve', async (req, res) => {
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
    
    // Generate retention curve data (in real app, this would come from analytics platform)
    const retentionCurve = [];
    const totalViews = filteredData.reduce((sum, item) => sum + item.views, 0);
    
    // Create retention points at different video durations
    const retentionPoints = [
      { second: 0, label: 'Start' },
      { second: 3, label: '3s' },
      { second: 5, label: '5s' },
      { second: 10, label: '10s' },
      { second: 15, label: '15s' },
      { second: 20, label: '20s' },
      { second: 30, label: '30s' },
      { second: 45, label: '45s' },
      { second: 60, label: '1m' },
      { second: 90, label: '1.5m' },
      { second: 120, label: '2m' },
      { second: 180, label: '3m' },
      { second: 300, label: '5m' }
    ];
    
    retentionPoints.forEach((point, index) => {
      // Calculate retention percentage (decreasing over time)
      let retentionRate;
      if (point.second === 0) {
        retentionRate = 100;
      } else if (point.second <= 10) {
        retentionRate = 100 - (point.second * 2); // Sharp drop in first 10 seconds
      } else if (point.second <= 30) {
        retentionRate = 80 - ((point.second - 10) * 1.5); // Moderate drop
      } else if (point.second <= 60) {
        retentionRate = 65 - ((point.second - 30) * 0.8); // Gradual decline
      } else {
        retentionRate = Math.max(45 - ((point.second - 60) * 0.3), 20); // Slow decline
      }
      
      // Add some randomness
      retentionRate += (Math.random() - 0.5) * 10;
      retentionRate = Math.max(0, Math.min(100, retentionRate));
      
      const retainedViews = Math.round((retentionRate / 100) * totalViews);
      
      retentionCurve.push({
        second: point.second,
        label: point.label,
        retentionRate: Math.round(retentionRate * 100) / 100,
        retainedViews,
        dropOff: index === 0 ? 0 : retentionCurve[index - 1].retentionRate - retentionRate
      });
    });
    
    // Calculate key metrics
    const avgRetentionRate = retentionCurve.reduce((sum, point) => sum + point.retentionRate, 0) / retentionCurve.length;
    const peakRetention = Math.max(...retentionCurve.map(point => point.retentionRate));
    const lowestRetention = Math.min(...retentionCurve.map(point => point.retentionRate));
    
    // Find retention milestones
    const milestones = {
      '25%': retentionCurve.find(point => point.retentionRate <= 25)?.second || null,
      '50%': retentionCurve.find(point => point.retentionRate <= 50)?.second || null,
      '75%': retentionCurve.find(point => point.retentionRate <= 75)?.second || null
    };
    
    // Platform breakdown
    const platformRetention = {};
    const platforms = [...new Set(filteredData.map(item => item.platform))];
    
    platforms.forEach(platform => {
      const platformData = filteredData.filter(item => item.platform === platform);
      const platformViews = platformData.reduce((sum, item) => sum + item.views, 0);
      
      platformRetention[platform] = retentionCurve.map(point => {
        let platformRetentionRate;
        if (point.second === 0) {
          platformRetentionRate = 100;
        } else if (point.second <= 10) {
          platformRetentionRate = 100 - (point.second * 2.2); // Slightly different drop rates per platform
        } else if (point.second <= 30) {
          platformRetentionRate = 78 - ((point.second - 10) * 1.6);
        } else if (point.second <= 60) {
          platformRetentionRate = 62 - ((point.second - 30) * 0.9);
        } else {
          platformRetentionRate = Math.max(43 - ((point.second - 60) * 0.4), 18);
        }
        
        platformRetentionRate += (Math.random() - 0.5) * 8;
        platformRetentionRate = Math.max(0, Math.min(100, platformRetentionRate));
        
        return {
          second: point.second,
          label: point.label,
          retentionRate: Math.round(platformRetentionRate * 100) / 100,
          retainedViews: Math.round((platformRetentionRate / 100) * platformViews)
        };
      });
    });
    
    res.json({
      retentionCurve,
      summary: {
        totalViews,
        avgRetentionRate: Math.round(avgRetentionRate * 100) / 100,
        peakRetention: Math.round(peakRetention * 100) / 100,
        lowestRetention: Math.round(lowestRetention * 100) / 100,
        milestones
      },
      platformRetention,
      insights: {
        criticalDropOff: retentionCurve.find(point => point.second === 3)?.dropOff || 0,
        engagementZone: retentionCurve.find(point => point.second === 15)?.retentionRate || 0,
        retentionStrength: avgRetentionRate > 70 ? 'Strong' : avgRetentionRate > 50 ? 'Moderate' : 'Weak'
      }
    });
    
  } catch (error) {
    console.error('Get retention curve error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch retention curve'
    });
  }
});

module.exports = router;
