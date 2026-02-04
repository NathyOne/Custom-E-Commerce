import { useGetFeaturedProductsQuery } from '../features/api/apiSlice';
import ProductCard from './ProductCard';
import './FeaturedProducts.css';

function FeaturedProducts() {
  const { data: products, isLoading } = useGetFeaturedProductsQuery();

  if (isLoading) return <div className="loading-skeleton">Loading Featured...</div>;
  if (!products?.length) return null;

  return (
    <section className="featured-section">
      <div className="section-header">
        <h2>Featured Drops</h2>
        <div className="header-line"></div>
      </div>
      
      <div className="featured-grid">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

export default FeaturedProducts;
