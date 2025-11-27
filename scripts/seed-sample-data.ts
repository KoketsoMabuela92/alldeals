import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function seedSampleData() {
  try {
    console.log('🌱 Seeding sample data...')

    // Create sample customers
    const customers = await Promise.all([
      prisma.user.create({
        data: {
          email: 'john.doe@example.com',
          name: 'John Doe',
          firstName: 'John',
          lastName: 'Doe',
          phone: '+27 21 555 0001',
          password: 'hashedpassword123',
          address: '123 Main Street',
          city: 'Cape Town',
          country: 'South Africa',
          postalCode: '8001',
          isActive: true,
          lastLogin: new Date()
        }
      }),
      prisma.user.create({
        data: {
          email: 'jane.smith@example.com',
          name: 'Jane Smith',
          firstName: 'Jane',
          lastName: 'Smith',
          phone: '+27 21 555 0002',
          password: 'hashedpassword123',
          address: '456 Oak Avenue',
          city: 'Johannesburg',
          country: 'South Africa',
          postalCode: '2001',
          isActive: true,
          lastLogin: new Date(Date.now() - 86400000) // Yesterday
        }
      }),
      prisma.user.create({
        data: {
          email: 'mike.wilson@example.com',
          name: 'Mike Wilson',
          firstName: 'Mike',
          lastName: 'Wilson',
          phone: '+27 21 555 0003',
          password: 'hashedpassword123',
          address: '789 Pine Road',
          city: 'Durban',
          country: 'South Africa',
          postalCode: '4001',
          isActive: true,
          lastLogin: new Date(Date.now() - 172800000) // 2 days ago
        }
      })
    ])

    console.log(`✅ Created ${customers.length} sample customers`)

    // Get some existing products
    const products = await prisma.product.findMany({ take: 5 })
    
    if (products.length === 0) {
      console.log('⚠️ No products found. Please run the product seeder first.')
      return
    }

    // Create sample orders
    const orders = []
    
    for (let i = 0; i < 15; i++) {
      const customer = customers[Math.floor(Math.random() * customers.length)]
      const orderProducts = products.slice(0, Math.floor(Math.random() * 3) + 1) // 1-3 products per order
      
      const orderItems = orderProducts.map(product => ({
        productId: product.id,
        name: product.name,
        sku: product.sku || `SKU-${product.id}`,
        quantity: Math.floor(Math.random() * 3) + 1,
        price: product.price,
        total: product.price * (Math.floor(Math.random() * 3) + 1),
        image: product.images?.[0]?.url || null
      }))

      const subtotal = orderItems.reduce((sum, item) => sum + item.total, 0)
      const tax = subtotal * 0.15
      const shipping = subtotal > 500 ? 0 : 50
      const total = subtotal + tax + shipping

      const statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']
      const paymentStatuses = ['pending', 'paid', 'failed']
      const paymentMethods = ['card', 'payfast', 'eft']
      
      const order = await prisma.order.create({
        data: {
          orderNumber: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
          userId: customer.id,
          customerEmail: customer.email,
          customerPhone: customer.phone,
          subtotal,
          tax,
          shipping,
          total,
          status: statuses[Math.floor(Math.random() * statuses.length)],
          paymentStatus: paymentStatuses[Math.floor(Math.random() * paymentStatuses.length)],
          paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
          shippingAddress: `${customer.address}, ${customer.city}, ${customer.country}`,
          billingAddress: `${customer.address}, ${customer.city}, ${customer.country}`,
          trackingNumber: Math.random() > 0.5 ? `TRK${Math.random().toString(36).substr(2, 8).toUpperCase()}` : null,
          notes: Math.random() > 0.7 ? 'Customer requested express delivery' : null,
          createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Random date within last 30 days
          items: {
            create: orderItems
          }
        }
      })
      
      orders.push(order)
    }

    console.log(`✅ Created ${orders.length} sample orders`)

    // Create some reviews
    for (let i = 0; i < 20; i++) {
      const customer = customers[Math.floor(Math.random() * customers.length)]
      const product = products[Math.floor(Math.random() * products.length)]
      
      try {
        await prisma.review.create({
          data: {
            userId: customer.id,
            productId: product.id,
            rating: Math.floor(Math.random() * 5) + 1,
            comment: [
              'Great product, highly recommended!',
              'Good value for money.',
              'Fast delivery and excellent quality.',
              'Exactly what I was looking for.',
              'Could be better, but overall satisfied.',
              'Amazing quality and great customer service!',
              'Perfect for my needs.',
              'Good product but delivery was slow.'
            ][Math.floor(Math.random() * 8)],
            createdAt: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000) // Random date within last 60 days
          }
        })
      } catch (error) {
        // Skip if review already exists for this user-product combination
      }
    }

    console.log('✅ Created sample reviews')

    // Update customer last login dates
    for (const customer of customers) {
      await prisma.user.update({
        where: { id: customer.id },
        data: {
          lastLogin: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000) // Random within last week
        }
      })
    }

    console.log('✅ Sample data seeding completed!')
    console.log('')
    console.log('📊 Summary:')
    console.log(`   - ${customers.length} customers`)
    console.log(`   - ${orders.length} orders`)
    console.log(`   - Reviews for various products`)
    console.log('')
    console.log('🎯 Now the admin pages will show real data instead of hardcoded values!')

  } catch (error) {
    console.error('❌ Error seeding sample data:', error)
  } finally {
    await prisma.$disconnect()
  }
}

seedSampleData()
