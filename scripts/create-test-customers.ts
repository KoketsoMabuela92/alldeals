// Script to create test customers via the registration API
async function createTestCustomers() {
  const customers = [
    {
      firstName: 'Sarah',
      lastName: 'Johnson',
      email: 'sarah.johnson@example.com',
      password: 'password123',
      phone: '+27 21 555 1001',
      address: '456 Oak Street',
      city: 'Cape Town',
      country: 'South Africa',
      postalCode: '8002'
    },
    {
      firstName: 'David',
      lastName: 'Brown',
      email: 'david.brown@example.com',
      password: 'password123',
      phone: '+27 11 555 2002',
      address: '789 Pine Avenue',
      city: 'Johannesburg',
      country: 'South Africa',
      postalCode: '2001'
    },
    {
      firstName: 'Lisa',
      lastName: 'Davis',
      email: 'lisa.davis@example.com',
      password: 'password123',
      phone: '+27 31 555 3003',
      address: '321 Elm Road',
      city: 'Durban',
      country: 'South Africa',
      postalCode: '4001'
    },
    {
      firstName: 'Chris',
      lastName: 'Miller',
      email: 'chris.miller@example.com',
      password: 'password123',
      phone: '+27 12 555 4004',
      address: '654 Maple Drive',
      city: 'Pretoria',
      country: 'South Africa',
      postalCode: '0001'
    },
    {
      firstName: 'Emma',
      lastName: 'Garcia',
      email: 'emma.garcia@example.com',
      password: 'password123',
      phone: '+27 41 555 5005',
      address: '987 Cedar Lane',
      city: 'Port Elizabeth',
      country: 'South Africa',
      postalCode: '6001'
    }
  ]

  console.log('🧑‍💼 Creating test customers via registration API...')

  for (const customer of customers) {
    try {
      const response = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(customer)
      })

      const data = await response.json()

      if (response.ok) {
        console.log(`✅ Created customer: ${customer.firstName} ${customer.lastName} (${customer.email})`)
      } else {
        console.log(`❌ Failed to create ${customer.email}: ${data.error}`)
      }
    } catch (error) {
      console.log(`❌ Error creating ${customer.email}:`, error)
    }
  }

  console.log('🎉 Test customer creation completed!')
  console.log('📊 Check the admin customers page to see the new customers')
}

createTestCustomers()
