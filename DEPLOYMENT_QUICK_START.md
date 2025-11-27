# 🚀 Deploying CopyCraft AI to Vercel (Quick Start)

Your Git repository is ready! Follow these steps to deploy on Vercel.

## Step 1: Create GitHub Repository

1. Go to [github.com/new](https://github.com/new)
2. Name: `copycraft-ai`
3. Description: "AI-powered content generation platform with Clerk authentication"
4. **Do NOT** initialize with README, .gitignore, or license
5. Click **Create repository**

## Step 2: Push to GitHub

Run these commands in your terminal:

```bash
cd c:\Users\User\Downloads\copycraft-ai
git remote add origin https://github.com/YOUR_USERNAME/copycraft-ai.git
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username.

## Step 3: Deploy on Vercel

### Option A: Via Vercel Dashboard (Recommended)

1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub (or create account)
3. Click **Add New** → **Project**
4. Find and select `copycraft-ai` repository
5. **Configure Project**:
   - Framework Preset: `Vite`
   - Root Directory: `.` (default)
   - Build Command: `npm run build`
   - Output Directory: `dist`

6. **Environment Variables** - Add these:
   - Name: `VITE_GEMINI_API_KEY`
   - Value: `AIzaSyB1gaR1CBYcUr_SEUW7eySXWotqJVgW4ZA`
   
   - Name: `VITE_CLERK_PUBLISHABLE_KEY`
   - Value: `pk_test_ZmVhc2libGUtbWl0ZS0xNy5jbGVyay5hY2NvdW50cy5kZXYk`

7. Click **Deploy** (takes 1-3 minutes)

### Option B: Via Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Deploy from project directory
vercel

# For production deployment
vercel --prod
```

## Step 4: Verify Deployment

✅ Your app will be live at: `https://copycraft-ai.vercel.app`

Test:
1. Visit your live URL
2. Click "Sign In"
3. Create a test account with email
4. Generate some content
5. Check that everything works

## Step 5: Configure Custom Domain (Optional)

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Domains**
3. Add your custom domain
4. Follow DNS configuration instructions

## Automatic Deployments

Every time you push to `main` branch:

```bash
git add .
git commit -m "Your changes"
git push origin main
```

Vercel will automatically rebuild and deploy! 🎉

## Troubleshooting

### Build Fails
- Check build logs in Vercel dashboard
- Verify all environment variables are set
- Run `npm run build` locally to test

### Sign-in Not Working
- Verify `VITE_CLERK_PUBLISHABLE_KEY` in Vercel env vars
- Add your Vercel domain to Clerk allowed origins:
  - Go to [Clerk Dashboard](https://dashboard.clerk.com)
  - Allowed Origins: Add `https://copycraft-ai.vercel.app`

### API Not Working
- Verify `VITE_GEMINI_API_KEY` is correct
- Check Google Cloud Console for API quota
- Verify API is enabled in Google Cloud

## Resources

- [Vercel Docs](https://vercel.com/docs)
- [Vite Deployment](https://vitejs.dev/guide/static-deploy.html)
- [Clerk Deployment](https://clerk.com/docs/deployment/overview)
- [Google Gemini API](https://ai.google.dev/)

---

**Status**: ✅ Git repository initialized and ready for deployment
**Branch**: main
**Files Tracked**: 18 files committed

Good luck! 🚀
