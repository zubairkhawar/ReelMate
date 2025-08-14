const express = require('express');
const router = express.Router();

// Mock campaigns data (replace with Supabase in production)
let campaigns = [
  {
    id: '1',
    name: 'Summer Collection UGC Challenge',
    thumbnail: '/api/placeholder/60/40',
    type: 'ugc-video',
    status: 'active',
    videoCount: 8,
    totalViews: 3200,
    engagement: 89,
    watchTime: 4.2,
    platform: 'tiktok',
    createdAt: '2024-01-15',
    targetAudience: 'Fashion enthusiasts, 18-35',
    budget: 2500,
    description: 'Generate authentic UGC content showcasing our summer collection',
    tags: ['fashion', 'summer', 'ugc', 'challenge'],
    settings: {
      autoApprove: false,
      requireModeration: true,
      maxVideos: 20,
      rewardSystem: true
    }
  },
  {
    id: '2',
    name: 'Product Launch UGC Series',
    thumbnail: '/api/placeholder/60/40',
    type: 'ai-generated',
    status: 'scheduled',
    videoCount: 12,
    totalViews: 2100,
    engagement: 67,
    watchTime: 3.8,
    platform: 'instagram',
    createdAt: '2024-01-12',
    targetAudience: 'Tech-savvy consumers, 25-45',
    budget: 3500,
    description: 'AI-generated product demonstration videos for new product launch',
    tags: ['tech', 'product-launch', 'ai-generated', 'demo'],
    settings: {
      autoApprove: true,
      requireModeration: false,
      maxVideos: 15,
      rewardSystem: false
    }
  },
  {
    id: '3',
    name: 'Holiday UGC Campaign',
    thumbnail: '/api/placeholder/60/40',
    type: 'user-submitted',
    status: 'completed',
    videoCount: 15,
    totalViews: 8900,
    engagement: 234,
    watchTime: 4.5,
    platform: 'multi-platform',
    createdAt: '2024-01-08',
    targetAudience: 'General audience, all ages',
    budget: 5000,
    description: 'Holiday-themed user-generated content campaign',
    tags: ['holiday', 'seasonal', 'user-submitted', 'multi-platform'],
    settings: {
      autoApprove: false,
      requireModeration: true,
      maxVideos: 30,
      rewardSystem: true
    }
  }
];

// @route   GET /api/campaigns
// @desc    Get all campaigns with filters
// @access  Private
router.get('/', async (req, res) => {
  try {
    const { 
      status, 
      type, 
      platform, 
      search, 
      dateRange,
      page = 1,
      limit = 10
    } = req.query;
    
    let filteredCampaigns = [...campaigns];
    
    // Apply filters
    if (status && status !== 'all') {
      filteredCampaigns = filteredCampaigns.filter(c => c.status === status);
    }
    
    if (type && type !== 'all') {
      filteredCampaigns = filteredCampaigns.filter(c => c.type === type);
    }
    
    if (platform && platform !== 'all') {
      filteredCampaigns = filteredCampaigns.filter(c => c.platform === platform);
    }
    
    if (search) {
      filteredCampaigns = filteredCampaigns.filter(c => 
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.description.toLowerCase().includes(search.toLowerCase()) ||
        c.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()))
      );
    }
    
    if (dateRange && dateRange !== 'all') {
      const now = new Date();
      let startDate;
      
      switch (dateRange) {
        case '7d':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case '30d':
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case '90d':
          startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          break;
        default:
          startDate = new Date(0);
      }
      
      filteredCampaigns = filteredCampaigns.filter(c => 
        new Date(c.createdAt) >= startDate
      );
    }
    
    // Apply pagination
    const startIndex = (parseInt(page) - 1) * parseInt(limit);
    const endIndex = startIndex + parseInt(limit);
    const paginatedCampaigns = filteredCampaigns.slice(startIndex, endIndex);
    
    res.json({
      campaigns: paginatedCampaigns,
      pagination: {
        total: filteredCampaigns.length,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(filteredCampaigns.length / parseInt(limit)),
        hasNext: endIndex < filteredCampaigns.length,
        hasPrev: startIndex > 0
      }
    });
    
  } catch (error) {
    console.error('Get campaigns error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch campaigns'
    });
  }
});

// @route   POST /api/campaigns
// @desc    Create a new campaign
// @access  Private
router.post('/', async (req, res) => {
  try {
    const {
      name,
      type,
      platform,
      targetAudience,
      budget,
      description,
      tags,
      settings
    } = req.body;
    
    // Validation
    if (!name || !type || !platform) {
      return res.status(400).json({
        error: 'Validation error',
        message: 'Name, type, and platform are required'
      });
    }
    
    const newCampaign = {
      id: `campaign_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      thumbnail: '/api/placeholder/60/40',
      type,
      status: 'draft',
      videoCount: 0,
      totalViews: 0,
      engagement: 0,
      watchTime: 0,
      platform,
      createdAt: new Date().toISOString().split('T')[0],
      targetAudience: targetAudience || 'General audience',
      budget: budget || 0,
      description: description || '',
      tags: tags || [],
      settings: {
        autoApprove: false,
        requireModeration: true,
        maxVideos: 20,
        rewardSystem: false,
        ...settings
      }
    };
    
    campaigns.push(newCampaign);
    
    res.status(201).json({
      message: 'Campaign created successfully',
      campaign: newCampaign
    });
    
  } catch (error) {
    console.error('Create campaign error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to create campaign'
    });
  }
});

// @route   PUT /api/campaigns/:id
// @desc    Update a campaign
// @access  Private
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const campaignIndex = campaigns.findIndex(c => c.id === id);
    
    if (campaignIndex === -1) {
      return res.status(404).json({
        error: 'Not found',
        message: 'Campaign not found'
      });
    }
    
    campaigns[campaignIndex] = {
      ...campaigns[campaignIndex],
      ...updateData,
      id // Ensure ID doesn't change
    };
    
    res.json({
      message: 'Campaign updated successfully',
      campaign: campaigns[campaignIndex]
    });
    
  } catch (error) {
    console.error('Update campaign error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to update campaign'
    });
  }
});

// @route   DELETE /api/campaigns/:id
// @desc    Delete a campaign
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const campaignIndex = campaigns.findIndex(c => c.id === id);
    
    if (campaignIndex === -1) {
      return res.status(404).json({
        error: 'Not found',
        message: 'Campaign not found'
      });
    }
    
    campaigns.splice(campaignIndex, 1);
    
    res.json({
      message: 'Campaign deleted successfully'
    });
    
  } catch (error) {
    console.error('Delete campaign error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to delete campaign'
    });
  }
});

// @route   POST /api/campaigns/bulk-actions
// @desc    Perform bulk actions on campaigns
// @access  Private
router.post('/bulk-actions', async (req, res) => {
  try {
    const { action, campaignIds } = req.body;
    
    if (!action || !campaignIds || !Array.isArray(campaignIds)) {
      return res.status(400).json({
        error: 'Validation error',
        message: 'Action and campaignIds array are required'
      });
    }
    
    const validCampaignIds = campaigns.filter(c => campaignIds.includes(c.id)).map(c => c.id);
    
    if (validCampaignIds.length === 0) {
      return res.status(400).json({
        error: 'Validation error',
        message: 'No valid campaign IDs provided'
      });
    }
    
    let results = [];
    
    switch (action) {
      case 'duplicate':
        results = validCampaignIds.map(id => {
          const original = campaigns.find(c => c.id === id);
          const duplicate = {
            ...original,
            id: `campaign_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            name: `${original.name} (Copy)`,
            status: 'draft',
            videoCount: 0,
            totalViews: 0,
            engagement: 0,
            watchTime: 0,
            createdAt: new Date().toISOString().split('T')[0]
          };
          campaigns.push(duplicate);
          return { id, action: 'duplicated', newId: duplicate.id };
        });
        break;
        
      case 'export':
        results = validCampaignIds.map(id => {
          const campaign = campaigns.find(c => c.id === id);
          return {
            id,
            action: 'exported',
            data: campaign
          };
        });
        break;
        
      case 'delete':
        results = validCampaignIds.map(id => {
          const campaignIndex = campaigns.findIndex(c => c.id === id);
          if (campaignIndex !== -1) {
            campaigns.splice(campaignIndex, 1);
            return { id, action: 'deleted' };
          }
          return { id, action: 'not_found' };
        });
        break;
        
      case 'pause':
        results = validCampaignIds.map(id => {
          const campaign = campaigns.find(c => c.id === id);
          if (campaign && campaign.status === 'active') {
            campaign.status = 'paused';
            return { id, action: 'paused' };
          }
          return { id, action: 'not_pausable' };
        });
        break;
        
      case 'activate':
        results = validCampaignIds.map(id => {
          const campaign = campaigns.find(c => c.id === id);
          if (campaign && campaign.status === 'paused') {
            campaign.status = 'active';
            return { id, action: 'activated' };
          }
          return { id, action: 'not_activatable' };
        });
        break;
        
      default:
        return res.status(400).json({
          error: 'Validation error',
          message: 'Invalid action specified'
        });
    }
    
    res.json({
      message: `Bulk action '${action}' completed`,
      results,
      summary: {
        totalRequested: campaignIds.length,
        totalProcessed: validCampaignIds.length,
        action
      }
    });
    
  } catch (error) {
    console.error('Bulk actions error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to perform bulk actions'
    });
  }
});

// @route   GET /api/campaigns/playbook
// @desc    Get campaign playbook with best practices
// @access  Private
router.get('/playbook', async (req, res) => {
  try {
    const playbook = {
      title: 'UGC Campaign Playbook',
      description: 'Proven strategies and best practices for successful UGC campaigns',
      sections: [
        {
          title: 'Campaign Setup',
          items: [
            {
              title: 'Define Clear Objectives',
              description: 'Set specific, measurable goals for your UGC campaign',
              tips: ['Increase brand awareness', 'Drive conversions', 'Build community'],
              examples: ['Summer Collection UGC Challenge', 'Product Launch UGC Series']
            },
            {
              title: 'Target Audience Research',
              description: 'Understand your audience demographics and preferences',
              tips: ['Analyze existing customer data', 'Use social media insights', 'Conduct surveys'],
              examples: ['Age groups: 18-35', 'Interests: Fashion, Lifestyle', 'Platforms: TikTok, Instagram']
            },
            {
              title: 'Platform Selection',
              description: 'Choose platforms based on your audience and content type',
              tips: ['TikTok for short-form video', 'Instagram for visual content', 'YouTube for longer content'],
              examples: ['TikTok: 15-60 second videos', 'Instagram: Stories and Reels', 'YouTube: 2-10 minute videos']
            }
          ]
        },
        {
          title: 'Content Strategy',
          items: [
            {
              title: 'Content Guidelines',
              description: 'Provide clear guidelines for creators while allowing creativity',
              tips: ['Include brand elements naturally', 'Specify key messages', 'Set quality standards'],
              examples: ['Show product in use', 'Include brand hashtag', 'Maintain authentic tone']
            },
            {
              title: 'Hook Creation',
              description: 'Create compelling opening moments to capture attention',
              tips: ['Start with a question', 'Show transformation', 'Use trending sounds'],
              examples: ['Problem-Agitate-Solve format', 'Before/After sequences', 'Popular music tracks']
            },
            {
              title: 'Call-to-Action',
              description: 'Include clear next steps for viewers',
              tips: ['Make it specific', 'Create urgency', 'Offer value'],
              examples: ['Shop now', 'Limited time offer', 'Download guide']
            }
          ]
        },
        {
          title: 'Creator Management',
          items: [
            {
              title: 'Creator Selection',
              description: 'Choose creators who align with your brand values',
              tips: ['Check engagement rates', 'Review content quality', 'Assess audience fit'],
              examples: ['Engagement rate > 3%', 'Content style matches brand', 'Audience demographics align']
            },
            {
              title: 'Compensation Strategy',
              description: 'Develop fair compensation models for creators',
              tips: ['Base pay + performance bonus', 'Product gifting', 'Revenue sharing'],
              examples: ['$100 base + $50 per 10K views', 'Free product samples', '15% commission on sales']
            },
            {
              title: 'Relationship Building',
              description: 'Foster long-term relationships with top creators',
              tips: ['Regular communication', 'Exclusive opportunities', 'Creator feedback'],
              examples: ['Monthly check-ins', 'Early access to products', 'Creator advisory board']
            }
          ]
        },
        {
          title: 'Performance Optimization',
          items: [
            {
              title: 'A/B Testing',
              description: 'Test different content variations to optimize performance',
              tips: ['Test hooks', 'Test CTAs', 'Test video length'],
              examples: ['Hook A vs Hook B', 'Shop now vs Learn more', '15s vs 30s vs 60s']
            },
            {
              title: 'Analytics Review',
              description: 'Regularly analyze performance data to identify trends',
              tips: ['Monitor key metrics', 'Identify top performers', 'Track audience behavior'],
              examples: ['CTR, conversion rate, watch time', 'Top 10% performing videos', 'Audience retention curves']
            },
            {
              title: 'Iteration',
              description: 'Continuously improve based on data insights',
              tips: ['Scale what works', 'Optimize underperformers', 'Test new approaches'],
              examples: ['Increase budget for top performers', 'Refine low-performing content', 'Try new content formats']
            }
          ]
        }
      ],
      templates: [
        {
          name: 'Problem-Agitate-Solve',
          description: 'Identify a problem, agitate it, then present your solution',
          structure: ['Hook: Problem statement', 'Middle: Problem consequences', 'End: Solution presentation'],
          examples: ['Summer Collection UGC Challenge', 'Product Launch UGC Series']
        },
        {
          name: 'Before/After',
          description: 'Show transformation or improvement using your product',
          structure: ['Hook: Before state', 'Middle: Process/Product use', 'End: After results'],
          examples: ['Holiday UGC Campaign', 'Brand Story UGC Series']
        },
        {
          name: 'Day in the Life',
          description: 'Show how your product fits into daily routines',
          structure: ['Hook: Morning routine', 'Middle: Product integration', 'End: Evening results'],
          examples: ['Lifestyle UGC Series', 'Product Integration Campaign']
        }
      ],
      metrics: {
        primary: ['CTR (Click-Through Rate)', 'Conversion Rate', 'ROAS (Return on Ad Spend)'],
        secondary: ['Watch Time', 'Engagement Rate', 'Share Rate'],
        benchmarks: {
          'TikTok': { ctr: '2-5%', engagement: '3-8%', watchTime: '15-25s' },
          'Instagram': { ctr: '1-3%', engagement: '2-6%', watchTime: '20-30s' },
          'YouTube': { ctr: '3-7%', engagement: '4-10%', watchTime: '2-5m' }
        }
      }
    };
    
    res.json(playbook);
    
  } catch (error) {
    console.error('Get playbook error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch campaign playbook'
    });
  }
});

module.exports = router;
