# 🚀 Quick Setup for HeyGen Integration

## **Immediate Fix - Add Your API Key**

### **Step 1: Create Environment File**
Create a file called `.env.local` in your `frontend` folder:

```bash
cd frontend
touch .env.local
```

### **Step 2: Add Your HeyGen API Key**
Open `.env.local` and add:

```bash
NEXT_PUBLIC_HEYGEN_API_KEY=hg_your_actual_api_key_here
```

**Replace `hg_your_actual_api_key_here` with your real HeyGen API key**

### **Step 3: Get Your API Key**
1. Go to [HeyGen Dashboard](https://app.heygen.com/)
2. Sign in → Settings → API Keys
3. Create new key → Copy the key (starts with `hg_`)

### **Step 4: Restart Your App**
```bash
# Stop your current frontend
# Then restart:
npm run dev
```

## **What You'll See After Setup:**

✅ **Real HeyGen Avatars** - Professional photos instead of initials  
✅ **Voice Samples** - Click ▶ to hear real voice samples  
✅ **Professional UI** - Enhanced selection experience  
✅ **Real API Integration** - Live data from HeyGen  

## **If Still Using Fallback Data:**

The system will show:
- **Professional avatar photos** from Unsplash
- **Playable voice samples** (demo audio)
- **Enhanced UI** with hover effects and previews

## **Troubleshooting:**

- **Check browser console** for API key status
- **Verify .env.local** is in the frontend folder
- **Restart the app** after adding the API key
- **Check API key format** - should start with `hg_`

---

**🎯 You'll have real HeyGen avatars and voices in minutes!**
