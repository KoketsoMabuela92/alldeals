# 🚀 AllDeals Deployment Instructions

## Package Information
- **Package**: alldeals-production-20251127_143204.tar.gz
- **Created**: Thu Nov 27 14:32:05 SAST 2025
- **Type**: Built Application

## Axxess Hosting Deployment

### 1. Upload Package
- Extract alldeals-production-20251127_143204.tar.gz to your subdomain directory
- Ensure all files are in the correct location

### 2. Environment Setup
```bash
# Set these environment variables in Axxess control panel:
NODE_ENV=production
DATABASE_URL=your-database-connection-string
NEXT_PUBLIC_APP_URL=https://alldeals.yourdomain.com
PAYFAST_MERCHANT_ID=your-merchant-id
PAYFAST_MERCHANT_KEY=your-merchant-key
PAYFAST_PASSPHRASE=your-passphrase
JWT_SECRET=your-jwt-secret
NEXTAUTH_SECRET=your-nextauth-secret
```

### 3. Installation Commands
```bash
# Install dependencies
npm install --production

# Generate Prisma client
npx prisma generate

# Push database schema
npx prisma db push

# 


# Start application
npm start
```

### 4. Testing Checklist
- [ ] Homepage loads: https://alldeals.yourdomain.com
- [ ] User registration works
- [ ] Login/logout functionality
- [ ] Shopping cart operations
- [ ] Wishlist requires login
- [ ] Checkout requires login
- [ ] Admin panel accessible: /admin
- [ ] PayFast integration working

## Support
- Axxess Hosting: support@axxess.co.za
- PayFast: support@payfast.co.za

## Notes
✅ Application was built successfully
Ready for immediate deployment
