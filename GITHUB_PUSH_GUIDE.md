# GitHub Push Instructions

## Before You Start

1. **Create GitHub Repository First**
   - Go to https://github.com/new
   - Repository name: `copycraft-ai`
   - Description: "AI-powered content generation platform"
   - Choose Private or Public
   - **DO NOT** initialize with README, .gitignore, or license
   - Click **Create repository**

2. **Your GitHub Username**
   - Go to https://github.com/settings/profile
   - Note your username (it's in the URL profile section)

## Step 1: Update Git Remote (Replace YOUR_USERNAME)

Remove the placeholder remote and add the correct one:

```bash
cd c:\Users\User\Downloads\copycraft-ai

# Remove the incorrect remote
git remote remove origin

# Add the correct remote (REPLACE YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/copycraft-ai.git
```

Example (if your GitHub username is "johndoe"):
```bash
git remote add origin https://github.com/johndoe/copycraft-ai.git
```

## Step 2: Verify Remote

```bash
git remote -v
```

You should see:
```
origin  https://github.com/YOUR_USERNAME/copycraft-ai.git (fetch)
origin  https://github.com/YOUR_USERNAME/copycraft-ai.git (push)
```

## Step 3: Verify Branch Name

```bash
git branch
```

Should show: `* main`

## Step 4: Push to GitHub

```bash
git push -u origin main
```

This will prompt you to authenticate. You have two options:

### Option A: Personal Access Token (Recommended)
1. Go to https://github.com/settings/tokens
2. Click "Generate new token" → "Generate new token (classic)"
3. Name: `copycraft-ai-deployment`
4. Select: `repo` (full control of private repositories)
5. Click **Generate token**
6. Copy the token (you won't see it again!)
7. When git asks for password, paste the token

### Option B: SSH Key
1. Generate SSH key (if you don't have one):
   ```bash
   ssh-keygen -t ed25519 -C "your.email@example.com"
   ```
2. Add public key to GitHub: https://github.com/settings/keys
3. Use SSH URL instead: `git@github.com:YOUR_USERNAME/copycraft-ai.git`

## After Successful Push

Your code will be on GitHub at:
```
https://github.com/YOUR_USERNAME/copycraft-ai
```

Then proceed to Vercel deployment!

---

**Need help?**
- GitHub SSH Setup: https://docs.github.com/en/authentication/connecting-to-github-with-ssh
- GitHub Personal Tokens: https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens
