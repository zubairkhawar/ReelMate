const supabase = require('../config/database');
const bcrypt = require('bcryptjs');

class ProfileService {
  async getUserProfile(userId) {
    try {
      const { data: user, error } = await supabase
        .from('users')
        .select(`
          id,
          name,
          email,
          company,
          phone,
          timezone,
          avatar_url,
          created_at,
          updated_at
        `)
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        throw new Error('Failed to fetch user profile');
      }

      return user;
    } catch (error) {
      console.error('ProfileService getUserProfile error:', error);
      throw error;
    }
  }

  async updateUserProfile(userId, profileData) {
    try {
      const updateData = {
        name: profileData.name,
        company: profileData.company,
        phone: profileData.phone,
        timezone: profileData.timezone,
        updated_at: new Date().toISOString()
      };

      // Only update email if provided and different
      if (profileData.email) {
        // Check if email is already taken by another user
        const { data: existingUser, error: checkError } = await supabase
          .from('users')
          .select('id')
          .eq('email', profileData.email)
          .neq('id', userId)
          .single();

        if (existingUser) {
          throw new Error('Email is already taken by another user');
        }

        updateData.email = profileData.email;
      }

      const { data, error } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', userId)
        .select(`
          id,
          name,
          email,
          company,
          phone,
          timezone,
          avatar_url,
          created_at,
          updated_at
        `)
        .single();

      if (error) {
        console.error('Error updating user profile:', error);
        throw new Error('Failed to update user profile');
      }

      return data;
    } catch (error) {
      console.error('ProfileService updateUserProfile error:', error);
      throw error;
    }
  }

  async updateUserAvatar(userId, avatarUrl) {
    try {
      console.log('🔄 ProfileService: Updating avatar for user:', userId);
      console.log('🖼️ New avatar URL:', avatarUrl);
      
      const { data, error } = await supabase
        .from('users')
        .update({ 
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select('avatar_url')
        .single();

      if (error) {
        console.error('❌ Error updating user avatar:', error);
        throw new Error('Failed to update user avatar');
      }

      console.log('✅ Avatar updated successfully in database:', data.avatar_url);
      return data.avatar_url;
    } catch (error) {
      console.error('❌ ProfileService updateUserAvatar error:', error);
      throw error;
    }
  }

  async getUserNotifications(userId) {
    try {
      const { data, error } = await supabase
        .from('user_notifications')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching user notifications:', error);
        throw new Error('Failed to fetch user notifications');
      }

      // Return default notifications if none exist
      if (!data) {
        return {
          email_notifications: true,
          push_notifications: true,
          sms_notifications: false,
          marketing_emails: false,
          security_alerts: true
        };
      }

      return data;
    } catch (error) {
      console.error('ProfileService getUserNotifications error:', error);
      throw error;
    }
  }

  async updateUserNotifications(userId, notificationSettings) {
    try {
      const { data, error } = await supabase
        .from('user_notifications')
        .upsert({
          user_id: userId,
          email_notifications: notificationSettings.email_notifications,
          push_notifications: notificationSettings.push_notifications,
          sms_notifications: notificationSettings.sms_notifications,
          marketing_emails: notificationSettings.marketing_emails,
          security_alerts: notificationSettings.security_alerts,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        console.error('Error updating user notifications:', error);
        throw new Error('Failed to update user notifications');
      }

      return data;
    } catch (error) {
      console.error('ProfileService updateUserNotifications error:', error);
      throw error;
    }
  }

  async getUserSettings(userId) {
    try {
      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching user settings:', error);
        throw new Error('Failed to fetch user settings');
      }

      // Return default settings if none exist
      if (!data) {
        return {
          theme: 'light',
          language: 'en',
          timezone: 'UTC',
          date_format: 'MM/DD/YYYY',
          time_format: '12h'
        };
      }

      return data;
    } catch (error) {
      console.error('ProfileService getUserSettings error:', error);
      throw error;
    }
  }

  async updateUserSettings(userId, settings) {
    try {
      const { data, error } = await supabase
        .from('user_settings')
        .upsert({
          user_id: userId,
          theme: settings.theme,
          language: settings.language,
          timezone: settings.timezone,
          date_format: settings.date_format,
          time_format: settings.time_format,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        console.error('Error updating user settings:', error);
        throw new Error('Failed to update user settings');
      }

      return data;
    } catch (error) {
      console.error('ProfileService updateUserSettings error:', error);
      throw error;
    }
  }

  async deleteUserAccount(userId) {
    try {
      // Delete user and all related data (cascade will handle related tables)
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId);

      if (error) {
        console.error('Error deleting user account:', error);
        throw new Error('Failed to delete user account');
      }

      return true;
    } catch (error) {
      console.error('ProfileService deleteUserAccount error:', error);
      throw error;
    }
  }

  async exportUserData(userId) {
    try {
      // Get all user data from various tables
      const [user, notifications, settings, integrations] = await Promise.all([
        this.getUserProfile(userId),
        this.getUserNotifications(userId),
        this.getUserSettings(userId),
        this.getUserIntegrations(userId)
      ]);

      return {
        user,
        notifications,
        settings,
        integrations,
        exported_at: new Date().toISOString()
      };
    } catch (error) {
      console.error('ProfileService exportUserData error:', error);
      throw error;
    }
  }

  async getUserIntegrations(userId) {
    try {
      const { data, error } = await supabase
        .from('user_integrations')
        .select('*')
        .eq('user_id', userId);

      if (error) {
        console.error('Error fetching user integrations:', error);
        throw new Error('Failed to fetch user integrations');
      }

      return data || [];
    } catch (error) {
      console.error('ProfileService getUserIntegrations error:', error);
      throw error;
    }
  }
}

module.exports = new ProfileService();
