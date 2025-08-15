const express = require('express');
const router = express.Router();

const aiStudioService = require('../../services/aiStudioService');
const videoGenerationService = require('../../services/videoGenerationService');

// @route   GET /api/ai-studio/prompt-templates
// @desc    Get prompt templates
// @access  Private
router.get('/prompt-templates', async (req, res) => {
  try {
    const { category, isPublic = true } = req.query;
    const userId = 'dbd09748-fc44-4af1-9a1d-1ff8ed5025a9'; // Test user ID

    const templates = await aiStudioService.getPromptTemplates(userId, category, isPublic === 'true');
    
    res.json({
      success: true,
      data: templates
    });
  } catch (error) {
    console.error('Get prompt templates error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch prompt templates',
      message: error.message
    });
  }
});

// @route   POST /api/ai-studio/prompt-templates
// @desc    Create a new prompt template
// @access  Private
router.post('/prompt-templates', async (req, res) => {
  try {
    const { name, category, description, template_text, is_public = false } = req.body;
    const userId = 'dbd09748-fc44-4af1-9a1d-1ff8ed5025a9'; // Test user ID

    if (!name || !template_text) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        message: 'Name and template text are required'
      });
    }

    const templateData = {
      name,
      category,
      description,
      template_text,
      is_public,
      user_id: userId
    };

    const template = await aiStudioService.createPromptTemplate(templateData);
    
    res.status(201).json({
      success: true,
      data: template
    });
  } catch (error) {
    console.error('Create prompt template error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create prompt template',
      message: error.message
    });
  }
});

// @route   GET /api/ai-studio/avatars
// @desc    Get AI avatars
// @access  Private
router.get('/avatars', async (req, res) => {
  try {
    const { activeOnly = true } = req.query;
    
    const avatars = await aiStudioService.getAvatars(activeOnly === 'true');
    
    res.json({
      success: true,
      data: avatars
    });
  } catch (error) {
    console.error('Get avatars error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch avatars',
      message: error.message
    });
  }
});

// @route   GET /api/ai-studio/voices
// @desc    Get AI voices
// @access  Private
router.get('/voices', async (req, res) => {
  try {
    const { activeOnly = true } = req.query;
    
    const voices = await aiStudioService.getVoices(activeOnly === 'true');
    
    res.json({
      success: true,
      data: voices
    });
  } catch (error) {
    console.error('Get voices error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch voices',
      message: error.message
    });
  }
});

// @route   POST /api/ai-studio/generate-video
// @desc    Generate a new video
// @access  Private
router.post('/generate-video', async (req, res) => {
  try {
    const {
      campaignId,
      script,
      avatarId,
      voiceId,
      promptTemplateId,
      toneSettings,
      generationSettings
    } = req.body;
    const userId = 'dbd09748-fc44-4af1-9a1d-1ff8ed5025a9'; // Test user ID

    if (!script) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        message: 'Script is required'
      });
    }

    const generationData = {
      userId,
      campaignId,
      script,
      avatarId,
      voiceId,
      promptTemplateId,
      toneSettings,
      generationSettings
    };

    const job = await videoGenerationService.generateVideo(generationData);
    
    res.status(201).json({
      success: true,
      data: job,
      message: 'Video generation started successfully'
    });
  } catch (error) {
    console.error('Generate video error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate video',
      message: error.message
    });
  }
});

// @route   GET /api/ai-studio/generation-status/:jobId
// @desc    Get video generation status
// @access  Private
router.get('/generation-status/:jobId', async (req, res) => {
  try {
    const { jobId } = req.params;
    const userId = 'dbd09748-fc44-4af1-9a1d-1ff8ed5025a9'; // Test user ID

    // Verify job belongs to user (temporarily disabled for testing)
    const job = await aiStudioService.getVideoGenerationJob(jobId);
    // if (job.user_id !== userId) {
    //   return res.status(403).json({
    //     success: false,
    //     error: 'Access denied',
    //     message: 'You can only view your own generation jobs'
    //   });
    // }

    const status = await videoGenerationService.getGenerationStatus(jobId);
    
    res.json({
      success: true,
      data: status
    });
  } catch (error) {
    console.error('Get generation status error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch generation status',
      message: error.message
    });
  }
});

// @route   GET /api/ai-studio/generation-jobs
// @desc    Get user's video generation jobs
// @access  Private
router.get('/generation-jobs', async (req, res) => {
  try {
    const { status, limit = 20, offset = 0 } = req.query;
    const userId = 'dbd09748-fc44-4af1-9a1d-1ff8ed5025a9'; // Test user ID

    const jobs = await aiStudioService.getUserVideoGenerationJobs(
      userId, 
      status, 
      parseInt(limit), 
      parseInt(offset)
    );
    
    res.json({
      success: true,
      data: jobs
    });
  } catch (error) {
    console.error('Get generation jobs error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch generation jobs',
      message: error.message
    });
  }
});

// @route   GET /api/ai-studio/generated-videos
// @desc    Get user's generated videos
// @access  Private
router.get('/generated-videos', async (req, res) => {
  try {
    const { campaignId, limit = 20, offset = 0 } = req.query;
    const userId = '00000000-0000-0000-0000-000000000000'; // Temporary for testing

    const videos = await aiStudioService.getUserGeneratedVideos(
      userId, 
      campaignId, 
      parseInt(limit), 
      parseInt(offset)
    );
    
    res.json({
      success: true,
      data: videos
    });
  } catch (error) {
    console.error('Get generated videos error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch generated videos',
      message: error.message
    });
  }
});

// @route   POST /api/ai-studio/script-from-template
// @desc    Generate script from template
// @access  Private
router.post('/script-from-template', async (req, res) => {
  try {
    const { templateId, customText } = req.body;

    if (!templateId) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        message: 'Template ID is required'
      });
    }

    const result = await aiStudioService.generateScriptFromTemplate(templateId, customText);
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Generate script from template error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate script from template',
      message: error.message
    });
  }
});

// @route   POST /api/ai-studio/estimate-cost
// @desc    Estimate video generation cost
// @access  Private
router.post('/estimate-cost', async (req, res) => {
  try {
    const { jobType, duration, quality = 'standard' } = req.body;

    if (!jobType || !duration) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        message: 'Job type and duration are required'
      });
    }

    const costEstimate = await aiStudioService.estimateVideoCost(jobType, duration, quality);
    
    res.json({
      success: true,
      data: costEstimate
    });
  } catch (error) {
    console.error('Estimate cost error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to estimate cost',
      message: error.message
    });
  }
});

module.exports = router;
