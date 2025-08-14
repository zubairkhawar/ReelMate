const supabase = require('../config/database');
const bcrypt = require('bcryptjs');

class UserService {
  async createUser(userData) {
    try {
      const { name, email, password, company } = userData;
      
      // Hash password
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      
      // Insert user into database
      const { data, error } = await supabase
        .from('users')
        .insert([
          {
            name,
            email,
            password: hashedPassword,
            company: company || '',
            subscription: 'starter',
            email_verified: false,
            created_at: new Date().toISOString()
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Error creating user:', error);
        throw new Error('Failed to create user');
      }

      // Remove password from response
      const { password: _, ...userResponse } = data;
      return userResponse;
    } catch (error) {
      console.error('UserService createUser error:', error);
      throw error;
    }
  }

  async findUserByEmail(email) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error finding user by email:', error);
        throw new Error('Failed to find user');
      }

      return data;
    } catch (error) {
      console.error('UserService findUserByEmail error:', error);
      throw error;
    }
  }

  async findUserById(id) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error finding user by ID:', error);
        throw new Error('Failed to find user');
      }

      return data;
    } catch (error) {
      console.error('UserService findUserById error:', error);
      throw error;
    }
  }

  async updateUserPassword(userId, newPassword) {
    try {
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
      
      const { data, error } = await supabase
        .from('users')
        .update({ 
          password: hashedPassword,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        console.error('Error updating user password:', error);
        throw new Error('Failed to update password');
      }

      return data;
    } catch (error) {
      console.error('UserService updateUserPassword error:', error);
      throw error;
    }
  }

  async createPasswordResetToken(email, token, expiresAt) {
    try {
      const { data, error } = await supabase
        .from('password_reset_tokens')
        .insert([
          {
            email,
            token,
            expires_at: expiresAt,
            created_at: new Date().toISOString()
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Error creating password reset token:', error);
        throw new Error('Failed to create reset token');
      }

      return data;
    } catch (error) {
      console.error('UserService createPasswordResetToken error:', error);
      throw error;
    }
  }

  async findPasswordResetToken(token) {
    try {
      const { data, error } = await supabase
        .from('password_reset_tokens')
        .select('*')
        .eq('token', token)
        .eq('used', false)
        .gte('expires_at', new Date().toISOString())
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error finding password reset token:', error);
        throw new Error('Failed to find reset token');
      }

      return data;
    } catch (error) {
      console.error('UserService findPasswordResetToken error:', error);
      throw error;
    }
  }

  async markPasswordResetTokenAsUsed(token) {
    try {
      const { data, error } = await supabase
        .from('password_reset_tokens')
        .update({ 
          used: true,
          updated_at: new Date().toISOString()
        })
        .eq('token', token)
        .select()
        .single();

      if (error) {
        console.error('Error marking password reset token as used:', error);
        throw new Error('Failed to mark token as used');
      }

      return data;
    } catch (error) {
      console.error('UserService markPasswordResetTokenAsUsed error:', error);
      throw error;
    }
  }

  async verifyPassword(userId, currentPassword) {
    try {
      const user = await this.findUserById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      const isValid = await bcrypt.compare(currentPassword, user.password);
      return isValid;
    } catch (error) {
      console.error('UserService verifyPassword error:', error);
      throw error;
    }
  }

  async createUserFromOAuth(oauthData) {
    try {
      const { email, name, oauthProvider, oauthId, avatarUrl, emailVerified } = oauthData;
      
      // Check if user already exists
      const existingUser = await this.findUserByEmail(email);
      if (existingUser) {
        // Update OAuth info if needed
        if (!existingUser.oauth_provider) {
          const { data, error } = await supabase
            .from('users')
            .update({
              oauth_provider: oauthProvider,
              oauth_id: oauthId,
              email_verified: emailVerified,
              updated_at: new Date().toISOString()
            })
            .eq('id', existingUser.id)
            .select()
            .single();
          
          if (error) throw error;
          return data;
        }
        return existingUser;
      }
      
      // Create new OAuth user
      const { data, error } = await supabase
        .from('users')
        .insert({
          email,
          name,
          oauth_provider: oauthProvider,
          oauth_id: oauthId,
          avatar_url: avatarUrl,
          email_verified: emailVerified,
          subscription: 'starter',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error creating OAuth user:', error);
        throw new Error('Failed to create user');
      }
      
      // Send welcome email
      try {
        const emailService = require('./emailService');
        await emailService.sendWelcomeEmail(email, name);
      } catch (emailError) {
        console.error('Failed to send welcome email:', emailError);
        // Don't fail user creation if email fails
      }
      
      return data;
    } catch (error) {
      console.error('UserService createUserFromOAuth error:', error);
      throw error;
    }
  }

  async updateLastLogin(userId) {
    try {
      const { error } = await supabase
        .from('users')
        .update({
          last_login: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);
      
      if (error) {
        console.error('Error updating last login:', error);
        throw new Error('Failed to update last login');
      }
      
      return true;
    } catch (error) {
      console.error('UserService updateLastLogin error:', error);
      throw error;
    }
  }

  async findUserByOAuthId(oauthProvider, oauthId) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('oauth_provider', oauthProvider)
        .eq('oauth_id', oauthId)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        console.error('Error finding user by OAuth ID:', error);
        throw new Error('Failed to find user');
      }
      
      return data;
    } catch (error) {
      console.error('UserService findUserByOAuthId error:', error);
      throw error;
    }
  }
}

module.exports = new UserService();
