# Video Generation Backend Implementation

## Overview

This document outlines the complete backend implementation for ReelMate's video generation platform. The backend provides APIs for creating campaigns, generating videos using AI, and managing the entire video creation workflow.

## Architecture

### Database Schema

The backend uses PostgreSQL with Supabase and includes the following key tables:

- **campaigns**: Stores campaign information and settings
- **ai_avatars**: Manages AI avatar options for video generation
- **ai_voices**: Manages text-to-speech voice options
- **prompt_templates**: Stores reusable script templates
- **video_generation_jobs**: Tracks video generation progress
- **generated_videos**: Stores completed video metadata
- **video_analytics**: Tracks video performance metrics

### Services

1. **AIStudioService**: Manages prompts, avatars, voices, and video generation jobs
2. **VideoGenerationService**: Handles the core video generation logic
3. **CampaignService**: Manages campaign creation and management

## API Endpoints

### Campaigns API

- `POST /api/campaigns` - Create a new campaign
- `GET /api/campaigns` - Get all campaigns with filters
- `PUT /api/campaigns/:id` - Update a campaign
- `DELETE /api/campaigns/:id` - Delete a campaign

### AI Studio API

- `GET /api/ai-studio/prompt-templates` - Get prompt templates
- `POST /api/ai-studio/prompt-templates` - Create new template
- `GET /api/ai-studio/avatars` - Get AI avatars
- `GET /api/ai-studio/voices` - Get AI voices
- `POST /api/ai-studio/generate-video` - Start video generation
- `GET /api/ai-studio/generation-status/:jobId` - Check generation status
- `GET /api/ai-studio/generation-jobs` - Get user's generation jobs
- `GET /api/ai-studio/generated-videos` - Get completed videos

## Video Generation Workflow

### 1. Campaign Creation
1. User fills out campaign form
2. Backend validates data and creates campaign record
3. Campaign is stored with status 'draft'

### 2. Video Generation
1. User writes script or selects template
2. User chooses avatar and voice
3. Backend creates video generation job
4. Job is processed asynchronously
5. TTS audio is generated using OpenAI
6. Avatar video is generated (placeholder for now)
7. Job status is updated to 'completed'

### 3. Video Management
1. Generated videos are stored with metadata
2. Analytics are tracked for performance
3. Videos can be downloaded and shared

## Setup Instructions

### 1. Environment Variables

Create a `.env` file in the backend directory:

```bash
# Database Configuration
DATABASE_URL=your_supabase_database_url_here
SUPABASE_URL=your_supabase_url_here
SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here

# JWT Configuration
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d

# Session Configuration
SESSION_SECRET=your_session_secret_here

# Server Configuration
PORT=5001
NODE_ENV=development

# Frontend URL
FRONTEND_URL=http://localhost:3000

# File Storage (Supabase Storage)
STORAGE_BUCKET_NAME=reelmate-storage
```

### 2. Database Setup

1. Run the SQL schema in `database/schema.sql`
2. Set up Supabase Storage buckets for audio and video files
3. Configure storage policies for secure access

### 3. Dependencies

Install required packages:

```bash
npm install
```

### 4. Start the Server

```bash
npm run dev
```

## Integration Points

### Frontend Integration

The frontend integrates with the backend through:

1. **Campaign Creation**: Form submission to `/api/campaigns`
2. **AI Studio**: API calls to fetch templates, avatars, and voices
3. **Video Generation**: Job creation and status monitoring
4. **Real-time Updates**: Polling for generation status

### AI Service Integration

Currently integrated:
- **OpenAI TTS**: For text-to-speech generation
- **Supabase Storage**: For file storage and management

Future integrations:
- **RunwayML/Pika Labs**: For AI video generation
- **ElevenLabs**: For advanced voice cloning
- **Stable Diffusion**: For image generation

## Security Features

1. **JWT Authentication**: Secure API access
2. **User Isolation**: Users can only access their own data
3. **Rate Limiting**: Prevents API abuse
4. **Input Validation**: Sanitizes all user inputs
5. **File Upload Security**: Secure file storage with access controls

## Performance Considerations

1. **Asynchronous Processing**: Video generation runs in background
2. **Database Indexing**: Optimized queries with proper indexes
3. **File Compression**: Efficient storage and delivery
4. **Caching**: Template and metadata caching
5. **Queue Management**: Job queuing for high load

## Monitoring and Analytics

1. **Job Status Tracking**: Real-time generation progress
2. **Performance Metrics**: Generation time, success rates
3. **Error Logging**: Comprehensive error tracking
4. **Usage Analytics**: User behavior and feature usage

## Future Enhancements

1. **Real-time Notifications**: WebSocket updates for job status
2. **Batch Processing**: Multiple video generation
3. **Advanced AI Models**: More sophisticated video generation
4. **Cloud Rendering**: Distributed video processing
5. **API Rate Limiting**: Per-user usage limits
6. **Webhook Support**: External service integration

## Troubleshooting

### Common Issues

1. **Database Connection**: Check Supabase credentials
2. **OpenAI API**: Verify API key and quota
3. **File Storage**: Ensure storage bucket exists
4. **Authentication**: Check JWT token validity

### Debug Mode

Enable debug logging:

```bash
NODE_ENV=development DEBUG=* npm run dev
```

## Support

For technical support or questions about the implementation, please refer to the main project documentation or contact the development team.
