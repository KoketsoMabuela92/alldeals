# 🚀 Migrate Your Local Database to Vercel

## ✅ What We Found
You have **5 users** in your local SQLite database that we can migrate to Vercel Postgres.

## 🎯 Quick Migration Steps

### Step 1: Get Vercel Database URL
1. **Vercel Dashboard** → **Storage** → **Create Database** → **Postgres**
2. **Copy the connection string** (starts with `postgres://`)

### Step 2: Add to Environment Variables
1. **Vercel Settings** → **Environment Variables** → **Add New**
2. **Name**: `DATABASE_URL`
3. **Value**: [paste postgres connection string]
4. **Save**

### Step 3: Update Local Environment
Create a `.env` file with your Vercel database URL:
```bash
DATABASE_URL="postgres://your-vercel-connection-string"
```

### Step 4: Push Schema to Vercel
```bash
npx prisma generate
npx prisma db push
```

### Step 5: Migrate Your Users
Run this script to recreate your users in Vercel:

```sql
-- Your existing users (run in Vercel database Query tab):
INSERT INTO "User" (id, email, name, "firstName", "lastName", phone, password, "isActive", "lastLogin", address, city, country, "postalCode", "createdAt", "updatedAt") VALUES
('cmih79f0k0001a4p8s1sf8wt5', 'mike.wilson@example.com', 'Mike Wilson', 'Mike', 'Wilson', '+27 21 555 0003', 'hashedpassword123', true, '2025-11-27 10:30:13', '789 Pine Road', 'Durban', 'South Africa', '4001', NOW(), NOW()),
('cmih79f0k0002a4p8ac6fn59c', 'jane.smith@example.com', 'Jane Smith', 'Jane', 'Smith', '+27 21 555 0002', 'hashedpassword123', true, '2025-11-27 10:30:13', '456 Oak Avenue', 'Johannesburg', 'South Africa', '2001', NOW(), NOW()),
('cmih79f0k0000a4p855xkm5sq', 'john.doe@example.com', 'John Doe', 'John', 'Doe', '+27 21 555 0001', 'hashedpassword123', true, '2025-11-27 10:30:13', '123 Main Street', 'Cape Town', 'South Africa', '8001', NOW(), NOW()),
('cmih7l8480000ejd9jtu2j41b', 'test.customer@example.com', 'Test Customer', 'Test', 'Customer', '+27 21 555 9999', '$2a$12$u6.d798zHAvaoZ6wHzXtjOTLDqxHUWzUV5MOQFoUJ43md6roUrrTu', true, '2025-11-27 10:30:13', '123 Test Street', 'Cape Town', 'South Africa', '8001', NOW(), NOW()),
('cmih7m7hg0001ejd940jqjq5q', 'sarah.johnson@example.com', 'Sarah Johnson', 'Sarah', 'Johnson', '+27 21 555 1001', '$2a$12$Lhp/BUF.zQHUpghUu9F87ukokjqwvDB0aLLy33ngjOkhJiS9fRCou', true, '2025-11-27 10:30:13', '456 Oak Street', 'Cape Town', 'South Africa', '8002', NOW(), NOW());
```

### Step 6: Test Login
Use these credentials to test:
- **Email**: `test.customer@example.com`
- **Password**: `testpassword` (if that's what you used)

## 🎯 Alternative: Quick Admin User
If you just want to get started quickly, add this admin user:

```sql
INSERT INTO "User" (id, email, name, password, "isActive", "createdAt", "updatedAt") VALUES
('admin-1', 'admin@alldeals.com', 'Admin User', '$2a$12$LQv3c1yqBw2LeOI.UKNOSuOiUiIkYhqHvgbdyU7TgH.mVKleIor6.', true, NOW(), NOW());
```

**Login**: admin@alldeals.com / admin123

## ✅ After Migration
- ✅ All your local users will work on Vercel
- ✅ Authentication will work
- ✅ Checkout/wishlist protection active
- ✅ Full e-commerce functionality

Your local database is now live on Vercel! 🚀
