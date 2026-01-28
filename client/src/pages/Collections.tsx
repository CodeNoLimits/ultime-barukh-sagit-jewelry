import { useState, useMemo } from 'react';
import { useLocation } from 'wouter';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ProductCard } from '@/components/product/ProductCard';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { useTranslation } from '@/hooks/useTranslation';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationEllipsis,
} from '@/components/ui/pagination';

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

const PRODUCTS_PER_PAGE = 20;

export default function Collections() {
  const [location] = useLocation();
  const { t, locale } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [currentPage, setCurrentPage] = useState(1);

  // Parse URL query params
  useMemo(() => {
    const params = new URLSearchParams(location.split('?')[1]);
    const categoryParam = params.get('category');
    if (categoryParam) {
      setSelectedCategory(categoryParam);
      setCurrentPage(1);
    }
  }, [location]);

  // Reset page when category or sort changes
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleSortChange = (sort: SortOption) => {
    setSortBy(sort);
    setCurrentPage(1);
  };

  // Fetch all categories
  const { data: categories } = trpc.categories.getAll.useQuery();

  // Fetch products with pagination
  const { data: paginatedData, isLoading } = trpc.products.getAllPaginated.useQuery({
    categoryId: selectedCategory === 'all' ? undefined : categories?.find(c => c.slug === selectedCategory)?.id,
    sortBy: sortBy,
    page: currentPage,
    pageSize: PRODUCTS_PER_PAGE,
  });

  const products = paginatedData?.products;
  const totalPages = paginatedData?.totalPages || 1;
  const totalProducts = paginatedData?.total || 0;

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
                onClick={() => handleCategoryChange(category.slug)}
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
              onChange={(e) => handleSortChange(e.target.value as SortOption)}
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
            <>
              {/* Results count */}
              <div className="text-center mb-8">
                <p className="text-sm text-muted-foreground font-light">
                  {t('collections.showing')} {((currentPage - 1) * PRODUCTS_PER_PAGE) + 1}-{Math.min(currentPage * PRODUCTS_PER_PAGE, totalProducts)} {t('collections.of')} {totalProducts} {t('collections.products')}
                </p>
              </div>

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

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-16">
                  <Pagination>
                    <PaginationContent className="gap-2">
                      {/* Previous Button */}
                      <PaginationItem>
                        <button
                          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                          disabled={currentPage === 1}
                          className={`flex items-center gap-2 px-4 py-2 text-sm font-light border transition-fast ${
                            currentPage === 1
                              ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                              : 'border-gray-300 hover:border-black'
                          }`}
                          aria-label={t('collections.previous')}
                        >
                          <ChevronLeft className="w-4 h-4" />
                          <span className="hidden sm:inline">{t('collections.previous')}</span>
                        </button>
                      </PaginationItem>

                      {/* Page Numbers */}
                      {(() => {
                        const pages: (number | 'ellipsis')[] = [];
                        const showPages = 5;

                        if (totalPages <= showPages + 2) {
                          for (let i = 1; i <= totalPages; i++) pages.push(i);
                        } else {
                          pages.push(1);

                          if (currentPage <= 3) {
                            for (let i = 2; i <= 4; i++) pages.push(i);
                            pages.push('ellipsis');
                          } else if (currentPage >= totalPages - 2) {
                            pages.push('ellipsis');
                            for (let i = totalPages - 3; i < totalPages; i++) pages.push(i);
                          } else {
                            pages.push('ellipsis');
                            for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
                            pages.push('ellipsis');
                          }

                          pages.push(totalPages);
                        }

                        return pages.map((page, index) =>
                          page === 'ellipsis' ? (
                            <PaginationItem key={`ellipsis-${index}`}>
                              <PaginationEllipsis />
                            </PaginationItem>
                          ) : (
                            <PaginationItem key={page}>
                              <PaginationLink
                                onClick={() => setCurrentPage(page)}
                                isActive={currentPage === page}
                                className={`w-10 h-10 flex items-center justify-center text-sm font-light border cursor-pointer transition-fast ${
                                  currentPage === page
                                    ? 'bg-black text-white border-black'
                                    : 'border-gray-300 hover:border-black'
                                }`}
                              >
                                {page}
                              </PaginationLink>
                            </PaginationItem>
                          )
                        );
                      })()}

                      {/* Next Button */}
                      <PaginationItem>
                        <button
                          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                          disabled={currentPage === totalPages}
                          className={`flex items-center gap-2 px-4 py-2 text-sm font-light border transition-fast ${
                            currentPage === totalPages
                              ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                              : 'border-gray-300 hover:border-black'
                          }`}
                          aria-label={t('collections.next')}
                        >
                          <span className="hidden sm:inline">{t('collections.next')}</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20">
              <p className="text-muted-foreground mb-6">{t('collections.noProducts')}</p>
              <Button onClick={() => handleCategoryChange('all')} variant="outline">
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
