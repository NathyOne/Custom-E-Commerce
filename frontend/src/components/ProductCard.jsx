import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { addToCart } from '../features/cart/cartSlice';

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
    return tags.slice(0, 4);
  };

  return (
    <Link to={`/products/${product.slug}`} className="block bg-slate-50 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transform transition overflow-hidden">
      <div className="relative">
        {product.image ? (
          <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
        ) : (
          <div className="w-full h-48 flex items-center justify-center bg-gray-100">📦</div>
        )}
        {product.is_featured && <span className="absolute top-2 left-2 bg-[var(--accent-color)] text-white text-xs font-semibold px-2 py-1 rounded">Featured</span>}
        {!product.in_stock && <span className="absolute top-2 right-2 bg-gray-600 text-white text-xs px-2 py-1 rounded">{t('products.out_of_stock')}</span>}
      </div>
      <div className="p-4">
        <span className="text-sm text-[var(--text-light)]">{product.category_name}</span>
        <h3 className="mt-1 text-lg font-semibold text-[var(--text-dark)]">{product.name}</h3>
        <div className="mt-2 flex flex-wrap gap-2">
          {getTags(product).map(tag => (
            <span key={tag.label} className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-700 flex items-center gap-2">
              {/* Inline icon */}
              {tag.icon === 'flame' && (<svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2s4 4 4 8a4 4 0 0 1-8 0c0-4 4-8 4-8z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>)}
              {tag.icon === 'feather' && (<svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 4c-2 2-7 7-12 12-2 2-4 3-4 3s1-2 3-4c5-5 10-10 12-12z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>)}
              <span>{tag.label}</span>
            </span>
          ))}
        </div>
        <p className="mt-2 text-lg font-bold">{formatPrice(product.price)}</p>
        <button 
          className="mt-3 w-full bg-[var(--button-primary)] hover:bg-[var(--button-hover)] text-white font-semibold py-2 rounded-full disabled:opacity-50"
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
