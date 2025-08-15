const supabase = require('../config/database');

class AIStudioService {
  // Prompt Templates
  async getPromptTemplates(userId = null, category = null, isPublic = true) {
    try {
      // If no database connection, return mock data
      if (!supabase) {
        return this.getMockPromptTemplates(category);
      }

      let query = supabase
        .from('prompt_templates')
        .select('*')
        .eq('is_public', isPublic);

      if (userId) {
        query = query.or(`user_id.eq.${userId},is_public.eq.true`);
      }

      if (category) {
        query = query.eq('category', category);
      }

      const { data, error } = await query.order('usage_count', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching prompt templates:', error);
      // Fallback to mock data
      return this.getMockPromptTemplates(category);
    }
  }

  async createPromptTemplate(templateData) {
    try {
      const { data, error } = await supabase
        .from('prompt_templates')
        .insert([templateData])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating prompt template:', error);
      throw error;
    }
  }

  async updatePromptTemplate(id, updates) {
    try {
      const { data, error } = await supabase
        .from('prompt_templates')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating prompt template:', error);
      throw error;
    }
  }

  async incrementTemplateUsage(id) {
    try {
      const { error } = await supabase
        .from('prompt_templates')
        .update({ usage_count: supabase.raw('usage_count + 1') })
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error incrementing template usage:', error);
      throw error;
    }
  }

  // AI Avatars
  async getAvatars(activeOnly = true) {
    try {
      // If no database connection, return mock data
      if (!supabase) {
        return this.getMockAvatars();
      }

      let query = supabase.from('ai_avatars').select('*');
      
      if (activeOnly) {
        query = query.eq('is_active', true);
      }

      const { data, error } = await query.order('name');
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching avatars:', error);
      // Fallback to mock data
      return this.getMockAvatars();
    }
  }

  async createAvatar(avatarData) {
    try {
      const { data, error } = await supabase
        .from('ai_avatars')
        .insert([avatarData])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating avatar:', error);
      throw error;
    }
  }

  async updateAvatar(id, updates) {
    try {
      const { data, error } = await supabase
        .from('ai_avatars')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating avatar:', error);
      throw error;
    }
  }

  // AI Voices
  async getVoices(activeOnly = true) {
    try {
      // If no database connection, return mock data
      if (!supabase) {
        return this.getMockVoices();
      }

      let query = supabase.from('ai_voices').select('*');
      
      if (activeOnly) {
        query = query.eq('is_active', true);
      }

      const { data, error } = await query.order('name');
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching voices:', error);
      // Fallback to mock data
      return this.getMockVoices();
    }
  }

  async createVoice(voiceData) {
    try {
      const { data, error } = await supabase
        .from('ai_voices')
        .insert([voiceData])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating voice:', error);
      throw error;
    }
  }

  async updateVoice(id, updates) {
    try {
      const { data, error } = await supabase
        .from('ai_voices')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating voice:', error);
      throw error;
    }
  }

  // Video Generation
  async createVideoGenerationJob(jobData) {
    try {
      const { data, error } = await supabase
        .from('video_generation_jobs')
        .insert([jobData])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating video generation job:', error);
      throw error;
    }
  }

  async getVideoGenerationJob(id) {
    try {
      const { data, error } = await supabase
        .from('video_generation_jobs')
        .select(`
          *,
          campaign:campaigns(*),
          avatar:ai_avatars(*),
          voice:ai_voices(*),
          prompt_template:prompt_templates(*)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching video generation job:', error);
      throw error;
    }
  }

  async updateVideoGenerationJob(id, updates) {
    try {
      const { data, error } = await supabase
        .from('video_generation_jobs')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating video generation job:', error);
      throw error;
    }
  }

  async getUserVideoGenerationJobs(userId, status = null, limit = 20, offset = 0) {
    try {
      let query = supabase
        .from('video_generation_jobs')
        .select(`
          *,
          campaign:campaigns(name, type),
          avatar:ai_avatars(name),
          voice:ai_voices(name)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (status) {
        query = query.eq('status', status);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching user video generation jobs:', error);
      throw error;
    }
  }

  // Generated Videos
  async createGeneratedVideo(videoData) {
    try {
      const { data, error } = await supabase
        .from('generated_videos')
        .insert([videoData])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating generated video:', error);
      throw error;
    }
  }

  async getUserGeneratedVideos(userId, campaignId = null, limit = 20, offset = 0) {
    try {
      let query = supabase
        .from('generated_videos')
        .select(`
          *,
          campaign:campaigns(name, type),
          job:video_generation_jobs(job_type, status)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (campaignId) {
        query = query.eq('campaign_id', campaignId);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching user generated videos:', error);
      throw error;
    }
  }

  // Video Analytics
  async createVideoAnalytics(analyticsData) {
    try {
      const { data, error } = await supabase
        .from('video_analytics')
        .insert([analyticsData])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating video analytics:', error);
      throw error;
    }
  }

  async updateVideoAnalytics(videoId, date, updates) {
    try {
      const { data, error } = await supabase
        .from('video_analytics')
        .update(updates)
        .eq('video_id', videoId)
        .eq('date', date)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating video analytics:', error);
      throw error;
    }
  }

  async getVideoAnalytics(videoId, dateRange = null) {
    try {
      let query = supabase
        .from('video_analytics')
        .select('*')
        .eq('video_id', videoId)
        .order('date', { ascending: true });

      if (dateRange) {
        query = query.gte('date', dateRange.start).lte('date', dateRange.end);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching video analytics:', error);
      throw error;
    }
  }

  // Utility methods
  async generateScriptFromTemplate(templateId, customText = '') {
    try {
      const template = await this.getPromptTemplates(null, null, true);
      const selectedTemplate = template.find(t => t.id === templateId);
      
      if (!selectedTemplate) {
        throw new Error('Template not found');
      }

      // If custom text is provided, use it; otherwise use template text
      const script = customText || selectedTemplate.template_text;
      
      // Increment usage count
      await this.incrementTemplateUsage(templateId);
      
      return {
        script,
        template: selectedTemplate,
        estimatedDuration: Math.ceil(script.length / 150) // Rough estimate: 150 chars per second
      };
    } catch (error) {
      console.error('Error generating script from template:', error);
      throw error;
    }
  }

  async estimateVideoCost(jobType, duration, quality = 'standard') {
    // Cost estimation logic (this would be based on your actual pricing)
    const baseCosts = {
      'ai-generated': 0.15,
      'avatar-video': 0.25,
      'voiceover': 0.10
    };

    const qualityMultipliers = {
      'standard': 1.0,
      'hd': 1.5,
      '4k': 2.0
    };

    const baseCost = baseCosts[jobType] || 0.15;
    const qualityMultiplier = qualityMultipliers[quality] || 1.0;
    const durationMultiplier = Math.max(1, duration / 60); // Cost increases with duration

    return {
      baseCost: baseCost * qualityMultiplier * durationMultiplier,
      breakdown: {
        baseCost: baseCost,
        qualityMultiplier,
        durationMultiplier,
        total: baseCost * qualityMultiplier * durationMultiplier
      }
    };
  }

  // Mock data methods for when database is not available
  getMockPromptTemplates(category = null) {
    const mockTemplates = [
      {
        id: '1',
        name: 'Product Showcase',
        category: 'Demo',
        description: 'Highlight product features with compelling storytelling',
        template_text: 'Introduce the problem your product solves. Show the product in action. Highlight key benefits. End with a strong call to action.',
        is_favorite: true,
        is_shared: false,
        usage_count: 156,
        rating: 4.8
      },
      {
        id: '2',
        name: 'Customer Testimonial',
        category: 'Testimonial',
        description: 'Authentic customer story with emotional connection',
        template_text: 'Start with a relatable problem. Share the customer journey. Show the transformation. End with social proof and CTA.',
        is_favorite: false,
        is_shared: true,
        usage_count: 89,
        rating: 4.6
      },
      {
        id: '3',
        name: 'Pain-Agitate-Solve',
        category: 'Pain-Agitate-Solve',
        description: 'Identify problem, amplify pain, present solution',
        template_text: 'Identify the pain point. Amplify the consequences. Present your solution. Show the transformation. Call to action.',
        is_favorite: true,
        is_shared: true,
        usage_count: 234,
        rating: 4.9
      },
      {
        id: '4',
        name: 'Before & After',
        category: 'Comparison',
        description: 'Show transformation with clear before/after states',
        template_text: 'Show the before state. Introduce your solution. Demonstrate the process. Reveal the after results. Call to action.',
        is_favorite: false,
        is_shared: false,
        usage_count: 67,
        rating: 4.7
      },
      {
        id: '5',
        name: 'Urgency CTA',
        category: 'CTA',
        description: 'Create urgency with limited-time offers',
        template_text: 'Create urgency with time-sensitive offer. Highlight scarcity. Show value proposition. Strong call to action with deadline.',
        is_favorite: false,
        is_shared: false,
        usage_count: 45,
        rating: 4.5
      }
    ];

    if (category) {
      return mockTemplates.filter(t => t.category === category);
    }
    return mockTemplates;
  }

  getMockAvatars() {
    return [
      {
        id: '1',
        name: 'Sarah',
        gender: 'Female',
        ethnicity: 'Caucasian',
        style: 'Professional',
        thumbnail_url: '/api/placeholder/80/80',
        sample_clip_url: '/api/placeholder/video',
        is_active: true
      },
      {
        id: '2',
        name: 'Marcus',
        gender: 'Male',
        ethnicity: 'African American',
        style: 'Casual',
        thumbnail_url: '/api/placeholder/80/80',
        sample_clip_url: '/api/placeholder/video',
        is_active: true
      },
      {
        id: '3',
        name: 'Priya',
        gender: 'Female',
        ethnicity: 'South Asian',
        style: 'Friendly',
        thumbnail_url: '/api/placeholder/80/80',
        sample_clip_url: '/api/placeholder/video',
        is_active: true
      },
      {
        id: '4',
        name: 'Alex',
        gender: 'Male',
        ethnicity: 'Hispanic',
        style: 'Energetic',
        thumbnail_url: '/api/placeholder/80/80',
        sample_clip_url: '/api/placeholder/video',
        is_active: true
      }
    ];
  }

  getMockVoices() {
    return [
      {
        id: '1',
        name: 'US Male Neutral',
        gender: 'Male',
        accent: 'American',
        language: 'en',
        tone: 'Neutral',
        sample_audio_url: '/api/placeholder/audio',
        is_active: true
      },
      {
        id: '2',
        name: 'UK Female Warm',
        gender: 'Female',
        accent: 'British',
        language: 'en',
        tone: 'Warm',
        sample_audio_url: '/api/placeholder/audio',
        is_active: true
      },
      {
        id: '3',
        name: 'Energetic',
        gender: 'Male',
        accent: 'American',
        language: 'en',
        tone: 'Energetic',
        sample_audio_url: '/api/placeholder/audio',
        is_active: true
      },
      {
        id: '4',
        name: 'Calm',
        gender: 'Female',
        accent: 'American',
        language: 'en',
        tone: 'Calm',
        sample_audio_url: '/api/placeholder/audio',
        is_active: true
      }
    ];
  }
}

module.exports = new AIStudioService();
