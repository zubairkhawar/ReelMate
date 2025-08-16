# HeyGen Integration Setup Guide

## 🚀 **Getting Started with HeyGen**

### **1. Get Your HeyGen API Key**

1. Go to [HeyGen Dashboard](https://app.heygen.com/)
2. Sign in to your account
3. Navigate to **Settings** → **API Keys**
4. Create a new API key
5. Copy the API key (it starts with `hg_`)

### **2. Configure Environment Variables**

Create a `.env.local` file in your `frontend` directory:

```bash
# HeyGen API Configuration
NEXT_PUBLIC_HEYGEN_API_URL=https://api.heygen.com/v1
NEXT_PUBLIC_HEYGEN_API_KEY=hg_your_actual_api_key_here
```

**⚠️ Important:** Replace `hg_your_actual_api_key_here` with your real HeyGen API key.

### **3. Features Available**

✅ **Real Avatars** - Display actual HeyGen avatar images  
✅ **Voice Samples** - Show real voice names and play samples  
✅ **Video Generation** - Create videos using HeyGen's AI  
✅ **Fallback Support** - Works even if API is unavailable  

### **4. API Endpoints Used**

- `GET /avatar/list` - Fetch available avatars
- `GET /voice/list` - Fetch available voices  
- `POST /video/generate` - Start video generation
- `GET /video/status` - Check generation progress

### **5. Testing the Integration**

1. Start your frontend: `npm run dev`
2. Go to `/dashboard/campaigns/new`
3. Complete steps 1-3 (Campaign Setup, Product & Platform, AI Script)
4. In step 4 (Avatar & Voice Selection), you should see:
   - Real HeyGen avatars with previews
   - Real HeyGen voices with playable samples
5. Select avatar and voice, then proceed to video generation

### **6. Troubleshooting**

**If avatars/voices don't load:**
- Check your API key is correct
- Verify the API key has proper permissions
- Check browser console for errors
- The system will fall back to mock data if needed

**If voice samples don't play:**
- Ensure your browser allows audio playback
- Check if the voice has a sample URL
- Some voices may not have samples available

### **7. Cost Information**

- **Avatar Usage**: Free with HeyGen account
- **Voice Usage**: Free with HeyGen account  
- **Video Generation**: Pay-per-video (check HeyGen pricing)
- **API Calls**: Included in your HeyGen plan

### **8. Support**

- **HeyGen API Docs**: [https://docs.heygen.com/](https://docs.heygen.com/)
- **HeyGen Support**: [https://help.heygen.com/](https://help.heygen.com/)
- **Project Issues**: Check the GitHub repository

---

**🎯 Ready to create amazing AI videos with real avatars and voices!**
