import { Hero } from '@/components/hero'
import { FeaturedProducts } from '@/components/featured-products'
import { Categories } from '@/components/categories'

export default function Home() {
  return (
    <div className="space-y-8">
      <Hero />
      <Categories />
      <FeaturedProducts />
    </div>
  )
}
