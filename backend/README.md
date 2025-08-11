# ReelMate Backend

A robust Node.js backend API for ReelMate - an AI-powered UGC video generation platform for e-commerce brands.

## Features

- 🔐 **Authentication**: JWT-based user authentication and authorization
- 🛍️ **Shopify Integration**: Connect and sync products from Shopify stores
- 🎬 **UGC Generation**: Create and manage AI-generated video campaigns
- 📊 **Analytics**: Comprehensive campaign performance tracking
- 🚀 **RESTful API**: Clean, well-documented API endpoints
- 🛡️ **Security**: Rate limiting, CORS, helmet security headers
- 📈 **Scalable**: Modular architecture ready for production

## Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Authentication**: JWT + bcryptjs
- **Validation**: express-validator
- **Security**: helmet, cors, rate-limiting
- **Database**: Supabase (PostgreSQL) - ready for integration
- **AI Integration**: OpenAI API integration ready
- **Social Media**: TikTok, Facebook, Instagram APIs ready

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account (for production)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create environment file:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. Run the development server:
```bash
npm run dev
```

4. The API will be available at `http://localhost:5001`

### Environment Variables

Create a `.env` file with the following variables:

```env
# Server Configuration
PORT=5001
NODE_ENV=development

# Frontend URL for CORS
FRONTEND_URL=http://localhost:3000

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# Database Configuration (Supabase)
SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-supabase-anon-key

# AI Service Configuration
OPENAI_API_KEY=your-openai-api-key

# Shopify Configuration
SHOPIFY_API_KEY=your-shopify-api-key
SHOPIFY_API_SECRET=your-shopify-api-secret
```

## API Endpoints

### Authentication

- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User authentication
- `GET /api/auth/me` - Get current user profile
- `POST /api/auth/refresh` - Refresh JWT token
- `POST /api/auth/logout` - User logout

### Shopify Integration

- `POST /api/shopify/connect` - Connect Shopify store
- `GET /api/shopify/connections` - Get connected stores
- `POST /api/shopify/sync-products` - Sync products from store
- `GET /api/shopify/products` - Get synced products
- `GET /api/shopify/products/:id` - Get specific product
- `DELETE /api/shopify/connections/:id` - Disconnect store

### UGC Video Generation

- `POST /api/ugc/campaigns` - Create new campaign
- `GET /api/ugc/campaigns` - Get all campaigns
- `GET /api/ugc/campaigns/:id` - Get specific campaign
- `POST /api/ugc/generate` - Generate new video
- `GET /api/ugc/videos` - Get all videos
- `GET /api/ugc/videos/:id` - Get specific video
- `POST /api/ugc/videos/:id/publish` - Publish to social platforms

### Analytics

- `GET /api/analytics/overview` - Dashboard overview
- `GET /api/analytics/trends` - Performance trends over time
- `GET /api/analytics/campaigns` - Campaign performance details
- `GET /api/analytics/platforms` - Platform performance details
- `GET /api/analytics/export` - Export analytics data

## Project Structure

```
src/
├── server.js              # Main server file
├── routes/                # API route handlers
│   ├── auth/             # Authentication routes
│   │   └── auth.js       # Auth route handlers
│   ├── shopify/          # Shopify integration routes
│   │   └── shopify.js    # Shopify route handlers
│   ├── ugc/              # UGC video generation routes
│   │   └── ugc.js        # UGC route handlers
│   └── analytics/        # Analytics and reporting routes
│       └── analytics.js  # Analytics route handlers
├── controllers/           # Business logic controllers
├── middleware/            # Custom middleware functions
├── services/             # External service integrations
├── utils/                # Utility functions
└── config/               # Configuration files
```

## Development

### Running Tests

```bash
npm test
```

### Code Quality

The project uses ESLint for code quality. Run:

```bash
npm run lint
```

### Building for Production

```bash
npm run build
npm start
```

## API Documentation

### Authentication Flow

1. **Signup**: `POST /api/auth/signup`
   ```json
   {
     "email": "user@example.com",
     "password": "securepassword",
     "name": "John Doe",
     "company": "Example Corp"
   }
   ```

2. **Login**: `POST /api/auth/login`
   ```json
   {
     "email": "user@example.com",
     "password": "securepassword"
   }
   ```

3. **Use Token**: Include in Authorization header
   ```
   Authorization: Bearer <jwt-token>
   ```

### Shopify Integration Flow

1. **Connect Store**: `POST /api/shopify/connect`
   ```json
   {
     "shopDomain": "https://mystore.myshopify.com",
     "accessToken": "shpat_..."
   }
   ```

2. **Sync Products**: `POST /api/shopify/sync-products`
   ```json
   {
     "shopDomain": "https://mystore.myshopify.com"
   }
   ```

### UGC Video Generation Flow

1. **Create Campaign**: `POST /api/ugc/campaigns`
   ```json
   {
     "productId": "prod_123",
     "campaignName": "Summer Sale Campaign",
     "targetPlatforms": ["tiktok", "instagram"],
     "videoLength": "30"
   }
   ```

2. **Generate Video**: `POST /api/ugc/generate`
   ```json
   {
     "campaignId": "camp_123",
     "avatarStyle": "friendly",
     "voiceStyle": "female",
     "scriptTone": "conversational"
   }
   ```

3. **Publish Video**: `POST /api/ugc/videos/:id/publish`
   ```json
   {
     "platforms": ["tiktok", "instagram"]
   }
   ```

## Security Features

- **Rate Limiting**: 100 requests per 15 minutes per IP
- **CORS Protection**: Configurable origin restrictions
- **Helmet Security**: Security headers and CSP
- **Input Validation**: Request validation with express-validator
- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs for secure password storage

## Performance Features

- **Compression**: gzip compression for responses
- **Logging**: Morgan HTTP request logging
- **Error Handling**: Global error handler with proper status codes
- **Response Caching**: Ready for Redis integration

## Production Deployment

### Environment Setup

1. Set `NODE_ENV=production`
2. Configure production database (Supabase)
3. Set secure JWT secret
4. Configure CORS for production domain
5. Set up SSL/TLS certificates

### Scaling Considerations

- **Database**: Use Supabase production instance
- **Caching**: Integrate Redis for session and data caching
- **Load Balancing**: Use multiple server instances
- **Monitoring**: Integrate with monitoring services
- **Backup**: Regular database backups

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is part of the ReelMate platform.

## Support

For support and questions, please contact the development team.
