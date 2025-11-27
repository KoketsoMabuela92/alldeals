# 🚀 AllDeals Production Deployment Guide

## 📋 Pre-Deployment Checklist

### ✅ **1. Environment Setup**
- [ ] Configure production database (PostgreSQL/MySQL)
- [ ] Set up PayFast production merchant account
- [ ] Configure domain/subdomain DNS settings
- [ ] Prepare SSL certificate (usually handled by hosting provider)

### ✅ **2. Environment Variables**
Update `.env.production` with your actual values:

```bash
# Database - Get from your hosting provider
DATABASE_URL="postgresql://username:password@host:port/alldeals_prod"

# Domain - Your subdomain
NEXT_PUBLIC_APP_URL="https://alldeals.yourdomain.com"

# PayFast - Production credentials
PAYFAST_MERCHANT_ID="your-production-merchant-id"
PAYFAST_MERCHANT_KEY="your-production-merchant-key"
PAYFAST_PASSPHRASE="your-production-passphrase"

# Security - Generate secure keys
JWT_SECRET="generate-a-secure-random-string"
NEXTAUTH_SECRET="generate-another-secure-random-string"
```

### ✅ **3. Database Migration**
```bash
# Generate Prisma client for production
npx prisma generate

# Run database migrations
npx prisma db push

# Seed initial data (optional)
npx tsx scripts/seed-sample-data.ts
```

### ✅ **4. Build Application**
```bash
# Install dependencies
npm install --production

# Build for production
npm run build

# Test production build locally (optional)
npm start
```

## 🌐 **Axxess Hosting Deployment Steps**

### **Step 1: Prepare Files**
1. **Upload these files/folders to your hosting:**
   ```
   ├── .next/                 # Built application
   ├── public/               # Static assets
   ├── prisma/               # Database schema
   ├── package.json          # Dependencies
   ├── package-lock.json     # Lock file
   ├── next.config.js        # Next.js config
   └── .env.production       # Environment variables
   ```

### **Step 2: Database Setup**
1. **Create production database** on Axxess hosting
2. **Update DATABASE_URL** in `.env.production`
3. **Run migrations:**
   ```bash
   npx prisma db push
   ```

### **Step 3: Domain Configuration**
1. **Set up subdomain** (e.g., `alldeals.yourdomain.com`)
2. **Point to your hosting directory**
3. **Enable SSL certificate**
4. **Update NEXT_PUBLIC_APP_URL** in environment variables

### **Step 4: PayFast Configuration**
1. **Create PayFast production account**
2. **Get production merchant credentials**
3. **Update PayFast environment variables**
4. **Test payment integration**

## 📦 **Deployment Package Creation**

Run this script to create a deployment-ready package:

```bash
# Create deployment package
npm run build
tar -czf alldeals-deployment.tar.gz \
  .next \
  public \
  prisma \
  package.json \
  package-lock.json \
  next.config.js \
  .env.production
```

## 🔧 **Axxess Hosting Specific Configuration**

### **Node.js Setup**
1. **Ensure Node.js 18+ is available**
2. **Set startup command:**
   ```bash
   npm start
   ```

### **Environment Variables**
Set these in your Axxess hosting control panel:
- `NODE_ENV=production`
- `DATABASE_URL=your-database-url`
- `NEXT_PUBLIC_APP_URL=https://alldeals.yourdomain.com`
- All PayFast and JWT variables

### **File Permissions**
Ensure proper permissions:
```bash
chmod -R 755 public/
chmod -R 644 .next/
```

## 🧪 **Post-Deployment Testing**

### **1. Basic Functionality**
- [ ] Homepage loads correctly
- [ ] Product listings work
- [ ] Search functionality
- [ ] User registration/login
- [ ] Shopping cart operations

### **2. E-commerce Features**
- [ ] Add to cart
- [ ] Wishlist functionality
- [ ] Checkout process
- [ ] PayFast payment integration
- [ ] Order confirmation

### **3. Admin Panel**
- [ ] Admin login works
- [ ] Analytics dashboard loads
- [ ] Customer management
- [ ] Order management
- [ ] Settings updates

### **4. Performance**
- [ ] Page load speeds < 3 seconds
- [ ] Images load properly
- [ ] Mobile responsiveness
- [ ] SSL certificate active

## 🚨 **Troubleshooting**

### **Common Issues:**

**Database Connection Errors:**
```bash
# Check database URL format
# Ensure database exists and is accessible
# Verify credentials
```

**Build Errors:**
```bash
# Clear cache and rebuild
rm -rf .next
npm run build
```

**Environment Variable Issues:**
```bash
# Verify all required variables are set
# Check for typos in variable names
# Ensure proper escaping of special characters
```

**PayFast Integration Issues:**
```bash
# Verify merchant credentials
# Check return/notify URLs
# Test with PayFast sandbox first
```

## 📞 **Support Contacts**

- **Axxess Hosting Support**: [Your hosting support details]
- **PayFast Support**: support@payfast.co.za
- **Application Issues**: [Your contact information]

## 🎯 **Go-Live Checklist**

- [ ] All environment variables configured
- [ ] Database migrated and seeded
- [ ] PayFast production account active
- [ ] SSL certificate installed
- [ ] Domain/subdomain configured
- [ ] All tests passing
- [ ] Backup strategy in place
- [ ] Monitoring setup (optional)

## 🔄 **Maintenance**

### **Regular Tasks:**
- Monitor application logs
- Update dependencies monthly
- Backup database weekly
- Monitor PayFast transactions
- Check SSL certificate expiry

### **Updates:**
```bash
# Pull latest changes
git pull origin main

# Install dependencies
npm install

# Rebuild application
npm run build

# Restart application
pm2 restart alldeals  # or your process manager
```

---

**🎉 Your AllDeals e-commerce platform is ready for production!**
