# Mindshiftr Deployment Guide

## 🚀 Your Code is on GitHub!

**Repository:** https://github.com/aayu0401/MindshiftR-app.git

---

## 🌐 Deploy to Vercel (Recommended - Easiest)

### Option 1: One-Click Deploy

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import from GitHub: `aayu0401/MindshiftR-app`
4. Configure:
   - **Framework Preset:** Vite
   - **Root Directory:** `web`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. Click "Deploy"

**Done!** Your app will be live at `https://your-app.vercel.app`

### Option 2: Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Navigate to project
cd c:\Users\44743\Downloads\mindshiftr-monorepo-updated

# Deploy
vercel

# Follow prompts:
# - Link to existing project or create new
# - Set root directory to: web
# - Accept defaults

# Deploy to production
vercel --prod
```

---

## 🌐 Deploy to Netlify (Alternative)

### Option 1: Netlify UI

1. Go to [netlify.com](https://netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Choose GitHub and select `aayu0401/MindshiftR-app`
4. Configure:
   - **Base directory:** `web`
   - **Build command:** `npm run build`
   - **Publish directory:** `web/dist`
5. Click "Deploy site"

**Done!** Your app will be live at `https://your-app.netlify.app`

### Option 2: Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Navigate to web directory
cd c:\Users\44743\Downloads\mindshiftr-monorepo-updated\web

# Build
npm run build

# Deploy
netlify deploy

# Deploy to production
netlify deploy --prod
```

---

## 🎯 Recommended: Vercel

**Why Vercel?**
- ✅ Automatic deployments on git push
- ✅ Free SSL certificates
- ✅ Global CDN
- ✅ Perfect for React/Vite apps
- ✅ Zero configuration needed
- ✅ Preview deployments for PRs

---

## 📝 After Deployment

### Update README with Live URL

Once deployed, update your README.md:

```markdown
## 🚀 Live Demo

**URL:** https://your-app.vercel.app
```

### Test Your Live App

1. Visit your deployed URL
2. Test login: `teacher@demo.com` / `password`
3. Explore all features
4. Share with others!

---

## 🔧 Environment Variables (If Needed)

For production, you may want to add:

**Vercel:**
- Go to Project Settings → Environment Variables
- Add any needed variables

**Netlify:**
- Go to Site Settings → Build & Deploy → Environment
- Add any needed variables

---

## 🎊 Your App is Ready!

**GitHub:** https://github.com/aayu0401/MindshiftR-app.git  
**Deploy:** Follow steps above  
**Live URL:** Coming soon after deployment!

---

**Recommended Next Step:** Deploy to Vercel for the easiest experience!
