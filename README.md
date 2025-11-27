# AllDeals - Modern E-commerce Platform

A modern, responsive e-commerce platform built with Next.js 14, featuring electronics, homeware, and gadgets.

**🚀 Deployed on Vercel with full authentication protection for checkout and wishlist!**

## 🚀 Features

### Core Functionality
- **Product Catalog**: 1,500 products across 3 categories (500 each)
- **Advanced Search & Filtering**: Search by name, filter by category, price range, and sorting options
- **Shopping Cart**: Persistent cart with Zustand state management
- **Wishlist**: Save favorite products for later
- **Product Reviews**: Customer rating and review system
- **Responsive Design**: Mobile-first design that works on all devices

### E-commerce Features
- **Secure Payments**: Stripe integration for secure online payments
- **Order Tracking**: Track order status from processing to delivery
- **User Authentication**: NextAuth.js for secure user management
- **Real-time Updates**: Dynamic cart and wishlist counters

### Technical Features
- **Modern Stack**: Next.js 14, TypeScript, Tailwind CSS
- **Database**: SQLite with Prisma ORM
- **State Management**: Zustand for client-side state
- **UI Components**: Radix UI with custom styling
- **Icons**: Lucide React icons

## 🛠 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: SQLite + Prisma
- **Authentication**: NextAuth.js
- **Payments**: Stripe
- **State Management**: Zustand
- **UI Components**: Radix UI
- **Icons**: Lucide React

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd alldeals
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   # Database
   DATABASE_URL="file:./dev.db"

   # NextAuth
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-nextauth-secret-key-here"

   # Stripe
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_your_stripe_publishable_key_here"
   STRIPE_SECRET_KEY="sk_test_your_stripe_secret_key_here"
   STRIPE_WEBHOOK_SECRET="whsec_your_webhook_secret_here"
   ```

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   npm run db:seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🗂 Project Structure

```
alldeals/
├── app/                    # Next.js 14 App Router
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── cart/              # Shopping cart page
│   ├── categories/        # Category pages
│   ├── checkout/          # Checkout process
│   ├── products/          # Product pages
│   └── wishlist/          # Wishlist page
├── components/            # Reusable components
│   ├── ui/               # Base UI components
│   └── ...               # Feature components
├── lib/                  # Utilities and configurations
├── prisma/               # Database schema and seed
└── public/               # Static assets
```

## 🎯 Key Pages

- **Homepage** (`/`): Hero section, categories, featured products
- **Products** (`/products`): Full product catalog with filtering
- **Product Detail** (`/products/[id]`): Individual product pages with reviews
- **Categories** (`/categories/[category]`): Category-specific product listings
- **Cart** (`/cart`): Shopping cart management
- **Wishlist** (`/wishlist`): Saved products
- **Checkout** (`/checkout`): Secure payment process
- **Authentication** (`/auth/*`): Sign in/up pages

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:push` - Push database schema
- `npm run db:studio` - Open Prisma Studio
- `npm run db:generate` - Generate Prisma client
- `npm run db:seed` - Seed database with sample data

## 🎨 Design System

The project uses a consistent design system with:
- **Colors**: Blue and purple gradient branding
- **Typography**: Inter font family
- **Components**: Radix UI primitives with custom styling
- **Responsive**: Mobile-first approach with Tailwind breakpoints
- **Accessibility**: ARIA labels and keyboard navigation

## 🔒 Security Features

- **Secure Authentication**: NextAuth.js with credential provider
- **Payment Security**: Stripe's secure payment processing
- **Data Validation**: Server-side validation with Prisma
- **HTTPS**: SSL encryption for all data transmission

## 📱 Mobile Optimization

- Responsive design that works on all screen sizes
- Touch-friendly interface elements
- Optimized images and loading states
- Mobile navigation menu

## 🚀 Deployment

The application is ready for deployment on platforms like:
- Vercel (recommended for Next.js)
- Netlify
- Railway
- Any Node.js hosting provider

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, email support@alldeals.com or create an issue in the repository.

---

Built with ❤️ using modern web technologies.
