export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Shipping Information</h1>
          
          <div className="bg-white shadow rounded-lg p-6 space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Shipping Options</h2>
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h3 className="font-medium text-gray-900">Standard Shipping</h3>
                  <p className="text-gray-600">R99 - Delivery within 3-5 business days</p>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <h3 className="font-medium text-gray-900">Free Shipping</h3>
                  <p className="text-gray-600">Free on orders over R500 - Delivery within 3-5 business days</p>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Delivery Areas</h2>
              <p className="text-gray-600">
                We currently deliver to all major cities in South Africa including Cape Town, 
                Johannesburg, Durban, and Pretoria. Rural area deliveries may take additional time.
              </p>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Processing Time</h2>
              <p className="text-gray-600">
                Orders are processed within 1-2 business days. You will receive a tracking 
                number once your order has been shipped.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
