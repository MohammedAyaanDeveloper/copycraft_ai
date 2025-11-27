# CopyCraft AI - Content Generation Platform

An AI-powered content generation tool built with React, Vite, and Google's Gemini API. Features Clerk authentication and runs on top of the latest web technologies.

## Features

- 🤖 **AI-Powered Content Generation** - Generate engaging content using Google Gemini 2.5
- 🔐 **Secure Authentication** - Built-in Clerk authentication
- 📚 **Content History** - Local storage for generation history
- 📱 **Responsive Design** - Works seamlessly on all devices
- ⚡ **Fast Performance** - Built with Vite and React 19

## Tech Stack

- **Frontend**: React 19, Vite, TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: Clerk
- **AI API**: Google Gemini 2.5
- **Icons**: Lucide React

## Prerequisites

- Node.js (v16 or higher)
- npm, yarn, pnpm, or bun
- GitHub account
- Vercel account
- Google Gemini API key
- Clerk authentication setup

## Local Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/copycraft-ai.git
cd copycraft-ai
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env.local` file with your credentials:

```bash
VITE_GEMINI_API_KEY=your_gemini_api_key_here
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
```

**Note**: Use `.env.local` for local development. Never commit this file.

### 4. Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:3000/`

### 5. Build for Production

```bash
npm run build
```

Output will be in the `dist/` folder.

---

## Deployment on Vercel (GitHub Integration)

### Step 1: Initialize Git Repository (If Not Already Done)

```bash
cd copycraft-ai
git init
git add .
git commit -m "Initial commit: CopyCraft AI setup"
```

### Step 2: Create GitHub Repository

1. Go to [github.com/new](https://github.com/new)
2. Create a new repository named `copycraft-ai`
3. **Do NOT** initialize with README, .gitignore, or license (we already have them)
4. Click **Create repository**

### Step 3: Push Code to GitHub

```bash
git remote add origin https://github.com/yourusername/copycraft-ai.git
git branch -M main
git push -u origin main
```

### Step 4: Deploy on Vercel

#### Option A: Using Vercel Dashboard

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **Add New** → **Project**
3. Select your `copycraft-ai` repository
4. **Configure Project**:
   - Framework: Select `Vite`
   - Root Directory: (leave as `.`)
   - Build Command: `npm run build`
   - Output Directory: `dist`

5. **Add Environment Variables**:
   Click **Add** for each variable:
   - `VITE_GEMINI_API_KEY` = your Google Gemini API key
   - `VITE_CLERK_PUBLISHABLE_KEY` = your Clerk publishable key

6. Click **Deploy**

#### Option B: Using Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Deploy
vercel

# Link to existing project (if deploying to existing)
vercel --prod
```

### Step 5: Verify Deployment

- Your app will be live at `https://copycraft-ai.vercel.app/` (or your custom domain)
- Test authentication by signing in
- Verify API calls work correctly

---

## Environment Variables Reference

| Variable | Purpose | Where to Get |
|----------|---------|--------------|
| `VITE_GEMINI_API_KEY` | Google Gemini API authentication | [Google AI Studio](https://aistudio.google.com/app/apikey) |
| `VITE_CLERK_PUBLISHABLE_KEY` | Clerk authentication | [Clerk Dashboard](https://dashboard.clerk.com/last-active?path=api-keys) |

**Important**: 
- The `VITE_` prefix is required for Vite to expose variables to client-side code
- Never commit real keys to Git
- Use `.env.local` for development and Vercel's dashboard for production

---

## Continuous Deployment

Every time you push to the `main` branch on GitHub, Vercel automatically:
1. Detects the changes
2. Runs `npm install` and `npm run build`
3. Deploys the updated app

To deploy:

```bash
git add .
git commit -m "Your changes"
git push origin main
```

---

## Troubleshooting Deployment

### Issue: Build fails with "Missing environment variables"
- Verify all required `VITE_*` variables are set in Vercel's dashboard
- Vercel requires `VITE_` prefix to expose to client-side

### Issue: Authentication not working
- Ensure `VITE_CLERK_PUBLISHABLE_KEY` is correct
- Add your Vercel domain to Clerk's allowed origins in Clerk Dashboard

### Issue: API calls fail
- Verify `VITE_GEMINI_API_KEY` is valid and has quota
- Check CORS settings in Google Cloud Console

### View Deployment Logs
1. Go to your Vercel project dashboard
2. Click **Deployments**
3. Select a deployment
4. Click **Logs** to view build and runtime logs

---

## Additional Resources

- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [Vercel Documentation](https://vercel.com/docs)
- [Clerk Documentation](https://clerk.com/docs)
- [Google Gemini API Docs](https://ai.google.dev/docs)

---

## License

This project is open source and available under the MIT License.

---

## Support

For issues or questions:
1. Check the [GitHub Issues](https://github.com/yourusername/copycraft-ai/issues)
2. Review [Vercel Troubleshooting](https://vercel.com/docs/platform/troubleshoot)
3. Contact Clerk or Google support for authentication/API issues
