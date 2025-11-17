import { Link } from 'wouter';
import { ChevronDown } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ProductCard } from '@/components/product/ProductCard';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { useTranslation } from '@/hooks/useTranslation';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';

export default function Home() {
  const { t, locale } = useTranslation();
  
  // Fetch featured products
  const { data: featuredProducts, isLoading: loadingFeatured } = trpc.products.getFeatured.useQuery({
    limit: 8,
  });

  // Parse images from JSON string
  const parseImages = (imagesJson: string): string[] => {
    try {
      return JSON.parse(imagesJson);
    } catch {
      return [];
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <CartDrawer />

      {/* Hero Section - 100vh */}
      <section className="relative h-screen flex items-center justify-center">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(/images/hero-bg.jpg)',
          }}
        />
        
        {/* Subtle Overlay - 20% max */}
        <div className="absolute inset-0 overlay-subtle" />

        {/* Content */}
        <div className="relative z-10 container text-center text-white">
          <p className="text-sm md:text-base text-uppercase-spaced mb-8 tracking-[0.3em]">
            {t('hero.subtitle')}
          </p>
          <h1 className="mb-12">
            {t('hero.title')}
          </h1>
          <p className="text-lg md:text-xl font-light max-w-2xl mx-auto mb-16 leading-relaxed">
            {t('hero.description')}
          </p>
          <Link href="/collections">
            <a>
              <Button className="btn-premium-gold">
                {t('hero.cta')}
              </Button>
            </a>
          </Link>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-8 h-8 text-white/80" />
        </div>
      </section>

      {/* Collections Section */}
      <section className="section-spacing bg-white">
        <div className="container">
          <div className="text-center mb-20 lg:mb-28">
            <h2 className="mb-6">{t('home.collectionsTitle')}</h2>
            <p className="text-lg text-muted-foreground font-light max-w-2xl mx-auto">
              {t('home.collectionsSubtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-12 lg:gap-16">
            {/* Collection 1 - Necklaces */}
            <Link href="/collections?category=necklaces">
              <a className="group block">
                <div className="overflow-hidden aspect-[4/5] bg-gray-50 mb-8 relative">
                  <img
                    src="/images/collection-1.jpg"
                    alt="Colliers"
                    className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-fast" />
                </div>
                <h3 className="text-center font-serif text-2xl lg:text-3xl font-light group-hover:text-gold transition-fast">
                  {t('collections.necklaces')}
                </h3>
              </a>
            </Link>

            {/* Collection 2 - Rings */}
            <Link href="/collections?category=rings">
              <a className="group block">
                <div className="overflow-hidden aspect-[4/5] bg-gray-50 mb-8 relative">
                  <img
                    src="/images/collection-2.jpg"
                    alt="Bagues"
                    className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-fast" />
                </div>
                <h3 className="text-center font-serif text-2xl lg:text-3xl font-light group-hover:text-gold transition-fast">
                  {t('collections.rings')}
                </h3>
              </a>
            </Link>

            {/* Collection 3 - Earrings */}
            <Link href="/collections?category=earrings">
              <a className="group block">
                <div className="overflow-hidden aspect-[4/5] bg-gray-50 mb-8 relative">
                  <img
                    src="/images/collection-3.jpg"
                    alt="Boucles d'oreilles"
                    className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-fast" />
                </div>
                <h3 className="text-center font-serif text-2xl lg:text-3xl font-light group-hover:text-gold transition-fast">
                  {t('collections.earrings')}
                </h3>
              </a>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="section-spacing bg-gray-50">
        <div className="container">
          <div className="text-center mb-20 lg:mb-28">
            <h2 className="mb-6">{t('home.featuredTitle')}</h2>
            <p className="text-lg text-muted-foreground font-light max-w-2xl mx-auto">
              {t('home.featuredSubtitle')}
            </p>
          </div>

          {loadingFeatured ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground">{t('common.loading')}</p>
            </div>
          ) : featuredProducts && featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 md:gap-12 lg:gap-16">
              {featuredProducts.map((product) => {
                const images = parseImages(product.images);
                const name = locale === 'fr' ? product.nameFr : locale === 'en' ? product.nameEn : product.nameHe;
                
                return (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    slug={product.slug}
                    name={name}
                    priceEurCents={product.priceEurCents}
                    priceIlsCents={product.priceIlsCents}
                    image={images[0] || '/images/placeholder.jpg'}
                    isNew={product.isNew}
                    isFeatured={product.isFeatured}
                  />
                );
              })}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-muted-foreground">{t('collections.noProducts')}</p>
            </div>
          )}
        </div>
      </section>

      {/* Story Section */}
      <section className="section-spacing-sm bg-white">
        <div className="container text-center">
          <h2 className="mb-12">{t('home.storyTitle')}</h2>
          <p className="text-lg font-light leading-relaxed max-w-3xl mx-auto mb-16">
            {t('home.storyDescription')}
          </p>
          <Link href="/about">
            <a>
              <Button className="btn-premium">
                {t('common.learnMore')}
              </Button>
            </a>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
