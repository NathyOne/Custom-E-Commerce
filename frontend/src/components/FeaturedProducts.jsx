import { useGetFeaturedProductsQuery } from '../features/api/apiSlice';
import ProductCard from './ProductCard';

function FeaturedProducts() {
  const { data: products, isLoading } = useGetFeaturedProductsQuery();

  if (isLoading) return <div className="text-center py-8">Loading Featured...</div>;
  if (!products?.length) return null;

  return (
    <section className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Featured Human Hair</h2>
        <div className="flex-1 ml-4 h-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

export default FeaturedProducts;
