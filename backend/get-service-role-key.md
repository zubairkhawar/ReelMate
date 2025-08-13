# 🔑 Getting Your Supabase Service Role Key

## Why You Need This

The **Service Role Key** is required to create storage buckets and set up storage policies. It has admin privileges that the anon key doesn't have.

## 📍 Step-by-Step Instructions

### 1. Go to Your Supabase Dashboard
- Visit [https://supabase.com/dashboard](https://supabase.com/dashboard)
- Sign in and select your project

### 2. Navigate to API Settings
- In the left sidebar, click **Settings**
- Click **API**

### 3. Find the Service Role Key
- Look for the **Service Role** section
- Copy the `service_role` key (it's different from the `anon` key)
- It looks like: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### 4. Add to Your .env File
```bash
# In your backend/.env file, add:
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

## ⚠️ Important Security Notes

- **NEVER commit the service role key to git**
- **NEVER expose it in client-side code**
- **Only use it in your backend server**
- The service role key bypasses Row Level Security (RLS)

## 🔧 After Adding the Key

1. **Restart your backend server**
2. **Run the avatar bucket setup:**
   ```bash
   cd backend
   npm run setup-avatar
   ```
3. **Try uploading an avatar again**

## 🚨 If You Still Get Errors

1. **Check that the key is correct** - no extra spaces or characters
2. **Verify the key is in your .env file** - not just in your terminal
3. **Restart the backend server** after adding the key
4. **Check the backend logs** for detailed error messages

## 📞 Need Help?

If you're still having issues:
1. Check the backend terminal for error logs
2. Verify your Supabase project URL is correct
3. Ensure your Supabase project has storage enabled
4. Check that you have the correct permissions in your Supabase project
