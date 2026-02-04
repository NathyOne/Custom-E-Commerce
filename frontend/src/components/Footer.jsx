import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[var(--obsidian)] text-[var(--nude)] py-12">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-6">        <div>
          <h3 className="text-lg font-heading text-[var(--champagne)]">SilkRoot</h3>
          <p className="text-sm mt-2 text-[var(--text-muted)]">{t('home.subtitle')}</p>
        </div>

        <div>
          <h4 className="font-semibold mb-2">{t('header.products')}</h4>
          <div className="flex flex-col gap-1 text-sm">
            <Link to="/products?category=wigs" className="hover:underline">Wigs</Link>
            <Link to="/products?category=bundles" className="hover:underline">Bundles</Link>
            <Link to="/products" className="hover:underline">All Products</Link>
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Contact</h4>
          <p className="text-sm">Email: nathanielabebe32@gmail.com</p>
          <p className="text-sm">Phone: 0983315117</p>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Connect</h4>
          <div className="text-sm">
            <a href="https://t.me/nty3697" target="_blank" rel="noopener noreferrer" className="hover:underline">Telegram (@nty3697)</a>
          </div>
        </div>
      </div>

      <div className="border-t border-[rgba(255,255,255,0.06)] mt-8 pt-4">
        <div className="max-w-6xl mx-auto px-4 text-sm text-[var(--text-muted)]">&copy; {year} SilkRoot. All rights reserved.</div>
      </div>
    </footer>
  );
}

export default Footer;
