import { useTranslation } from 'react-i18next';
import FeaturedProducts from '../components/FeaturedProducts';

function HomePage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen">
      <div className="relative">
        <div
          className="h-[540px] bg-cover bg-center flex items-center"
          style={{ backgroundImage: "url('/shiny-brown-wavy-hair.jpg')" }}
        >
          <div className="absolute inset-0 bg-black/30" aria-hidden></div>

          <div className="max-w-6xl mx-auto px-4 text-center text-white relative z-10">
            <h1 style={{color: 'white'}} className="text-5xl md:text-6xl font-heading font-bold mb-4 tracking-tight text-white">{t('home.welcome')}</h1>
            <p style={{color: 'white'}} className="text-lg opacity-95 mb-6 max-w-2xl mx-auto text-white">{t('home.subtitle')}</p>
            <div className="flex items-center justify-center gap-4">
              <button
                className="btn-pill"
                onClick={() => window.location.href = '/products'}
              >
                {t('home.shop_now')}
              </button>

              <button
                className="btn-pill btn-pill-outline"
                onClick={() => window.location.href = '/products?ordering=-created_at'}
              >
                New Arrivals
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="home-content-container">
        {/* Texture Gallery */}
        <section className="max-w-6xl mx-auto px-4 py-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-heading font-semibold">Texture Gallery</h2>
            <p className="text-sm text-[var(--text-muted)]">Explore high-definition close-ups & videos</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white rounded overflow-hidden shadow-sm">
              <div className="h-48 bg-cover bg-center" style={{backgroundImage: "url('/beautiful-shiny-brown-long-hair.jpg')"}}></div>
              <div className="p-4">
                <h3 className="font-semibold">Silky Straight</h3>
                <p className="text-sm text-[var(--text-muted)]">High-luster straight textures, shown up close.</p>
              </div>
            </div>

            <div className="bg-white rounded overflow-hidden shadow-sm">
              <div className="h-48 bg-cover bg-center" style={{backgroundImage: "url('/shiny-brown-wavy-hair.jpg')"}}></div>
              <div className="p-4">
                <h3 className="font-semibold">Body Wave</h3>
                <p className="text-sm text-[var(--text-muted)]">Soft waves with natural movement and shine.</p>
              </div>
            </div>

            <div className="bg-white rounded overflow-hidden shadow-sm">
              <div className="h-48 bg-cover bg-center" style={{backgroundImage: "url('/shiny-brown-wavy-hair.jpg')"}}></div>
              <div className="p-4">
                <h3 className="font-semibold">Kinky Curly</h3>
                <p className="text-sm text-[var(--text-muted)]">Close-up textures for full, voluminous looks.</p>
              </div>
            </div>
          </div>
        </section>

        <FeaturedProducts />
      </div>
    </div>
  );
}

export default HomePage;
