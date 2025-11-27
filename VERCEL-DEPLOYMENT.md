# 🚀 AllDeals - Vercel Deployment Guide

## ✨ **Why Vercel is Perfect for AllDeals**

- ✅ **Made by Next.js creators** - Perfect compatibility
- ✅ **Free tier** with generous limits
- ✅ **Custom domains** supported
- ✅ **Automatic deployments** from Git
- ✅ **Built-in database** options
- ✅ **Global CDN** for fast loading
- ✅ **Serverless functions** for API routes

---

## 🎯 **Pre-Deployment Setup**

### **Step 1: Create Vercel Account**
1. Go to [vercel.com](https://vercel.com)
2. **Sign up** with GitHub, GitLab, or Bitbucket
3. **Connect your Git provider** (recommended: GitHub)

### **Step 2: Push Code to Git Repository**
```bash
# Initialize git repository (if not already done)
git init

# Add all files
git add .

# Commit your code
git commit -m "Initial AllDeals deployment"

# Create GitHub repository and push
# (Follow GitHub's instructions to create repo)
git remote add origin https://github.com/yourusername/alldeals.git
git branch -M main
git push -u origin main
```

---

## 🗄️ **Database Setup**

### **Option 1: Vercel Postgres (Recommended)**
1. **Go to Vercel Dashboard** → Storage
2. **Create Postgres Database**
3. **Copy connection string**
4. **Add to environment variables**

### **Option 2: External Database**
- **Supabase** (free PostgreSQL)
- **PlanetScale** (free MySQL)
- **Railway** (free PostgreSQL)

---

## ⚙️ **Environment Variables Setup**

### **In Vercel Dashboard:**
1. Go to **Project Settings** → **Environment Variables**
2. Add these variables:

```bash
# Database
DATABASE_URL=your-vercel-postgres-connection-string

# App URL (will be provided by Vercel)
NEXT_PUBLIC_APP_URL=https://your-app-name.vercel.app

# PayFast (Production)
PAYFAST_MERCHANT_ID=your-production-merchant-id
PAYFAST_MERCHANT_KEY=your-production-merchant-key
PAYFAST_PASSPHRASE=your-production-passphrase

# Authentication
JWT_SECRET=your-super-secure-jwt-secret
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=https://your-app-name.vercel.app

# Optional: Email
SMTP_HOST=your-smtp-host
SMTP_PORT=587
SMTP_USER=your-email@domain.com
SMTP_PASS=your-email-password
```

---

## 🚀 **Deployment Steps**

### **Method 1: Automatic Deployment (Recommended)**

1. **Import Project** in Vercel Dashboard
   - Click "New Project"
   - Import from your Git repository
   - Select "AllDeals" repository

2. **Configure Build Settings**
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`

3. **Deploy**
   - Click "Deploy"
   - Vercel will build and deploy automatically
   - You'll get a URL like: `https://alldeals-xyz123.vercel.app`

### **Method 2: Vercel CLI**

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from your project directory
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? alldeals
# - Directory? ./
# - Override settings? No

# Deploy to production
vercel --prod
```

---

## 🗄️ **Database Migration**

After deployment, run database setup:

### **Using Vercel CLI:**
```bash
# Set up database schema
vercel env pull .env.local
npx prisma db push

# Seed initial data (optional)
npx tsx scripts/seed-sample-data.ts
```

### **Using Vercel Dashboard:**
1. Go to **Functions** tab
2. Create a **serverless function** for database setup
3. Or use the **Vercel Postgres** dashboard

---

## 🌐 **Custom Domain Setup**

### **Add Your Domain:**
1. **Vercel Dashboard** → **Project Settings** → **Domains**
2. **Add Domain**: `alldeals.yourdomain.com`
3. **Configure DNS** with your domain provider:
   ```
   Type: CNAME
   Name: alldeals
   Value: cname.vercel-dns.com
   ```
4. **Verify Domain** in Vercel dashboard

### **SSL Certificate:**
- ✅ **Automatic** - Vercel provides free SSL
- ✅ **Global CDN** - Fast loading worldwide

---

## 🧪 **Testing Your Deployment**

### **Basic Tests:**
- [ ] **Homepage**: `https://your-app.vercel.app` loads
- [ ] **Navigation**: All pages work
- [ ] **Products**: Catalog displays correctly
- [ ] **Images**: All images load properly

### **Authentication Tests:**
- [ ] **Registration**: New users can sign up
- [ ] **Login**: Users can log in
- [ ] **Wishlist Protection**: ✅ Requires login
- [ ] **Checkout Protection**: ✅ Requires login
- [ ] **Session**: Login persists across pages

### **E-commerce Tests:**
- [ ] **Shopping Cart**: Add/remove items
- [ ] **PayFast**: Payment process works
- [ ] **Admin Panel**: `/admin` accessible
- [ ] **Analytics**: Real data displays

---

## 🔧 **Vercel-Specific Optimizations**

### **Update next.config.js:**
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  // Vercel optimizations
  compress: true,
  poweredByHeader: false,
  generateEtags: true,
  
  // Image optimization for Vercel
  images: {
    domains: [
      'images.unsplash.com',
      'via.placeholder.com',
      // Add your image domains
    ],
  },
}

module.exports = nextConfig
```

### **Add vercel.json (optional):**
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "regions": ["cpt1"],
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 30
    }
  }
}
```

---

## 📊 **Monitoring & Analytics**

### **Vercel Analytics:**
1. **Enable** in project settings
2. **View performance** metrics
3. **Monitor** function execution

### **Error Tracking:**
- **Vercel Functions** tab shows errors
- **Real-time logs** available
- **Performance insights**

---

## 🔄 **Continuous Deployment**

### **Automatic Updates:**
- ✅ **Push to main branch** → Auto-deploy to production
- ✅ **Pull requests** → Preview deployments
- ✅ **Branch deployments** → Test environments

### **Deployment Commands:**
```bash
# Deploy to production
git push origin main

# Create preview deployment
git push origin feature-branch
```

---

## 💰 **Vercel Pricing (Free Tier)**

### **Free Tier Includes:**
- ✅ **Unlimited** personal projects
- ✅ **100GB** bandwidth per month
- ✅ **Custom domains**
- ✅ **SSL certificates**
- ✅ **Serverless functions**
- ✅ **Edge network**

### **Limits:**
- **Function execution**: 10 seconds max
- **Function size**: 50MB max
- **Bandwidth**: 100GB/month
- **Build time**: 45 minutes max

*Perfect for small to medium e-commerce sites!*

---

## 🚨 **Troubleshooting**

### **Common Issues:**

**Build Failures:**
- Check **build logs** in Vercel dashboard
- Verify **environment variables** are set
- Ensure **dependencies** are in package.json

**Database Connection:**
- Verify **DATABASE_URL** is correct
- Check **Prisma schema** is valid
- Run **prisma generate** locally first

**PayFast Integration:**
- Update **return URLs** to Vercel domain
- Verify **merchant credentials**
- Test with **sandbox** first

---

## 🎉 **Deployment Checklist**

- [ ] **Code pushed** to Git repository
- [ ] **Vercel project** created and connected
- [ ] **Environment variables** configured
- [ ] **Database** set up and migrated
- [ ] **Custom domain** configured (optional)
- [ ] **PayFast URLs** updated to Vercel domain
- [ ] **All functionality** tested
- [ ] **SSL certificate** active
- [ ] **Analytics** enabled

---

## 🚀 **Ready to Deploy!**

Your AllDeals e-commerce platform will be:
- ✅ **Lightning fast** with global CDN
- ✅ **Automatically scaled** based on traffic
- ✅ **Highly available** with 99.99% uptime
- ✅ **Secure** with automatic SSL
- ✅ **Easy to maintain** with Git-based deployments

**Let's get your store online!** 🛒✨
