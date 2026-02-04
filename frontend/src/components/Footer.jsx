import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './Footer.css';

function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>ShopHub</h3>
          <p>{t('home.subtitle')}</p>
        </div>
        
        <div className="footer-section">
          <h4>{t('header.products')}</h4>
          <Link to="/products?category=electronics">Electronics</Link>
          <Link to="/products?category=clothing">Clothing</Link>
          <Link to="/products">All Products</Link>
        </div>

        <div className="footer-section">
          <h4>Contact</h4>
          <p>Email: nathanielabebe32@gmail.com</p>
          <p>Phone: 0983315117</p>
        </div>
        
        <div className="footer-section">
          <h4>Connect</h4>
          <div className="social-links">
            <a href="https://t.me/nty3697" target="_blank" rel="noopener noreferrer">Telegram (@nty3697)</a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {year} ShopHub. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
