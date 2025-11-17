import { useState, useMemo } from 'react';
import { useLocation } from 'wouter';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ProductCard } from '@/components/product/ProductCard';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { useTranslation } from '@/hooks/useTranslation';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';

type SortOption = 'newest' | 'price-asc' | 'price-desc' | 'popular';

const CATEGORIES = [
  { slug: 'all', key: 'all' },
  { slug: 'chai', key: 'chai' },
  { slug: 'mezuzah', key: 'mezuzah' },
  { slug: 'star-of-david', key: 'starOfDavid' },
  { slug: 'hamsa', key: 'hamsa' },
  { slug: 'rings', key: 'rings' },
  { slug: 'necklaces', key: 'necklaces' },
  { slug: 'bracelets', key: 'bracelets' },
  { slug: 'earrings', key: 'earrings' },
];

export default function Collections() {
  const [location] = useLocation();
  const { t, locale } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOption>('newest');

  // Parse URL query params
  useMemo(() => {
    const params = new URLSearchParams(location.split('?')[1]);
    const categoryParam = params.get('category');
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [location]);

  // Fetch all categories
  const { data: categories } = trpc.categories.getAll.useQuery();

  // Fetch products based on filters
  const { data: products, isLoading } = trpc.products.getAll.useQuery({
    categoryId: selectedCategory === 'all' ? undefined : categories?.find(c => c.slug === selectedCategory)?.id,
    sortBy: sortBy,
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

      {/* Page Header */}
      <section className="pt-32 pb-20 lg:pt-40 lg:pb-28 bg-gray-50">
        <div className="container text-center">
          <h1 className="mb-6">{t('collections.title')}</h1>
          <p className="text-lg text-muted-foreground font-light max-w-2xl mx-auto">
            {t('home.collectionsSubtitle')}
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-12 lg:py-16 border-b border-border">
        <div className="container">
          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {CATEGORIES.map((category) => (
              <button
                key={category.slug}
                onClick={() => setSelectedCategory(category.slug)}
                className={`px-6 py-3 text-sm text-uppercase-spaced font-light transition-fast border ${
                  selectedCategory === category.slug
                    ? 'bg-black text-white border-black'
                    : 'bg-white text-black border-gray-300 hover:border-black'
                }`}
              >
                {t(`collections.${category.key}`)}
              </button>
            ))}
          </div>

          {/* Sort Options */}
          <div className="flex justify-center items-center gap-4">
            <span className="text-sm font-light text-muted-foreground">
              {t('collections.sortBy')}:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="px-4 py-2 text-sm font-light border border-gray-300 bg-white focus:outline-none focus:border-black"
            >
              <option value="newest">{t('collections.sortNewest')}</option>
              <option value="price-asc">{t('collections.sortPriceLow')}</option>
              <option value="price-desc">{t('collections.sortPriceHigh')}</option>
              <option value="popular">{t('collections.sortPopular')}</option>
            </select>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="section-spacing bg-white">
        <div className="container">
          {isLoading ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground">{t('common.loading')}</p>
            </div>
          ) : products && products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 md:gap-12 lg:gap-16">
              {products.map((product) => {
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
              <p className="text-muted-foreground mb-6">{t('collections.noProducts')}</p>
              <Button onClick={() => setSelectedCategory('all')} variant="outline">
                {t('collections.all')}
              </Button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
