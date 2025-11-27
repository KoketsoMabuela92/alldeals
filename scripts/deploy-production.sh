#!/bin/bash

# AllDeals Production Deployment Script
# This script prepares the application for production deployment

echo "🚀 Starting AllDeals Production Deployment Preparation..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    print_error "Node.js version 18+ is required. Current version: $(node --version)"
    exit 1
fi

print_success "Node.js version check passed: $(node --version)"

# Step 1: Clean previous builds
print_status "Cleaning previous builds..."
rm -rf .next
rm -rf out
rm -rf node_modules/.cache
print_success "Cleaned previous builds"

# Step 2: Install dependencies
print_status "Installing production dependencies..."
npm ci --only=production
if [ $? -ne 0 ]; then
    print_error "Failed to install dependencies"
    exit 1
fi
print_success "Dependencies installed"

# Step 3: Generate Prisma client
print_status "Generating Prisma client..."
npx prisma generate
if [ $? -ne 0 ]; then
    print_error "Failed to generate Prisma client"
    exit 1
fi
print_success "Prisma client generated"

# Step 4: Build application
print_status "Building application for production..."
NODE_ENV=production npm run build
if [ $? -ne 0 ]; then
    print_error "Build failed"
    exit 1
fi
print_success "Application built successfully"

# Step 5: Create deployment package
print_status "Creating deployment package..."
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
PACKAGE_NAME="alldeals-deployment-${TIMESTAMP}.tar.gz"

tar -czf "$PACKAGE_NAME" \
    .next \
    public \
    prisma \
    package.json \
    package-lock.json \
    next.config.js \
    .env.production \
    --exclude=node_modules \
    --exclude=.git \
    --exclude=.env.local \
    --exclude=.env.development

if [ $? -eq 0 ]; then
    print_success "Deployment package created: $PACKAGE_NAME"
else
    print_error "Failed to create deployment package"
    exit 1
fi

# Step 6: Generate deployment checklist
print_status "Generating deployment checklist..."
cat > deployment-checklist.md << EOF
# 📋 AllDeals Deployment Checklist

## Package Information
- **Package**: $PACKAGE_NAME
- **Created**: $(date)
- **Node.js Version**: $(node --version)
- **Next.js Build**: ✅ Completed

## Pre-Upload Checklist
- [ ] Update .env.production with actual values
- [ ] Configure production database
- [ ] Set up PayFast production account
- [ ] Configure subdomain DNS
- [ ] Prepare SSL certificate

## Upload Instructions
1. Extract $PACKAGE_NAME to your hosting directory
2. Set environment variables in hosting control panel
3. Run: npm install --production
4. Run: npx prisma db push
5. Start application: npm start

## Post-Deployment Testing
- [ ] Homepage loads
- [ ] User registration/login
- [ ] Product browsing
- [ ] Shopping cart
- [ ] Checkout process
- [ ] Admin panel access
- [ ] PayFast integration

## Support
- Hosting: Axxess Support
- PayFast: support@payfast.co.za
- Application: Your contact info
EOF

print_success "Deployment checklist created: deployment-checklist.md"

# Step 7: Display summary
echo ""
echo "🎉 Production deployment preparation completed!"
echo ""
echo "📦 Deployment Package: $PACKAGE_NAME"
echo "📋 Checklist: deployment-checklist.md"
echo ""
echo "Next steps:"
echo "1. Update .env.production with your actual values"
echo "2. Upload $PACKAGE_NAME to your Axxess hosting"
echo "3. Follow the deployment checklist"
echo ""
print_warning "Remember to test thoroughly before going live!"
echo ""
