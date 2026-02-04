import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useGetProductQuery } from '../features/api/apiSlice';
import { addToCart } from '../features/cart/cartSlice';
import ProductCard from './ProductCard';

function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [quantity, setQuantity] = useState(1);
  
  const { data: product, isLoading, error } = useGetProductQuery(slug);

  if (isLoading) return <div className="loading-spinner">Loading...</div>;
  if (error) return <div className="error-message">Product not found</div>;

  const handleAddToCart = () => {
    dispatch(addToCart({
      id: product.id,
      name: product.name,
      price: parseFloat(product.price),
      image: product.image,
      slug: product.slug,
      quantity
    }));
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/cart');
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-ET', {
      style: 'currency',
      currency: 'ETB',
    }).format(price);
  };

  const getTags = (p) => {
    const tags = [];
    const text = `${p.name} ${p.description || ''}`.toLowerCase();
    if (text.includes('remy')) tags.push({label: '100% Remy', icon: 'badge'});
    if (text.includes('wig')) tags.push({label: 'Wig', icon: 'wig'});
    if (text.includes('bundle')) tags.push({label: 'Bundle', icon: 'bundle'});
    if (text.includes('closure')) tags.push({label: 'Closure', icon: 'closure'});
    if (text.includes('frontal') || text.includes('fronta')) tags.push({label: 'Frontal', icon: 'closure'});
    if (text.includes('lace')) tags.push({label: 'Lace', icon: 'feather'});
    if (text.includes('heat resist') || text.includes('heat-resistant')) tags.push({label: 'Heat Resistant', icon: 'flame'});
    const lengthMatch = text.match(/(\d{2})\s?(in|inch|")/);
    if (lengthMatch) tags.push({label: `${lengthMatch[1]}in`, icon: 'ruler'});
    const densityMatch = text.match(/(\d{2,3})\%?\s*density/);
    if (densityMatch) tags.push({label: `${densityMatch[1]}% density`, icon: 'badge'});
    return tags.slice(0, 6);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white rounded shadow-sm overflow-hidden">
            {product.image ? (
              <img src={product.image} alt={product.name} className="w-full h-96 object-cover" />
            ) : (
              <div className="w-full h-96 flex items-center justify-center bg-gray-100">📦</div>
            )}
          </div>
        </div>

        <div className="lg:col-span-2">
          <div>
            <span className="text-sm text-gray-500">{product.category_name}</span>
            <h1 className="mt-2 text-2xl font-bold">{product.name}</h1>
            <div className="mt-3 flex items-center gap-4">
              <span className="text-2xl font-semibold">{formatPrice(product.price)}</span>
              {product.in_stock ? (
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded">In Stock</span>
              ) : (
                <span className="px-2 py-1 bg-red-100 text-red-800 rounded">{t('products.out_of_stock')}</span>
              )}
            </div>

            <div className="mt-6">
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-gray-700">{product.description}</p>
            </div>

            <div className="mt-6">
              <h3 className="font-semibold mb-2">Specifications</h3>
              <div className="text-gray-700">
                <div className="flex flex-wrap gap-3">
                  {getTags(product).map(tag => (
                    <span key={tag.label} className="text-sm bg-gray-100 px-2 py-1 rounded flex items-center">
                      {tag.icon === 'flame' && (<svg className="w-4 h-4 inline-block mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2s4 4 4 8a4 4 0 0 1-8 0c0-4 4-8 4-8z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>)}
                      {tag.icon === 'feather' && (<svg className="w-4 h-4 inline-block mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 4c-2 2-7 7-12 12-2 2-4 3-4 3s1-2 3-4c5-5 10-10 12-12z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>)}
                      <span>{tag.label}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-4">
              <div className="flex items-center gap-3">
                <button className="px-3 py-1 border rounded" onClick={() => setQuantity(Math.max(1, quantity - 1))} disabled={quantity <= 1}>-</button>
                <span>{quantity}</span>
                <button className="px-3 py-1 border rounded" onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} disabled={quantity >= product.stock}>+</button>
              </div>

              <div className="flex items-center gap-3">
                <button className="bg-[var(--accent-color)] text-black font-semibold px-4 py-2 rounded" onClick={handleAddToCart} disabled={!product.in_stock}>{t('products.add_to_cart')}</button>
                <button className="bg-[var(--button-secondary)] text-white font-semibold px-4 py-2 rounded" onClick={handleBuyNow} disabled={!product.in_stock}>Buy Now</button>
              </div>
            </div>
          </div>

          {product.related_products?.length > 0 && (
            <div className="mt-12">
              <h2 className="text-xl font-semibold mb-4">Related Products</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {product.related_products.map(related => (
                  <ProductCard key={related.id} product={related} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
