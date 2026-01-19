# WordLane Deployment Guide

Complete guide for deploying and redeploying the WordLane e-commerce platform on Vercel.

---

## 🚀 Initial Deployment (Already Completed)

Your project is now deployed using **automatic GitHub integration** with Vercel.

**GitHub Repository**: https://github.com/Vedrajmane/gifthamper_web.git

---

## 🔄 How to Redeploy After Making Changes

### ✅ Automatic Deployment (Recommended - Already Set Up)

Every time you push code to GitHub, Vercel automatically deploys:

```bash
# 1. Make your changes to the code
# 2. Save all files

# 3. Commit and push to GitHub
git add .
git commit -m "Description of your changes"
git push origin main

# 4. Vercel automatically detects and deploys!
# Check deployment status at: https://vercel.com/dashboard
```

**That's it!** Vercel will:

- Detect the push to GitHub
- Build your project
- Deploy to production automatically
- Usually takes 1-3 minutes

---

## 📋 Manual Deployment (Alternative Method)

If you prefer manual control:

```bash
# Install Vercel CLI (one-time)
npm install -g vercel

# Login to Vercel (one-time)
vercel login

# Deploy to production
vercel --prod
```

---

## 🔧 Environment Variables Setup

### Required Variables on Vercel:

Go to: **Vercel Dashboard → Your Project → Settings → Environment Variables**

Add these variables:

```
NEXT_PUBLIC_WHATSAPP_PHONE=919867673627
ADMIN_USERNAME=your_admin_username
ADMIN_PASSWORD=your_secure_password
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
NEXT_PUBLIC_SITE_URL=https://your-vercel-url.vercel.app
```

> **⚠️ IMPORTANT**: Change `ADMIN_USERNAME` and `ADMIN_PASSWORD` from defaults!

### After Adding/Changing Environment Variables:

Environment variables require a **redeploy** to take effect:

- Vercel Dashboard → Deployments → Click "Redeploy" on latest deployment
- OR push a new commit to GitHub

---

## 🔗 Connecting to Vercel (First Time Setup)

### Via Vercel Dashboard (Easiest):

1. Go to https://vercel.com/
2. Sign up/Login with GitHub
3. Click "Add New Project"
4. Import `Vedrajmane/gifthamper_web`
5. Configure environment variables
6. Click "Deploy"

### Via Vercel CLI:

```bash
# Install CLI
npm install -g vercel

# Login
vercel login

# Link project
vercel link

# Add environment variables
vercel env add NEXT_PUBLIC_FIREBASE_API_KEY

# Deploy
vercel --prod
```

---

## 📊 Monitoring Deployments

### Check Deployment Status:

- **Dashboard**: https://vercel.com/dashboard
- **CLI**: `vercel logs`

### View Live Site:

- Vercel provides a URL like: `https://gifthamper-web.vercel.app`
- Or your custom domain if configured

---

## 🐛 Troubleshooting

### Build Fails:

```bash
# Test build locally first
npm run build

# If it works locally but fails on Vercel:
# - Check environment variables are set
# - Check Node.js version matches (package.json engines)
# - Review build logs in Vercel dashboard
```

### Environment Variables Not Working:

- Ensure they're added in Vercel Dashboard
- Redeploy after adding variables
- Check variable names match exactly (case-sensitive)

### Deployment Not Triggering:

- Verify GitHub integration is connected
- Check Vercel dashboard for webhook status
- Try manual push: `git push origin main --force`

---

## 🔄 Rollback to Previous Version

If something breaks:

### Via Dashboard:

1. Go to Vercel Dashboard → Deployments
2. Find the last working deployment
3. Click "⋯" → "Promote to Production"

### Via CLI:

```bash
vercel rollback
```

---

## 💡 Best Practices

### Before Pushing Changes:

1. ✅ Test locally: `npm run dev`
2. ✅ Build locally: `npm run build`
3. ✅ Check for TypeScript errors
4. ✅ Commit with descriptive message
5. ✅ Push to GitHub

### Deployment Workflow:

```bash
# Development
npm run dev          # Test changes locally

# Pre-deployment check
npm run build        # Ensure build works
npm run start        # Test production build

# Deploy
git add .
git commit -m "Add new feature"
git push origin main # Automatic deployment!
```

---

## 📱 Custom Domain (Optional)

### Add Custom Domain:

1. Vercel Dashboard → Your Project → Settings → Domains
2. Add your domain (e.g., `martinibynidhi.com`)
3. Update DNS records as instructed by Vercel
4. Update `NEXT_PUBLIC_SITE_URL` environment variable
5. Redeploy

---

## 💰 Vercel Free Tier Limits

- ✅ **Unlimited** deployments
- ✅ **100 GB** bandwidth/month
- ✅ **Automatic** HTTPS
- ✅ **Global** CDN
- ✅ **Preview** deployments for branches

**Upgrade to Pro if you need:**

- More bandwidth
- Commercial usage
- Advanced analytics

---

## 🆘 Quick Reference

| Action               | Command                |
| -------------------- | ---------------------- |
| Deploy automatically | `git push origin main` |
| Deploy manually      | `vercel --prod`        |
| View logs            | `vercel logs`          |
| Rollback             | `vercel rollback`      |
| Check status         | Visit Vercel Dashboard |

---

## ✅ Summary

**You're all set!** Your deployment workflow is:

1. **Make changes** to your code
2. **Test locally**: `npm run dev`
3. **Push to GitHub**: `git push origin main`
4. **Vercel auto-deploys** (1-3 minutes)
5. **Done!** ✨

**No need to manually deploy** unless you want to use the CLI method.

---

**Questions?** Check the [Vercel Documentation](https://vercel.com/docs) or [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
