import { prisma } from '@/lib/prisma'

export default async function TestElectronicsPage() {
  const category = await prisma.category.findFirst({
    where: {
      name: 'Electronics'
    }
  })

  const products = await prisma.product.findMany({
    where: {
      category: {
        name: 'Electronics'
      }
    },
    include: {
      category: true
    },
    take: 10
  })

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Electronics Test Page</h1>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Category Info:</h2>
        {category ? (
          <div className="bg-green-100 p-4 rounded">
            <p><strong>Name:</strong> {category.name}</p>
            <p><strong>ID:</strong> {category.id}</p>
            <p><strong>Description:</strong> {category.description}</p>
          </div>
        ) : (
          <div className="bg-red-100 p-4 rounded">
            <p>Electronics category not found!</p>
          </div>
        )}
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">First 10 Products:</h2>
        {products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {products.map((product) => (
              <div key={product.id} className="bg-blue-100 p-4 rounded">
                <h3 className="font-semibold">{product.name}</h3>
                <p>Price: ${product.price}</p>
                <p>Category: {product.category.name}</p>
                <p>Stock: {product.stock}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-red-100 p-4 rounded">
            <p>No electronics products found!</p>
          </div>
        )}
      </div>
    </div>
  )
}
