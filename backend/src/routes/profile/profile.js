const express = require('express');
const { body, validationResult } = require('express-validator');
const multer = require('multer');
const { authenticateToken } = require('../../middleware/auth');
const profileService = require('../../services/profileService');
const fileUploadService = require('../../services/fileUploadService');

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// Validation middleware
const validateProfileUpdate = [
  body('name').optional().trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').optional().isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('company').optional().trim(),
  body('phone').optional().trim(),
  body('timezone').optional().trim()
];

const validateNotificationUpdate = [
  body('email_notifications').optional().isBoolean().withMessage('Email notifications must be a boolean'),
  body('push_notifications').optional().isBoolean().withMessage('Push notifications must be a boolean'),
  body('sms_notifications').optional().isBoolean().withMessage('SMS notifications must be a boolean'),
  body('marketing_emails').optional().isBoolean().withMessage('Marketing emails must be a boolean'),
  body('security_alerts').optional().isBoolean().withMessage('Security alerts must be a boolean')
];

const validateSettingsUpdate = [
  body('theme').optional().isIn(['light', 'dark', 'auto']).withMessage('Theme must be light, dark, or auto'),
  body('language').optional().isIn(['en', 'es', 'fr', 'de']).withMessage('Language must be en, es, fr, or de'),
  body('timezone').optional().trim(),
  body('date_format').optional().trim(),
  body('time_format').optional().isIn(['12h', '24h']).withMessage('Time format must be 12h or 24h')
];

// Get user profile
router.get('/', authenticateToken, async (req, res) => {
  try {
    const profile = await profileService.getUserProfile(req.user.userId);
    
    res.json({
      success: true,
      profile
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch profile'
    });
  }
});

// Update user profile
router.put('/', authenticateToken, validateProfileUpdate, async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const updatedProfile = await profileService.updateUserProfile(req.user.userId, req.body);
    
    res.json({
      success: true,
      message: 'Profile updated successfully',
      profile: updatedProfile
    });
  } catch (error) {
    console.error('Update profile error:', error);
    
    if (error.message.includes('Email is already taken')) {
      return res.status(409).json({
        success: false,
        message: error.message
      });
    }
    
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update profile'
    });
  }
});

// Upload avatar
router.post('/avatar', authenticateToken, upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No avatar file provided'
      });
    }

    // Validate file
    const validation = await fileUploadService.validateImageFile(req.file);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid file',
        errors: validation.errors
      });
    }

    // Get current user to check if they have an existing avatar
    const currentProfile = await profileService.getUserProfile(req.user.userId);
    const oldAvatarPath = currentProfile.avatar_url ? currentProfile.avatar_url.split('/').pop() : null;

          console.log('🔄 Starting avatar upload process...');
      console.log('📁 File details:', {
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size
      });
      
      // Upload new avatar
      console.log('📤 Uploading to Supabase storage...');
      const uploadResult = await fileUploadService.uploadAvatar(req.file, req.user.userId);
      console.log('✅ Upload successful:', uploadResult);
      
      // Update user profile with new avatar URL
      console.log('💾 Updating user profile with avatar URL...');
      const avatarUrl = await profileService.updateUserAvatar(req.user.userId, uploadResult.url);
      console.log('✅ Profile updated with avatar URL:', avatarUrl);

      // Delete old avatar if it exists
      if (oldAvatarPath) {
        console.log('🗑️ Deleting old avatar...');
        await fileUploadService.deleteAvatar(oldAvatarPath);
      }

      console.log('🎉 Avatar upload process completed successfully');
      res.json({
        success: true,
        message: 'Avatar uploaded successfully',
        avatar: {
          url: avatarUrl,
          path: uploadResult.path
        }
      });
      } catch (error) {
      console.error('Upload avatar error:', error);
      
      // Provide more specific error messages
      let errorMessage = 'Failed to upload avatar';
      if (error.message.includes('Bucket not found')) {
        errorMessage = 'Storage bucket not configured. Please contact support.';
      } else if (error.message.includes('File size too large')) {
        errorMessage = 'File size too large. Maximum size is 5MB.';
      } else if (error.message.includes('Invalid file type')) {
        errorMessage = 'Invalid file type. Only JPEG, PNG, and WebP images are allowed.';
      }
      
      res.status(500).json({
        success: false,
        message: errorMessage,
        details: error.message
      });
    }
});

// Delete avatar
router.delete('/avatar', authenticateToken, async (req, res) => {
  try {
    // Get current user profile
    const currentProfile = await profileService.getUserProfile(req.user.userId);
    
    if (!currentProfile.avatar_url) {
      return res.status(404).json({
        success: false,
        message: 'No avatar found'
      });
    }

    // Extract file path from URL
    const avatarPath = currentProfile.avatar_url.split('/').pop();
    
    // Delete from storage
    await fileUploadService.deleteAvatar(avatarPath);
    
    // Update profile to remove avatar URL
    await profileService.updateUserAvatar(req.user.userId, null);

    res.json({
      success: true,
      message: 'Avatar deleted successfully'
    });
  } catch (error) {
    console.error('Delete avatar error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete avatar'
    });
  }
});

// Get user notifications
router.get('/notifications', authenticateToken, async (req, res) => {
  try {
    const notifications = await profileService.getUserNotifications(req.user.userId);
    
    res.json({
      success: true,
      notifications
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch notifications'
    });
  }
});

// Update user notifications
router.put('/notifications', authenticateToken, validateNotificationUpdate, async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const updatedNotifications = await profileService.updateUserNotifications(req.user.userId, req.body);
    
    res.json({
      success: true,
      message: 'Notification preferences updated successfully',
      notifications: updatedNotifications
    });
  } catch (error) {
    console.error('Update notifications error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update notification preferences'
    });
  }
});

// Get user settings
router.get('/settings', authenticateToken, async (req, res) => {
  try {
    const settings = await profileService.getUserSettings(req.user.userId);
    
    res.json({
      success: true,
      settings
    });
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch settings'
    });
  }
});

// Update user settings
router.put('/settings', authenticateToken, validateSettingsUpdate, async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const updatedSettings = await profileService.updateUserSettings(req.user.userId, req.body);
    
    res.json({
      success: true,
      message: 'Settings updated successfully',
      settings: updatedSettings
    });
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update settings'
    });
  }
});

// Export user data
router.get('/export', authenticateToken, async (req, res) => {
  try {
    const userData = await profileService.exportUserData(req.user.userId);
    
    res.json({
      success: true,
      data: userData
    });
  } catch (error) {
    console.error('Export user data error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to export user data'
    });
  }
});

// Delete user account
router.delete('/', authenticateToken, async (req, res) => {
  try {
    const { password } = req.body;
    
    if (!password) {
      return res.status(400).json({
        success: false,
        message: 'Password is required to delete account'
      });
    }

    // Verify password before deletion
    const userService = require('../../services/userService');
    const isPasswordValid = await userService.verifyPassword(req.user.userId, password);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid password'
      });
    }

    // Delete user account
    await profileService.deleteUserAccount(req.user.userId);
    
    res.json({
      success: true,
      message: 'Account deleted successfully'
    });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete account'
    });
  }
});

// Initialize avatar bucket (for setup)
router.post('/setup-avatar-bucket', authenticateToken, async (req, res) => {
  try {
    console.log('Setting up avatar bucket...');
    const success = await fileUploadService.createAvatarBucket();
    
    if (success) {
      res.json({
        success: true,
        message: 'Avatar bucket setup completed successfully'
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to setup avatar bucket. Check server logs for details.'
      });
    }
  } catch (error) {
    console.error('Setup avatar bucket error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to setup avatar bucket'
    });
  }
});

// Get avatar bucket status
router.get('/avatar-bucket-status', authenticateToken, async (req, res) => {
  try {
    const { data: buckets, error } = await supabase.storage.listBuckets();
    
    if (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to check bucket status',
        error: error.message
      });
    }

    const avatarBucket = buckets.find(bucket => bucket.name === 'avatars');
    
    res.json({
      success: true,
      bucketExists: !!avatarBucket,
      bucketDetails: avatarBucket || null,
      allBuckets: buckets.map(b => ({ name: b.name, public: b.public }))
    });
  } catch (error) {
    console.error('Get bucket status error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get bucket status'
    });
  }
});

// Debug endpoint to check current user profile
router.get('/debug-profile', authenticateToken, async (req, res) => {
  try {
    const profile = await profileService.getUserProfile(req.user.userId);
    
    res.json({
      success: true,
      userId: req.user.userId,
      profile: profile,
      hasAvatar: !!profile.avatar_url,
      avatarUrl: profile.avatar_url
    });
  } catch (error) {
    console.error('Debug profile error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get debug profile'
    });
  }
});

module.exports = router;
