const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

class YouTubeService {
  constructor() {
    this.youtube = null;
    this.oauth2Client = null;
    this.initializeYouTube();
  }

  initializeYouTube() {
    try {
      // Initialize OAuth2 client
      this.oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5001/api/auth/google/callback'
      );

      // Initialize YouTube API
      this.youtube = google.youtube({
        version: 'v3',
        auth: this.oauth2Client
      });

      console.log('✅ YouTube service initialized');
    } catch (error) {
      console.error('❌ Failed to initialize YouTube service:', error);
    }
  }

  // Get OAuth2 authorization URL
  getAuthUrl() {
    const scopes = [
      'https://www.googleapis.com/auth/youtube.upload',
      'https://www.googleapis.com/auth/youtube',
      'https://www.googleapis.com/auth/youtube.force-ssl'
    ];

    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      prompt: 'consent'
    });
  }

  // Exchange authorization code for tokens
  async getTokensFromCode(code) {
    try {
      const { tokens } = await this.oauth2Client.getToken(code);
      this.oauth2Client.setCredentials(tokens);
      return tokens;
    } catch (error) {
      console.error('Error getting tokens:', error);
      throw error;
    }
  }

  // Set access token
  setAccessToken(accessToken) {
    this.oauth2Client.setCredentials({
      access_token: accessToken
    });
  }

  // Upload video to YouTube
  async uploadVideo(videoPath, videoData) {
    try {
      const {
        title,
        description,
        tags = [],
        categoryId = '22', // People & Blogs
        privacyStatus = 'private', // private, unlisted, public
        language = 'en',
        location = null
      } = videoData;

      // Prepare video metadata
      const videoMetadata = {
        snippet: {
          title,
          description,
          tags,
          categoryId,
          defaultLanguage: language,
          defaultAudioLanguage: language
        },
        status: {
          privacyStatus,
          selfDeclaredMadeForKids: false
        }
      };

      // Add location if provided
      if (location) {
        videoMetadata.snippet.location = location;
      }

      // Upload video
      const response = await this.youtube.videos.insert({
        part: ['snippet', 'status'],
        requestBody: videoMetadata,
        media: {
          body: fs.createReadStream(videoPath)
        }
      });

      console.log('✅ Video uploaded successfully:', response.data.id);
      return {
        success: true,
        videoId: response.data.id,
        title: response.data.snippet.title,
        url: `https://www.youtube.com/watch?v=${response.data.id}`,
        thumbnail: response.data.snippet.thumbnails?.default?.url
      };

    } catch (error) {
      console.error('❌ Error uploading video to YouTube:', error);
      throw error;
    }
  }

  // Get channel information
  async getChannelInfo() {
    try {
      const response = await this.youtube.channels.list({
        part: ['snippet', 'statistics', 'contentDetails'],
        id: 'UCygQXyAhqLlxZK70gcyydQw' // Your new channel ID
      });

      if (response.data.items && response.data.items.length > 0) {
        const channel = response.data.items[0];
        return {
          id: channel.id,
          title: channel.snippet.title,
          description: channel.snippet.description,
          subscriberCount: channel.statistics.subscriberCount,
          videoCount: channel.statistics.videoCount,
          viewCount: channel.statistics.viewCount,
          customUrl: channel.snippet.customUrl,
          thumbnail: channel.snippet.thumbnails?.default?.url
        };
      }

      return null;
    } catch (error) {
      console.error('❌ Error getting channel info:', error);
      throw error;
    }
  }

  // Get upload playlist
  async getUploadPlaylist() {
    try {
      // Use your specific channel ID directly
      const response = await this.youtube.channels.list({
        part: ['contentDetails'],
        id: 'UCygQXyAhqLlxZK70gcyydQw'
      });

      if (response.data.items && response.data.items.length > 0) {
        return response.data.items[0].contentDetails.relatedPlaylists.uploads;
      }

      return null;
    } catch (error) {
      console.error('❌ Error getting upload playlist:', error);
      throw error;
    }
  }

  // Get recent uploads
  async getRecentUploads(maxResults = 10) {
    try {
      const uploadPlaylist = await this.getUploadPlaylist();
      if (!uploadPlaylist) return [];

      const response = await this.youtube.playlistItems.list({
        part: ['snippet', 'contentDetails'],
        playlistId: uploadPlaylist,
        maxResults
      });

      return response.data.items.map(item => ({
        videoId: item.contentDetails.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails?.default?.url,
        publishedAt: item.snippet.publishedAt,
        channelTitle: item.snippet.channelTitle
      }));

    } catch (error) {
      console.error('❌ Error getting recent uploads:', error);
      throw error;
    }
  }

  // Update video metadata
  async updateVideo(videoId, updateData) {
    try {
      const {
        title,
        description,
        tags,
        categoryId,
        privacyStatus,
        language
      } = updateData;

      const videoMetadata = {
        id: videoId,
        snippet: {
          title,
          description,
          tags,
          categoryId,
          defaultLanguage: language
        },
        status: {
          privacyStatus
        }
      };

      const response = await this.youtube.videos.update({
        part: ['snippet', 'status'],
        requestBody: videoMetadata
      });

      console.log('✅ Video updated successfully:', videoId);
      return {
        success: true,
        videoId: response.data.id,
        title: response.data.snippet.title
      };

    } catch (error) {
      console.error('❌ Error updating video:', error);
      throw error;
    }
  }

  // Delete video
  async deleteVideo(videoId) {
    try {
      await this.youtube.videos.delete({
        id: videoId
      });

      console.log('✅ Video deleted successfully:', videoId);
      return { success: true, videoId };

    } catch (error) {
      console.error('❌ Error deleting video:', error);
      throw error;
    }
  }

  // Get video analytics
  async getVideoAnalytics(videoId) {
    try {
      const response = await this.youtube.videos.list({
        part: ['statistics', 'snippet'],
        id: videoId
      });

      if (response.data.items && response.data.items.length > 0) {
        const video = response.data.items[0];
        return {
          videoId,
          title: video.snippet.title,
          viewCount: parseInt(video.statistics.viewCount) || 0,
          likeCount: parseInt(video.statistics.likeCount) || 0,
          commentCount: parseInt(video.statistics.commentCount) || 0,
          publishedAt: video.snippet.publishedAt
        };
      }

      return null;
    } catch (error) {
      console.error('❌ Error getting video analytics:', error);
      throw error;
    }
  }
}

module.exports = new YouTubeService();
