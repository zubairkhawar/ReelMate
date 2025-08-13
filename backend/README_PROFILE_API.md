# Profile API Documentation

Complete backend implementation for user profile management, avatar uploads, and notification preferences.

## 🚀 **Profile API Endpoints**

### **Base URL**: `/api/profile`

All endpoints require authentication via JWT token in the Authorization header:
```
Authorization: Bearer <jwt-token>
```

---

## 👤 **Profile Management**

### **Get User Profile**
```http
GET /api/profile
```

**Response:**
```json
{
  "success": true,
  "profile": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "company": "Tech Corp",
    "phone": "+1 (555) 123-4567",
    "timezone": "UTC-5",
    "avatar_url": "https://...",
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
  }
}
```

### **Update User Profile**
```http
PUT /api/profile
```

**Request Body:**
```json
{
  "name": "John Smith",
  "email": "john.smith@example.com",
  "company": "New Tech Corp",
  "phone": "+1 (555) 987-6543",
  "timezone": "UTC-8"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "profile": {
    "id": "uuid",
    "name": "John Smith",
    "email": "john.smith@example.com",
    "company": "New Tech Corp",
    "phone": "+1 (555) 987-6543",
    "timezone": "UTC-8",
    "avatar_url": "https://...",
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T11:45:00Z"
  }
}
```

---

## 🖼️ **Avatar Management**

### **Upload Avatar**
```http
POST /api/profile/avatar
Content-Type: multipart/form-data
```

**Form Data:**
- `avatar`: Image file (JPEG, PNG, WebP, max 5MB)

**Response:**
```json
{
  "success": true,
  "message": "Avatar uploaded successfully",
  "avatar": {
    "url": "https://yrbysvqmfkbqczlklqdi.supabase.co/storage/v1/object/public/avatars/user_id/filename.jpg",
    "path": "user_id/filename.jpg"
  }
}
```

### **Delete Avatar**
```http
DELETE /api/profile/avatar
```

**Response:**
```json
{
  "success": true,
  "message": "Avatar deleted successfully"
}
```

---

## 🔔 **Notification Preferences**

### **Get Notification Preferences**
```http
GET /api/profile/notifications
```

**Response:**
```json
{
  "success": true,
  "notifications": {
    "email_notifications": true,
    "push_notifications": true,
    "sms_notifications": false,
    "marketing_emails": false,
    "security_alerts": true
  }
}
```

### **Update Notification Preferences**
```http
PUT /api/profile/notifications
```

**Request Body:**
```json
{
  "email_notifications": true,
  "push_notifications": false,
  "sms_notifications": true,
  "marketing_emails": false,
  "security_alerts": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "Notification preferences updated successfully",
  "notifications": {
    "email_notifications": true,
    "push_notifications": false,
    "sms_notifications": true,
    "marketing_emails": false,
    "security_alerts": true
  }
}
```

---

## ⚙️ **User Settings**

### **Get User Settings**
```http
GET /api/profile/settings
```

**Response:**
```json
{
  "success": true,
  "settings": {
    "theme": "light",
    "language": "en",
    "timezone": "UTC-5",
    "date_format": "MM/DD/YYYY",
    "time_format": "12h"
  }
}
```

### **Update User Settings**
```http
PUT /api/profile/settings
```

**Request Body:**
```json
{
  "theme": "dark",
  "language": "es",
  "timezone": "UTC+1",
  "date_format": "DD/MM/YYYY",
  "time_format": "24h"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Settings updated successfully",
  "settings": {
    "theme": "dark",
    "language": "es",
    "timezone": "UTC+1",
    "date_format": "DD/MM/YYYY",
    "time_format": "24h"
  }
}
```

---

## 📊 **Data Management**

### **Export User Data**
```http
GET /api/profile/export
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": { ... },
    "notifications": { ... },
    "settings": { ... },
    "integrations": [ ... ],
    "exported_at": "2024-01-15T12:00:00Z"
  }
}
```

### **Delete User Account**
```http
DELETE /api/profile
```

**Request Body:**
```json
{
  "password": "current-password"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Account deleted successfully"
}
```

---

## 🛠️ **Setup & Configuration**

### **Initialize Avatar Bucket**
```http
POST /api/profile/setup-avatar-bucket
```

**Response:**
```json
{
  "success": true,
  "message": "Avatar bucket setup completed"
}
```

---

## 🔐 **Security Features**

- **JWT Authentication**: All endpoints require valid JWT token
- **File Validation**: Image files are validated for type and size
- **Password Verification**: Account deletion requires current password
- **Input Validation**: Comprehensive request validation using express-validator
- **File Size Limits**: Maximum 5MB for avatar uploads
- **Supported Formats**: JPEG, PNG, WebP images only

---

## 📁 **File Storage**

- **Supabase Storage**: Uses Supabase Storage for avatar files
- **Bucket**: `avatars` bucket for user profile pictures
- **File Structure**: `user_id/filename.ext`
- **Public Access**: Avatar URLs are publicly accessible
- **Automatic Cleanup**: Old avatars are deleted when new ones are uploaded

---

## 🚨 **Error Handling**

All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "errors": [] // Validation errors if applicable
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (invalid/missing token)
- `404` - Not Found
- `409` - Conflict (email already taken)
- `500` - Internal Server Error

---

## 📝 **Validation Rules**

### **Profile Updates**
- `name`: Minimum 2 characters
- `email`: Valid email format, unique across users
- `company`: Optional, trimmed
- `phone`: Optional, trimmed
- `timezone`: Optional, trimmed

### **Notification Updates**
- All fields must be boolean values

### **Settings Updates**
- `theme`: Must be 'light', 'dark', or 'auto'
- `language`: Must be 'en', 'es', 'fr', or 'de'
- `time_format`: Must be '12h' or '24h'

---

## 🔄 **Database Schema Updates**

The profile system uses these database tables:
- `users` - User profile information
- `user_notifications` - Notification preferences
- `user_settings` - User settings and preferences
- `user_integrations` - Third-party integrations

---

## 🚀 **Frontend Integration**

### **Example Usage with Fetch API**

```javascript
// Get user profile
const getProfile = async () => {
  const response = await fetch('/api/profile', {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
  const data = await response.json();
  return data.profile;
};

// Update profile
const updateProfile = async (profileData) => {
  const response = await fetch('/api/profile', {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(profileData)
  });
  return await response.json();
};

// Upload avatar
const uploadAvatar = async (file) => {
  const formData = new FormData();
  formData.append('avatar', file);
  
  const response = await fetch('/api/profile/avatar', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: formData
  });
  return await response.json();
};
```

---

## 📋 **Setup Requirements**

1. **Environment Variables**: Ensure Supabase credentials are configured
2. **Database Schema**: Run the updated schema.sql in Supabase
3. **Storage Bucket**: Avatar bucket will be created automatically
4. **Dependencies**: Ensure multer is installed for file uploads

---

## 🔮 **Future Enhancements**

- [ ] Image compression and optimization
- [ ] Multiple avatar sizes (thumbnail, medium, large)
- [ ] Avatar cropping and editing tools
- [ ] Push notification service integration
- [ ] Email notification templates
- [ ] Two-factor authentication
- [ ] Social media profile linking
- [ ] Profile verification badges
