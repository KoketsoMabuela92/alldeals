# 🌐 AllDeals - Axxess Hosting Setup Guide

## 🚀 Quick Deployment Steps

### **Step 1: Prepare Your Environment**
1. **Copy environment template:**
   ```bash
   cp .env.template .env.production
   ```

2. **Update `.env.production` with your values:**
   - Database URL from Axxess hosting
   - Your subdomain URL
   - PayFast production credentials
   - Generate secure JWT secrets

### **Step 2: Build for Production**
```bash
# Run the deployment script
./scripts/deploy-production.sh
```

This will create a deployment package: `alldeals-deployment-YYYYMMDD_HHMMSS.tar.gz`

### **Step 3: Axxess Hosting Configuration**

#### **3.1 Database Setup**
1. **Log into Axxess Control Panel**
2. **Create MySQL/PostgreSQL database**
3. **Note down connection details:**
   - Host
   - Port
   - Database name
   - Username
   - Password
4. **Update DATABASE_URL in .env.production**

#### **3.2 Subdomain Setup**
1. **Create subdomain** (e.g., `alldeals.yourdomain.com`)
2. **Point to your hosting directory**
3. **Enable SSL certificate** (usually automatic)
4. **Update NEXT_PUBLIC_APP_URL** in environment variables

#### **3.3 File Upload**
1. **Extract deployment package** to your hosting directory
2. **Upload files via FTP/File Manager:**
   ```
   /public_html/alldeals/  (or your subdomain directory)
   ├── .next/
   ├── public/
   ├── prisma/
   ├── package.json
   ├── package-lock.json
   ├── next.config.js
   └── .env.production
   ```

#### **3.4 Node.js Configuration**
1. **Set Node.js version** to 18+ in control panel
2. **Set startup file** to: `server.js` or use npm start
3. **Set environment variables** in hosting control panel

### **Step 4: Database Migration**
```bash
# SSH into your hosting or use terminal
cd /path/to/your/alldeals/directory

# Install dependencies
npm install --production

# Generate Prisma client
npx prisma generate

# Push database schema
npx prisma db push

# Seed initial data (optional)
npx tsx scripts/seed-sample-data.ts
```

### **Step 5: Start Application**
```bash
# Start the application
npm start
```

## 🔧 **Axxess-Specific Settings**

### **Control Panel Configuration**
Set these environment variables in your Axxess control panel:

```
NODE_ENV=production
DATABASE_URL=your-database-connection-string
NEXT_PUBLIC_APP_URL=https://alldeals.yourdomain.com
PAYFAST_MERCHANT_ID=your-merchant-id
PAYFAST_MERCHANT_KEY=your-merchant-key
PAYFAST_PASSPHRASE=your-passphrase
JWT_SECRET=your-jwt-secret
NEXTAUTH_SECRET=your-nextauth-secret
```

### **File Permissions**
```bash
chmod -R 755 public/
chmod -R 644 .next/
chmod 600 .env.production
```

### **SSL Certificate**
- Usually handled automatically by Axxess
- Verify HTTPS is working: `https://alldeals.yourdomain.com`
- Update all URLs to use HTTPS

## 🧪 **Testing Your Deployment**

### **1. Basic Tests**
- [ ] Visit `https://alldeals.yourdomain.com`
- [ ] Homepage loads without errors
- [ ] Navigation works
- [ ] Images display correctly

### **2. E-commerce Tests**
- [ ] Browse products
- [ ] Search functionality
- [ ] User registration
- [ ] User login
- [ ] Add to cart
- [ ] Wishlist functionality
- [ ] Checkout process (test mode)

### **3. Admin Tests**
- [ ] Access admin panel: `/admin`
- [ ] Login with admin credentials
- [ ] View analytics dashboard
- [ ] Manage customers
- [ ] Manage orders
- [ ] Update settings

### **4. PayFast Integration**
- [ ] Test checkout with small amount
- [ ] Verify PayFast redirects work
- [ ] Check return URLs
- [ ] Confirm order creation

## 🚨 **Troubleshooting**

### **Common Issues:**

**"Database connection failed"**
- Check DATABASE_URL format
- Verify database credentials
- Ensure database exists

**"Module not found" errors**
- Run `npm install --production`
- Check Node.js version (18+)
- Verify all files uploaded

**PayFast errors**
- Verify merchant credentials
- Check return/notify URLs
- Test with sandbox first

**SSL/HTTPS issues**
- Contact Axxess support
- Verify domain DNS settings
- Check certificate installation

## 📞 **Support Contacts**

- **Axxess Hosting Support**: support@axxess.co.za
- **PayFast Support**: support@payfast.co.za
- **DNS/Domain Issues**: Your domain registrar

## 🎯 **Go-Live Checklist**

- [ ] All environment variables configured
- [ ] Database migrated successfully
- [ ] PayFast production account active
- [ ] SSL certificate working
- [ ] Domain/subdomain resolving
- [ ] All functionality tested
- [ ] Admin access confirmed
- [ ] Backup strategy in place

## 🔄 **Future Updates**

To update your live site:
1. Make changes locally
2. Test thoroughly
3. Run deployment script
4. Upload new files
5. Restart application if needed

---

**🎉 Your AllDeals store is ready to go live on Axxess hosting!**

Need help? Contact Axxess support or refer to their Node.js hosting documentation.
