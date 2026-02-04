import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { addToCart } from '../features/cart/cartSlice';
import './ProductCard.css';

function ProductCard({ product }) {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const handleAddToCart = (e) => {
    e.preventDefault();
    dispatch(addToCart({
      id: product.id,
      name: product.name,
      price: parseFloat(product.price),
      image: product.image,
      slug: product.slug,
    }));
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-ET', {
      style: 'currency',
      currency: 'ETB',
    }).format(price);
  };

  return (
    <Link to={`/products/${product.slug}`} className="product-card">
      <div className="product-image-container">
        {product.image ? (
          <img src={product.image} alt={product.name} className="product-image" />
        ) : (
          <div className="product-placeholder">📦</div>
        )}
        {product.is_featured && <span className="featured-badge">Featured</span>}
        {!product.in_stock && <span className="out-of-stock-badge">{t('products.out_of_stock')}</span>}
      </div>
      <div className="product-info">
        <span className="product-category">{product.category_name}</span>
        <h3 className="product-name">{product.name}</h3>
        <p className="product-price">{formatPrice(product.price)}</p>
        <button 
          className="add-to-cart-btn"
          onClick={handleAddToCart}
          disabled={!product.in_stock}
        >
          {product.in_stock ? t('products.add_to_cart') : t('products.out_of_stock')}
        </button>
      </div>
    </Link>
  );
}

export default ProductCard;
