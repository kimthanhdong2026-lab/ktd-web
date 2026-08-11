# 🚀 Deployment Guide - KTD Website MVP

This guide will help you deploy the KTD website to Vercel in 10 minutes.

## Prerequisites

- GitHub account (free)
- Vercel account (free, auto-creates with GitHub)
- Git installed locally

## Step 1: Create GitHub Repository

### Option A: Via GitHub Web (Easiest)

1. Go to **https://github.com/new**
2. Repository name: `ktd-website`
3. Description: `Kim Thành Đông B2B Industrial Equipment Website`
4. **Public** (so you can deploy to Vercel free)
5. Click **Create repository**

### Option B: Via GitHub CLI
```bash
gh repo create ktd-website --public --source=. --remote=origin --push
```

## Step 2: Push Code to GitHub

```bash
# In your local KTD-web directory
git remote add origin https://github.com/YOUR_USERNAME/ktd-website.git
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username.

**Verify**: Go to https://github.com/YOUR_USERNAME/ktd-website — you should see all your code there.

## Step 3: Deploy to Vercel

### Option A: Via Vercel Web (Recommended)

1. Go to **https://vercel.com**
2. Click **Sign Up** or **Login** → Connect with GitHub
3. Click **+ New Project**
4. Select your `ktd-website` repository
5. **Configure Project** settings:
   - **Framework Preset**: Next.js (auto-detected)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)
   - **Install Command**: `npm install` (default)
   - **Root Directory**: `./` (default)
6. Click **Deploy** 🎉

Vercel will:
- Install dependencies
- Build the app
- Deploy to: `ktd-website.vercel.app`

### Option B: Via Vercel CLI

```bash
npm i -g vercel
vercel
# Follow the prompts to link GitHub account and deploy
```

## Step 4: Verify Deployment

After deployment completes:

1. **Visit your live site**: `https://ktd-website.vercel.app`
2. **Test key pages**:
   - Home page (hero, brands, products)
   - Products listing with filters
   - Product detail page
   - About, Contact, News pages
3. **Test interactive features**:
   - Search overlay (top right 🔍)
   - RFQ modal (red button)
   - Floating CTA buttons (right side)

## Step 5: Custom Domain (Optional)

To use `kimthanhdong.vn`:

1. In Vercel Dashboard → Project Settings → Domains
2. Add domain → enter `kimthanhdong.vn`
3. Update DNS records at your domain registrar (Vercel will provide instructions)
4. Wait 24-48 hours for DNS propagation

## Step 6: Environment Variables (For Phase 2)

When you have Supabase credentials:

1. **Vercel Dashboard → Settings → Environment Variables**
2. Add:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```
3. Click **Deploy** to redeploy with new env vars

## Troubleshooting

### Build fails
- Check `npm run build` works locally first
- Verify Node.js version: `node --version` (should be 18+)
- Check for TypeScript errors: `npx tsc --noEmit`

### Pages not rendering
- Clear browser cache (Cmd/Ctrl + Shift + R)
- Check browser console for errors (F12)
- Check Vercel build logs (Dashboard → Deployments → View Build Logs)

### Performance issues
- Once Supabase is connected, check database query performance
- Use Vercel Analytics to monitor Core Web Vitals
- Enable Image Optimization (Next.js default)

## Automatic Deployments

After first deployment, every push to `main` branch auto-deploys:

```bash
# Make a change, then:
git add .
git commit -m "Update homepage copy"
git push origin main

# ✅ Vercel auto-builds and deploys in ~2 minutes
```

## Phase 2: Supabase Integration

Once you have Supabase:

1. Create database schema (migrations provided)
2. Seed initial data (brands, categories, products)
3. Update environment variables in Vercel
4. Update pages to fetch from Supabase instead of mock data
5. Deploy → auto-updates with real data

## Useful Links

- **Vercel Dashboard**: https://vercel.com/dashboard
- **Your Project**: https://vercel.com/dashboard/ktd-website
- **Deployments**: https://vercel.com/dashboard/ktd-website/deployments
- **GitHub Repo**: https://github.com/YOUR_USERNAME/ktd-website
- **CLI Docs**: https://vercel.com/docs/cli

## Support

- Vercel docs: https://vercel.com/docs
- Next.js docs: https://nextjs.org/docs
- GitHub docs: https://docs.github.com

---

**Time estimate**: 10 minutes (including DNS setup for custom domain)

**Cost**: $0 (both Vercel and GitHub free tiers work great for this)

**Next**: After deployment, we'll integrate Supabase for real data!
