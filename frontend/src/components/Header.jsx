import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { selectCartCount } from '../features/cart/cartSlice';
import './Header.css';

function Header() {
  const { t, i18n } = useTranslation();
  const cartCount = useSelector(selectCartCount);

  const changeLanguage = (e) => {
    i18n.changeLanguage(e.target.value);
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <span className="logo-icon">🚀</span>
          <span className="logo-text">ShopHub</span>
        </Link>
        
        <nav className="nav">
          <Link to="/" className="nav-link">{t('header.home')}</Link>
          <Link to="/products" className="nav-link">{t('header.products')}</Link>
        </nav>

        <div className="header-actions">
          <select 
            className="lang-select" 
            onChange={changeLanguage} 
            value={i18n.language}
          >
            <option value="en">English</option>
            <option value="am">አማርኛ</option>
            <option value="om">Afaan Oromoo</option>
            <option value="ti">ትግርኛ</option>
          </select>

          <Link to="/cart" className="cart-link">
            <span className="cart-icon">🛒</span>
            {cartCount > 0 && (
              <span className="cart-badge">{cartCount}</span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Header;
