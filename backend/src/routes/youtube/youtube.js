const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const youtubeService = require('../../services/youtubeService');

// Configure multer for video uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../../uploads/youtube');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit
    files: 1
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Only video files are allowed'));
    }
  }
});

// @route   GET /api/youtube/auth
// @desc    Get YouTube OAuth2 authorization URL
// @access  Private
router.get('/auth', async (req, res) => {
  try {
    const authUrl = youtubeService.getAuthUrl();
    res.json({
      success: true,
      authUrl
    });
  } catch (error) {
    console.error('Get auth URL error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get authorization URL',
      message: error.message
    });
  }
});

// @route   POST /api/youtube/auth/callback
// @desc    Handle OAuth2 callback and get tokens
// @access  Private
router.post('/auth/callback', async (req, res) => {
  try {
    const { code } = req.body;
    
    if (!code) {
      return res.status(400).json({
        success: false,
        error: 'Authorization code is required'
      });
    }

    const tokens = await youtubeService.getTokensFromCode(code);
    
    res.json({
      success: true,
      message: 'YouTube authorization successful',
      tokens
    });
  } catch (error) {
    console.error('Auth callback error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to complete authorization',
      message: error.message
    });
  }
});

// @route   POST /api/youtube/upload
// @desc    Upload video to YouTube
// @access  Private
router.post('/upload', upload.single('video'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'Video file is required'
      });
    }

    const {
      title,
      description,
      tags,
      categoryId = '22',
      privacyStatus = 'private',
      language = 'en',
      location
    } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        error: 'Video title is required'
      });
    }

    // Parse tags if they're sent as a string
    let parsedTags = tags;
    if (typeof tags === 'string') {
      parsedTags = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
    }

    const videoData = {
      title,
      description: description || '',
      tags: parsedTags || [],
      categoryId,
      privacyStatus,
      language,
      location: location || null
    };

    const result = await youtubeService.uploadVideo(req.file.path, videoData);

    // Clean up uploaded file
    fs.unlinkSync(req.file.path);

    res.json({
      success: true,
      message: 'Video uploaded successfully to YouTube',
      data: result
    });

  } catch (error) {
    console.error('Video upload error:', error);
    
    // Clean up uploaded file on error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      success: false,
      error: 'Failed to upload video to YouTube',
      message: error.message
    });
  }
});

// @route   GET /api/youtube/channel
// @desc    Get YouTube channel information
// @access  Private
router.get('/channel', async (req, res) => {
  try {
    const channelInfo = await youtubeService.getChannelInfo();
    
    if (!channelInfo) {
      return res.status(404).json({
        success: false,
        error: 'Channel not found or not authorized'
      });
    }

    res.json({
      success: true,
      data: channelInfo
    });
  } catch (error) {
    console.error('Get channel info error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get channel information',
      message: error.message
    });
  }
});

// @route   GET /api/youtube/videos
// @desc    Get recent YouTube uploads
// @access  Private
router.get('/videos', async (req, res) => {
  try {
    const { maxResults = 10 } = req.query;
    const videos = await youtubeService.getRecentUploads(parseInt(maxResults));
    
    res.json({
      success: true,
      data: videos
    });
  } catch (error) {
    console.error('Get videos error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get videos',
      message: error.message
    });
  }
});

// @route   PUT /api/youtube/videos/:videoId
// @desc    Update YouTube video metadata
// @access  Private
router.put('/videos/:videoId', async (req, res) => {
  try {
    const { videoId } = req.params;
    const {
      title,
      description,
      tags,
      categoryId,
      privacyStatus,
      language
    } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        error: 'Video title is required'
      });
    }

    const updateData = {
      title,
      description: description || '',
      tags: tags || [],
      categoryId: categoryId || '22',
      privacyStatus: privacyStatus || 'private',
      language: language || 'en'
    };

    const result = await youtubeService.updateVideo(videoId, updateData);
    
    res.json({
      success: true,
      message: 'Video updated successfully',
      data: result
    });
  } catch (error) {
    console.error('Update video error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update video',
      message: error.message
    });
  }
});

// @route   DELETE /api/youtube/videos/:videoId
// @desc    Delete YouTube video
// @access  Private
router.delete('/videos/:videoId', async (req, res) => {
  try {
    const { videoId } = req.params;
    const result = await youtubeService.deleteVideo(videoId);
    
    res.json({
      success: true,
      message: 'Video deleted successfully',
      data: result
    });
  } catch (error) {
    console.error('Delete video error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete video',
      message: error.message
    });
  }
});

// @route   GET /api/youtube/videos/:videoId/analytics
// @desc    Get YouTube video analytics
// @access  Private
router.get('/videos/:videoId/analytics', async (req, res) => {
  try {
    const { videoId } = req.params;
    const analytics = await youtubeService.getVideoAnalytics(videoId);
    
    if (!analytics) {
      return res.status(404).json({
        success: false,
        error: 'Video not found'
      });
    }

    res.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    console.error('Get video analytics error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get video analytics',
      message: error.message
    });
  }
});

module.exports = router;
