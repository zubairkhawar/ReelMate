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
}

module.exports = new UserService();
