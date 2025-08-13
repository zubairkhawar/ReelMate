const supabase = require('../config/database');
const path = require('path');
const crypto = require('crypto');

class FileUploadService {
  constructor() {
    this.bucketName = 'avatars';
    this.maxFileSize = 5 * 1024 * 1024; // 5MB
    this.allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  }

  async uploadAvatar(file, userId) {
    try {
      // Validate file
      if (!file) {
        throw new Error('No file provided');
      }

      // Check file size
      if (file.size > this.maxFileSize) {
        throw new Error('File size too large. Maximum size is 5MB');
      }

      // Check file type
      if (!this.allowedImageTypes.includes(file.mimetype)) {
        throw new Error('Invalid file type. Only JPEG, PNG, and WebP images are allowed');
      }

      // Ensure bucket exists before uploading
      console.log('🔄 FileUploadService: Ensuring avatar bucket exists...');
      await this.createAvatarBucket();
      console.log('✅ Bucket check completed');

      // Generate unique filename
      const fileExtension = path.extname(file.originalname);
      const fileName = `${userId}_${crypto.randomBytes(16).toString('hex')}${fileExtension}`;
      const filePath = `${userId}/${fileName}`;
      
      console.log('📁 Generated file path:', filePath);
      console.log('📁 File name:', fileName);

      // Upload to Supabase Storage
      console.log('📤 Starting upload to Supabase storage...');
      const { data, error } = await supabase.storage
        .from(this.bucketName)
        .upload(filePath, file.buffer, {
          contentType: file.mimetype,
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('❌ Error uploading avatar to Supabase:', error);
        throw new Error('Failed to upload avatar');
      }

      console.log('✅ File uploaded successfully to Supabase');

      // Get public URL
      console.log('🔗 Generating public URL...');
      const { data: urlData } = supabase.storage
        .from(this.bucketName)
        .getPublicUrl(filePath);
      
      console.log('🔗 Generated URL data:', urlData);
      console.log('🔗 Public URL:', urlData.publicUrl);

      const result = {
        url: urlData.publicUrl,
        path: filePath,
        fileName: fileName
      };
      
      console.log('📤 Returning upload result:', result);
      return result;
    } catch (error) {
      console.error('FileUploadService uploadAvatar error:', error);
      throw error;
    }
  }

  async deleteAvatar(filePath) {
    try {
      if (!filePath) {
        return true;
      }

      const { error } = await supabase.storage
        .from(this.bucketName)
        .remove([filePath]);

      if (error) {
        console.error('Error deleting avatar from Supabase:', error);
        // Don't throw error for deletion failures
        return false;
      }

      return true;
    } catch (error) {
      console.error('FileUploadService deleteAvatar error:', error);
      return false;
    }
  }

  async updateAvatar(userId, newFile, oldFilePath = null) {
    try {
      // Upload new avatar
      const uploadResult = await this.uploadAvatar(newFile, userId);

      // Delete old avatar if it exists
      if (oldFilePath) {
        await this.deleteAvatar(oldFilePath);
      }

      return uploadResult;
    } catch (error) {
      console.error('FileUploadService updateAvatar error:', error);
      throw error;
    }
  }

  async validateImageFile(file) {
    const errors = [];

    if (!file) {
      errors.push('No file provided');
      return { isValid: false, errors };
    }

    if (file.size > this.maxFileSize) {
      errors.push(`File size too large. Maximum size is ${this.maxFileSize / (1024 * 1024)}MB`);
    }

    if (!this.allowedImageTypes.includes(file.mimetype)) {
      errors.push(`Invalid file type. Allowed types: ${this.allowedImageTypes.join(', ')}`);
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  async createAvatarBucket() {
    try {
      // Check if bucket exists
      const { data: buckets, error: listError } = await supabase.storage.listBuckets();
      
      if (listError) {
        console.error('Error listing buckets:', listError);
        return false;
      }

      const bucketExists = buckets.some(bucket => bucket.name === this.bucketName);
      
      if (!bucketExists) {
        console.log('Avatar bucket does not exist. Please create it manually in Supabase dashboard.');
        console.log('Or run: npm run setup-avatar');
        return false;
      } else {
        console.log('Avatar bucket already exists');
      }

      return true;
    } catch (error) {
      console.error('FileUploadService createAvatarBucket error:', error);
      return false;
    }
  }

  async getAvatarUrl(filePath) {
    try {
      if (!filePath) {
        return null;
      }

      const { data } = supabase.storage
        .from(this.bucketName)
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('FileUploadService getAvatarUrl error:', error);
      return null;
    }
  }
}

module.exports = new FileUploadService();
