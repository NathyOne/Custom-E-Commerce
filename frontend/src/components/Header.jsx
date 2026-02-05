import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { selectCartCount } from '../features/cart/cartSlice';

function Header() {
  const { t, i18n } = useTranslation();
  const cartCount = useSelector(selectCartCount);

  const changeLanguage = (e) => {
    i18n.changeLanguage(e.target.value);
  };

  return (
    <header className="bg-[var(--obsidian)] text-[var(--nude)] sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 text-2xl font-heading font-semibold">
          <span className="text-[var(--champagne)]">SilkRoot</span>
        </Link>

        <nav className="hidden md:flex gap-6 text-sm">
          <Link to="/" style={{color:'white'}} className="hover:underline text-white">{t('header.home')}</Link>
          <Link to="/products"style={{color:'white'}}  className="hover:underline text-white">{t('header.products')}</Link>
        </nav>

        <div className="flex items-center gap-4">
          <select
            className="bg-[var(--nude)] text-sm text-[var(--obsidian)] rounded px-2 py-1 ring-0 focus:outline-none"
            onChange={changeLanguage}
            value={i18n.language}
          >
            <option value="en">English</option>
            <option value="am">አማርኛ</option>
            <option value="om">Afaan Oromoo</option>
            <option value="ti">ትግርኛ</option>
          </select>

          <Link to="/cart" className="relative text-[var(--nude)]">
            <span className="text-2xl">🛒</span>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-[var(--champagne)] text-[var(--obsidian)] text-xs rounded-full w-5 h-5 flex items-center justify-center">{cartCount}</span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Header;
