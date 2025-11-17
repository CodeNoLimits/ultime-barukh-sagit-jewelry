import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { useTranslation } from '@/hooks/useTranslation';

export default function About() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <CartDrawer />

      {/* Hero Section */}
      <section className="pt-32 pb-20 lg:pt-40 lg:pb-28 bg-gray-50">
        <div className="container text-center">
          <h1 className="mb-6">{t('about.title')}</h1>
          <p className="text-xl lg:text-2xl font-light max-w-3xl mx-auto">
            {t('about.subtitle')}
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="section-spacing bg-white">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <p className="text-lg lg:text-xl font-light leading-relaxed text-center mb-20">
              {t('about.story')}
            </p>

            {/* Values Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
              {/* Craftsmanship */}
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-6 bg-gold/10 flex items-center justify-center">
                  <span className="text-4xl">✨</span>
                </div>
                <h3 className="text-xl lg:text-2xl font-serif font-light mb-4">
                  {t('about.craftsmanship')}
                </h3>
                <p className="text-muted-foreground font-light">
                  {t('about.craftsmanshipText')}
                </p>
              </div>

              {/* Heritage */}
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-6 bg-gold/10 flex items-center justify-center">
                  <span className="text-4xl">✡️</span>
                </div>
                <h3 className="text-xl lg:text-2xl font-serif font-light mb-4">
                  {t('about.heritage')}
                </h3>
                <p className="text-muted-foreground font-light">
                  {t('about.heritageText')}
                </p>
              </div>

              {/* Quality */}
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-6 bg-gold/10 flex items-center justify-center">
                  <span className="text-4xl">💎</span>
                </div>
                <h3 className="text-xl lg:text-2xl font-serif font-light mb-4">
                  {t('about.quality')}
                </h3>
                <p className="text-muted-foreground font-light">
                  {t('about.qualityText')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Image Section */}
      <section className="section-spacing-sm bg-gray-50">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            <div className="overflow-hidden aspect-[4/5]">
              <img
                src="/images/collection-1.jpg"
                alt="Artisanat"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="overflow-hidden aspect-[4/5]">
              <img
                src="/images/collection-2.jpg"
                alt="Bijoux"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
