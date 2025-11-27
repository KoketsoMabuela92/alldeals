import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function quickSeed() {
  try {
    console.log('🚀 Quick seeding products and sample data...')

    // Check if categories exist, create if not
    let category = await prisma.category.findFirst({ where: { name: 'Electronics' } })
    if (!category) {
      category = await prisma.category.create({
        data: {
          name: 'Electronics',
          description: 'Electronic devices and gadgets'
        }
      })
    }

    // Create some basic products if none exist
    const existingProducts = await prisma.product.count()
    if (existingProducts === 0) {
      const products = await Promise.all([
        prisma.product.create({
          data: {
            name: 'Smartphone Pro Max',
            description: 'Latest smartphone with advanced features',
            price: 15999,
            originalPrice: 17999,
            sku: 'PHONE-001',
            stock: 25,
            categoryId: category.id,
            images: {
              create: [{
                url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9',
                altText: 'Smartphone',
                isPrimary: true,
                sortOrder: 0
              }]
            }
          }
        }),
        prisma.product.create({
          data: {
            name: 'Wireless Headphones',
            description: 'Premium noise-cancelling wireless headphones',
            price: 2999,
            originalPrice: 3499,
            sku: 'AUDIO-001',
            stock: 15,
            categoryId: category.id,
            images: {
              create: [{
                url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
                altText: 'Wireless Headphones',
                isPrimary: true,
                sortOrder: 0
              }]
            }
          }
        }),
        prisma.product.create({
          data: {
            name: 'Gaming Laptop',
            description: 'High-performance gaming laptop',
            price: 25999,
            originalPrice: 29999,
            sku: 'LAPTOP-001',
            stock: 8,
            categoryId: category.id,
            images: {
              create: [{
                url: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302',
                altText: 'Gaming Laptop',
                isPrimary: true,
                sortOrder: 0
              }]
            }
          }
        }),
        prisma.product.create({
          data: {
            name: 'Smart Watch',
            description: 'Fitness tracking smart watch',
            price: 4999,
            originalPrice: 5999,
            sku: 'WATCH-001',
            stock: 20,
            categoryId: category.id,
            images: {
              create: [{
                url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30',
                altText: 'Smart Watch',
                isPrimary: true,
                sortOrder: 0
              }]
            }
          }
        }),
        prisma.product.create({
          data: {
            name: 'Bluetooth Speaker',
            description: 'Portable wireless bluetooth speaker',
            price: 1299,
            originalPrice: 1599,
            sku: 'SPEAKER-001',
            stock: 30,
            categoryId: category.id,
            images: {
              create: [{
                url: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1',
                altText: 'Bluetooth Speaker',
                isPrimary: true,
                sortOrder: 0
              }]
            }
          }
        })
      ])
      console.log(`✅ Created ${products.length} sample products`)
    }

    // Now create customers and orders
    const customers = await Promise.all([
      prisma.user.upsert({
        where: { email: 'john.doe@example.com' },
        update: {},
        create: {
          email: 'john.doe@example.com',
          name: 'John Doe',
          phone: '+27 21 555 0001',
          password: 'hashedpassword123',
          isActive: true
        }
      }),
      prisma.user.upsert({
        where: { email: 'jane.smith@example.com' },
        update: {},
        create: {
          email: 'jane.smith@example.com',
          name: 'Jane Smith',
          phone: '+27 21 555 0002',
          password: 'hashedpassword123',
          isActive: true
        }
      }),
      prisma.user.upsert({
        where: { email: 'mike.wilson@example.com' },
        update: {},
        create: {
          email: 'mike.wilson@example.com',
          name: 'Mike Wilson',
          phone: '+27 21 555 0003',
          password: 'hashedpassword123',
          isActive: true
        }
      })
    ])

    console.log(`✅ Created/updated ${customers.length} customers`)

    // Create sample orders
    const products = await prisma.product.findMany({ take: 5 })
    const orderCount = await prisma.order.count()
    
    if (orderCount === 0) {
      for (let i = 0; i < 10; i++) {
        const customer = customers[Math.floor(Math.random() * customers.length)]
        const product = products[Math.floor(Math.random() * products.length)]
        const quantity = Math.floor(Math.random() * 3) + 1
        const subtotal = product.price * quantity
        const tax = subtotal * 0.15
        const shipping = subtotal > 500 ? 0 : 50
        const total = subtotal + tax + shipping

        await prisma.order.create({
          data: {
            orderNumber: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
            userId: customer.id,
            customerEmail: customer.email,
            customerPhone: customer.phone,
            subtotal,
            tax,
            shipping,
            total,
            status: ['pending', 'processing', 'shipped', 'delivered'][Math.floor(Math.random() * 4)],
            shippingAddress: '123 Sample Street, Cape Town, South Africa',
            billingAddress: '123 Sample Street, Cape Town, South Africa',
            createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
            items: {
              create: [{
                productId: product.id,
                name: product.name,
                sku: product.sku,
                quantity,
                price: product.price,
                total: product.price * quantity
              }]
            }
          }
        })
      }
      console.log('✅ Created 10 sample orders')
    }

    console.log('🎉 Quick seeding completed!')
    console.log('📊 Database now has sample data for testing admin pages')

  } catch (error) {
    console.error('❌ Error in quick seeding:', error)
  } finally {
    await prisma.$disconnect()
  }
}

quickSeed()
