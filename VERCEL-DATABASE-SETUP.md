# 🗄️ Vercel Database Setup for AllDeals Login

## 🚨 Current Issue
**Login failing** because no database is connected to your Vercel deployment.

## 🚀 Quick Fix: Set Up Vercel Postgres (Free)

### Step 1: Create Database in Vercel
1. **Go to Vercel Dashboard** → Your AllDeals project
2. **Storage** tab → **Create Database**
3. **Select "Postgres"** → **Continue**
4. **Database name**: `alldeals-db`
5. **Region**: Choose closest to you
6. **Create**

### Step 2: Get Connection String
1. **After creation** → **Settings** tab
2. **Copy the connection string** (starts with `postgres://`)
3. **It looks like**: `postgres://default:password@host:5432/verceldb`

### Step 3: Add to Environment Variables
1. **Vercel Dashboard** → **Settings** → **Environment Variables**
2. **Add new variable**:
   ```
   Name: DATABASE_URL
   Value: postgres://default:password@host:5432/verceldb
   ```
3. **Save**

### Step 4: Set Up Database Schema
1. **Vercel Dashboard** → **Functions** tab
2. **Or use Vercel CLI locally**:
   ```bash
   vercel env pull .env.local
   npx prisma db push
   ```

### Step 5: Create Test User
Add this to your database (via Vercel Postgres dashboard):
```sql
INSERT INTO "User" (id, email, password, name, "createdAt", "updatedAt") 
VALUES (
  'test-user-id',
  'admin@alldeals.com',
  '$2a$12$LQv3c1yqBw2LeOI.UKNOSuOiUiIkYhqHvgbdyU7TgH.mVKleIor6.',
  'Admin User',
  NOW(),
  NOW()
);
```

**Password**: `admin123`

## 🎯 Alternative: Use Supabase (Also Free)

### Option 2: Supabase Database
1. **Go to**: https://supabase.com
2. **Create account** → **New project**
3. **Get connection string** from Settings → Database
4. **Add to Vercel environment variables**

## ⚡ Quick Test Credentials

**After database setup, use these to test login:**
- **Email**: `admin@alldeals.com`
- **Password**: `admin123`

## 🔄 Redeploy After Setup
1. **Add DATABASE_URL** environment variable
2. **Vercel will auto-redeploy**
3. **Test login** with credentials above

## 📋 Environment Variables Needed

```bash
# Database
DATABASE_URL=postgres://your-connection-string

# Auth (generate random strings)
JWT_SECRET=your-super-secure-jwt-secret
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=https://alldeals.vercel.app

# App
NEXT_PUBLIC_APP_URL=https://alldeals.vercel.app
```

## ✅ After Setup
1. **Login should work** ✅
2. **Refresh button removed** ✅
3. **Authentication protection active** ✅
4. **Checkout/wishlist require login** ✅

Your AllDeals platform will be fully functional! 🚀
