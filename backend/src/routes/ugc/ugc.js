const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();

// Mock data storage (replace with Supabase in production)
let campaigns = [];
let ugcVideos = [];

// Validation middleware
const validateCreateCampaign = [
  body('productId').notEmpty().withMessage('Product ID is required'),
  body('campaignName').trim().isLength({ min: 3 }).withMessage('Campaign name must be at least 3 characters'),
  body('targetPlatforms').isArray({ min: 1 }).withMessage('At least one target platform is required'),
  body('videoLength').isIn(['15', '30', '60']).withMessage('Video length must be 15, 30, or 60 seconds')
];

const validateGenerateVideo = [
  body('campaignId').notEmpty().withMessage('Campaign ID is required'),
  body('avatarStyle').isIn(['friendly', 'professional', 'enthusiastic', 'casual']).withMessage('Invalid avatar style'),
  body('voiceStyle').isIn(['male', 'female', 'neutral']).withMessage('Invalid voice style'),
  body('scriptTone').isIn(['conversational', 'professional', 'casual', 'enthusiastic']).withMessage('Invalid script tone')
];

// @route   POST /api/ugc/campaigns
// @desc    Create a new UGC campaign
// @access  Private
router.post('/campaigns', validateCreateCampaign, async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { productId, campaignName, targetPlatforms, videoLength, description } = req.body;

    // Create new campaign
    const newCampaign = {
      id: `camp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      productId,
      campaignName,
      description: description || '',
      targetPlatforms,
      videoLength: parseInt(videoLength),
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      videoCount: 0,
      totalViews: 0,
      totalClicks: 0,
      totalConversions: 0
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

// @route   GET /api/ugc/campaigns
// @desc    Get all campaigns
// @access  Private
router.get('/campaigns', async (req, res) => {
  try {
    const { status, limit = 50, offset = 0 } = req.query;

    let filteredCampaigns = [...campaigns];

    // Filter by status if provided
    if (status) {
      filteredCampaigns = filteredCampaigns.filter(c => c.status === status);
    }

    // Apply pagination
    const paginatedCampaigns = filteredCampaigns.slice(offset, offset + parseInt(limit));

    res.json({
      campaigns: paginatedCampaigns,
      pagination: {
        total: filteredCampaigns.length,
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: offset + parseInt(limit) < filteredCampaigns.length
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

// @route   GET /api/ugc/campaigns/:id
// @desc    Get a specific campaign by ID
// @access  Private
router.get('/campaigns/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const campaign = campaigns.find(c => c.id === id);
    
    if (!campaign) {
      return res.status(404).json({
        error: 'Campaign not found',
        message: 'The requested campaign does not exist'
      });
    }

    // Get videos for this campaign
    const campaignVideos = ugcVideos.filter(v => v.campaignId === id);

    res.json({
      campaign: {
        ...campaign,
        videos: campaignVideos
      }
    });

  } catch (error) {
    console.error('Get campaign error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch campaign'
    });
  }
});

// @route   POST /api/ugc/generate
// @desc    Generate a new UGC video
// @access  Private
router.post('/generate', validateGenerateVideo, async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { campaignId, avatarStyle, voiceStyle, scriptTone, customScript } = req.body;

    // Check if campaign exists
    const campaign = campaigns.find(c => c.id === campaignId);
    if (!campaign) {
      return res.status(404).json({
        error: 'Campaign not found',
        message: 'The specified campaign does not exist'
      });
    }

    // In a real app, this would call the FastAPI AI service
    // For now, we'll simulate the generation process
    
    // Simulate AI processing time
    const processingTime = Math.floor(Math.random() * 30) + 10; // 10-40 seconds
    
    // Generate mock script if not provided
    const script = customScript || generateMockScript(campaign, scriptTone);
    
    // Create new UGC video
    const newVideo = {
      id: `video_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      campaignId,
      avatarStyle,
      voiceStyle,
      scriptTone,
      script,
      status: 'generating',
      createdAt: new Date().toISOString(),
      processingStartedAt: new Date().toISOString(),
      estimatedCompletion: new Date(Date.now() + processingTime * 1000).toISOString(),
      videoUrl: null,
      thumbnailUrl: null,
      duration: campaign.videoLength,
      platforms: campaign.targetPlatforms,
      analytics: {
        views: 0,
        clicks: 0,
        conversions: 0,
        ctr: 0,
        hookRate: 0
      }
    };

    ugcVideos.push(newVideo);

    // Update campaign video count
    campaign.videoCount += 1;
    campaign.updatedAt = new Date().toISOString();

    // Simulate video generation completion after processing time
    setTimeout(() => {
      const videoIndex = ugcVideos.findIndex(v => v.id === newVideo.id);
      if (videoIndex !== -1) {
        ugcVideos[videoIndex].status = 'completed';
        ugcVideos[videoIndex].videoUrl = `https://storage.reelmate.com/videos/${newVideo.id}.mp4`;
        ugcVideos[videoIndex].thumbnailUrl = `https://storage.reelmate.com/thumbnails/${newVideo.id}.jpg`;
        ugcVideos[videoIndex].completedAt = new Date().toISOString();
      }
    }, processingTime * 1000);

    res.status(202).json({
      message: 'Video generation started',
      video: {
        id: newVideo.id,
        status: newVideo.status,
        estimatedCompletion: newVideo.estimatedCompletion,
        processingStartedAt: newVideo.processingStartedAt
      },
      processingTime
    });

  } catch (error) {
    console.error('Generate video error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to generate video'
    });
  }
});

// @route   GET /api/ugc/videos
// @desc    Get all UGC videos
// @access  Private
router.get('/videos', async (req, res) => {
  try {
    const { campaignId, status, limit = 50, offset = 0 } = req.query;

    let filteredVideos = [...ugcVideos];

    // Filter by campaign if provided
    if (campaignId) {
      filteredVideos = filteredVideos.filter(v => v.campaignId === campaignId);
    }

    // Filter by status if provided
    if (status) {
      filteredVideos = filteredVideos.filter(v => v.status === status);
    }

    // Apply pagination
    const paginatedVideos = filteredVideos.slice(offset, offset + parseInt(limit));

    res.json({
      videos: paginatedVideos,
      pagination: {
        total: filteredVideos.length,
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: offset + parseInt(limit) < filteredVideos.length
      }
    });

  } catch (error) {
    console.error('Get videos error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch videos'
    });
  }
});

// @route   GET /api/ugc/videos/:id
// @desc    Get a specific video by ID
// @access  Private
router.get('/videos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const video = ugcVideos.find(v => v.id === id);
    
    if (!video) {
      return res.status(404).json({
        error: 'Video not found',
        message: 'The requested video does not exist'
      });
    }

    res.json({
      video
    });

  } catch (error) {
    console.error('Get video error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch video'
    });
  }
});

// @route   POST /api/ugc/videos/:id/publish
// @desc    Publish video to social platforms
// @access  Private
router.post('/videos/:id/publish', async (req, res) => {
  try {
    const { id } = req.params;
    const { platforms } = req.body;
    
    const video = ugcVideos.find(v => v.id === id);
    
    if (!video) {
      return res.status(404).json({
        error: 'Video not found',
        message: 'The requested video does not exist'
      });
    }

    if (video.status !== 'completed') {
      return res.status(400).json({
        error: 'Video not ready',
        message: 'Video must be completed before publishing'
      });
    }

    // In a real app, this would call the social media APIs
    // For now, we'll simulate publishing
    
    const publishResults = platforms.map(platform => ({
      platform,
      status: 'published',
      publishedAt: new Date().toISOString(),
      postId: `post_${platform}_${Date.now()}`,
      url: `https://${platform}.com/posts/post_${platform}_${Date.now()}`
    }));

    // Update video status
    video.status = 'published';
    video.publishedAt = new Date().toISOString();
    video.publishResults = publishResults;

    res.json({
      message: 'Video published successfully',
      publishResults
    });

  } catch (error) {
    console.error('Publish video error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to publish video'
    });
  }
});

// Helper function to generate mock scripts
function generateMockScript(campaign, tone) {
  const scripts = {
    conversational: `Hey there! I just discovered this amazing product and I have to share it with you. It's completely changed how I [benefit]. The quality is incredible and the results speak for themselves. If you're looking for [solution], this is definitely worth checking out!`,
    professional: `As someone who values quality and innovation, I'm excited to introduce you to this exceptional product. It delivers outstanding [benefit] with a level of craftsmanship that exceeds expectations. For professionals seeking [solution], this represents the gold standard.`,
    casual: `OMG, you guys! I found this product and it's literally the best thing ever! I can't believe I went so long without it. It's super [benefit] and honestly, everyone needs this in their life. Trust me, you won't regret it!`,
    enthusiastic: `WOW! This product is absolutely INCREDIBLE! I'm so excited to tell you about it because it's literally life-changing! The [benefit] is off the charts and I'm obsessed with how amazing it is. You NEED this in your life right now!`
  };

  return scripts[tone] || scripts.conversational;
}

module.exports = router;
