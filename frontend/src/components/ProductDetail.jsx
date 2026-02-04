import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useGetProductQuery } from '../features/api/apiSlice';
import { addToCart } from '../features/cart/cartSlice';
import ProductCard from './ProductCard';
import './ProductDetail.css';

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

  return (
    <div className="product-detail-container">
      <div className="product-detail-hero">
        <div className="product-detail-image-box">
          {product.image ? (
            <img src={product.image} alt={product.name} />
          ) : (
            <div className="detail-placeholder">📦</div>
          )}
        </div>
        
        <div className="product-detail-info">
          <div className="detail-header">
            <span className="detail-category">{product.category_name}</span>
            <h1>{product.name}</h1>
            <div className="detail-price-status">
              <span className="detail-price">{formatPrice(product.price)}</span>
              {product.in_stock ? (
                <span className="status-badge instock">In Stock</span>
              ) : (
                <span className="status-badge outstock">{t('products.out_of_stock')}</span>
              )}
            </div>
          </div>

          <div className="detail-description">
            <h3>Description</h3>
            <p>{product.description}</p>
          </div>

          <div className="detail-actions">
            <div className="quantity-selector">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                -
              </button>
              <span>{quantity}</span>
              <button 
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                disabled={quantity >= product.stock}
              >
                +
              </button>
            </div>

            <div className="action-buttons">
              <button 
                className="add-cart-btn"
                onClick={handleAddToCart}
                disabled={!product.in_stock}
              >
                {t('products.add_to_cart')}
              </button>
              <button 
                className="buy-now-btn"
                onClick={handleBuyNow}
                disabled={!product.in_stock}
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {product.related_products?.length > 0 && (
        <div className="related-products-section">
          <h2>Related Products</h2>
          <div className="products-grid">
            {product.related_products.map(related => (
              <ProductCard key={related.id} product={related} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductDetail;
