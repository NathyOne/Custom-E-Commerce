import { useTranslation } from 'react-i18next';
import FeaturedProducts from '../components/FeaturedProducts';
import './HomePage.css';

function HomePage() {
  const { t } = useTranslation();

  return (
    <div className="page home-page">
      <div className="hero-banner">
        <div className="hero-content">
          {/* Simulating a carousel slide content */}
          <h1>{t('home.welcome')}</h1>
          <p>{t('home.subtitle')}</p>
          <button className="cta-button" onClick={() => window.location.href='/products'}>
            {t('home.shop_now')}
          </button>
        </div>
      </div>

      <div className="home-content-container">
        {/* Category Cards imitating Amazon's layout */}
        <div className="category-cards">
          <div className="cat-card">
            <h2>Electronics</h2>
            <div className="cat-image electronic-bg"></div>
            <a href="/products?category=electronics">See more</a>
          </div>
          <div className="cat-card">
            <h2>Clothing</h2>
            <div className="cat-image clothing-bg"></div>
            <a href="/products?category=clothing">See more</a>
          </div>
          <div className="cat-card">
            <h2>New Arrivals</h2>
            <div className="cat-image new-bg"></div>
            <a href="/products?ordering=-created_at">See more</a>
          </div>
          <div className="cat-card sign-in-card">
            <h2>Sign in for the best experience</h2>
            <button className="signin-btn">Sign in</button>
          </div>
        </div>

        <FeaturedProducts />
      </div>
    </div>
  );
}

export default HomePage;
