import { useState } from 'react';
import { useRoute, Link } from 'wouter';
import { Minus, Plus, ShoppingBag, Star, Truck, Ruler } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { useTranslation } from '@/hooks/useTranslation';
import { useStore } from '@/store/useStore';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

// Mock reviews data
const mockReviews = [
  {
    id: 1,
    author: 'Sarah L.',
    rating: 5,
    date: '2024-12-15',
    comment: 'Absolutely stunning piece! The craftsmanship is exceptional.',
    verified: true,
  },
  {
    id: 2,
    author: 'David M.',
    rating: 5,
    date: '2024-11-28',
    comment: 'Beautiful jewelry, exactly as described. Fast shipping.',
    verified: true,
  },
  {
    id: 3,
    author: 'Rachel K.',
    rating: 4,
    date: '2024-11-10',
    comment: 'Lovely design and great quality. Would recommend.',
    verified: true,
  },
];

// Size guide data
const ringSizes = [
  { size: '48', diameter: '15.3', circumference: '48', us: '4.5' },
  { size: '50', diameter: '15.9', circumference: '50', us: '5.5' },
  { size: '52', diameter: '16.5', circumference: '52', us: '6' },
  { size: '54', diameter: '17.2', circumference: '54', us: '7' },
  { size: '56', diameter: '17.8', circumference: '56', us: '7.5' },
  { size: '58', diameter: '18.4', circumference: '58', us: '8.5' },
  { size: '60', diameter: '19.1', circumference: '60', us: '9' },
];

const braceletSizes = [
  { size: 'XS', length: '15' },
  { size: 'S', length: '16' },
  { size: 'M', length: '17' },
  { size: 'L', length: '18' },
  { size: 'XL', length: '19' },
];

export default function ProductDetail() {
  const [, params] = useRoute('/products/:slug');
  const { t, locale, formatPrice } = useTranslation();
  const { addToCart, openCart } = useStore();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  const { data: product, isLoading } = trpc.products.getBySlug.useQuery({
    slug: params?.slug || '',
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">{t('common.loading')}</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-3xl font-serif font-light mb-6">Produit non trouvé</h2>
            <Link href="/collections">
              <a>
                <Button className="btn-premium">
                  {t('collections.title')}
                </Button>
              </a>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const images = JSON.parse(product.images);
  const name = locale === 'fr' ? product.nameFr : locale === 'en' ? product.nameEn : product.nameHe;
  const description = locale === 'fr' ? product.descriptionFr : locale === 'en' ? product.descriptionEn : product.descriptionHe;
  const materials = locale === 'fr' ? product.materialsFr : locale === 'en' ? product.materialsEn : product.materialsHe;
  const culturalSignificance = locale === 'fr' ? product.culturalSignificanceFr : locale === 'en' ? product.culturalSignificanceEn : product.culturalSignificanceHe;
  const price = locale === 'he' ? product.priceIlsCents : product.priceEurCents;

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      productSlug: product.slug,
      productName: name,
      productImage: images[0],
      priceEurCents: product.priceEurCents,
      priceIlsCents: product.priceIlsCents,
    }, quantity);
    
    toast.success(t('cart.itemAdded'));
    setTimeout(() => openCart(), 300);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <CartDrawer />

      <main className="flex-1 pt-32 pb-20 lg:pt-40 lg:pb-28">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Image Gallery */}
            <div>
              {/* Main Image */}
              <div className="overflow-hidden bg-gray-50 mb-6 aspect-square">
                <img
                  src={images[selectedImage] || images[0]}
                  alt={name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                  {images.map((image: string, index: number) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`overflow-hidden bg-gray-50 aspect-square border-2 transition-fast ${
                        selectedImage === index
                          ? 'border-black'
                          : 'border-transparent hover:border-gray-300'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div>
              {/* Badges */}
              <div className="flex gap-3 mb-6">
                {product.isNew && (
                  <span className="bg-black text-white px-4 py-2 text-xs text-uppercase-spaced">
                    {t('common.new')}
                  </span>
                )}
                {product.isFeatured && (
                  <span className="bg-gold text-black px-4 py-2 text-xs text-uppercase-spaced">
                    {t('common.featured')}
                  </span>
                )}
              </div>

              {/* Name */}
              <h1 className="text-4xl lg:text-5xl mb-6">{name}</h1>

              {/* Price */}
              <p className="text-2xl lg:text-3xl font-serif font-light mb-8">
                {formatPrice(price)}
              </p>

              {/* Description */}
              {description && (
                <div className="mb-8">
                  <p className="text-base lg:text-lg font-light leading-relaxed">
                    {description}
                  </p>
                </div>
              )}

              {/* Materials */}
              {materials && (
                <div className="mb-8">
                  <h3 className="text-lg font-serif font-light mb-3">
                    {t('product.materials')}
                  </h3>
                  <p className="text-muted-foreground font-light">{materials}</p>
                </div>
              )}

              {/* Cultural Significance */}
              {culturalSignificance && (
                <div className="mb-8">
                  <h3 className="text-lg font-serif font-light mb-3">
                    {t('product.culturalSignificance')}
                  </h3>
                  <p className="text-muted-foreground font-light">{culturalSignificance}</p>
                </div>
              )}

              {/* Stock Status */}
              <div className="mb-8">
                {product.stock > 0 ? (
                  <p className="text-sm text-green-600 font-light">
                    {t('product.inStock')}
                  </p>
                ) : (
                  <p className="text-sm text-destructive font-light">
                    {t('product.outOfStock')}
                  </p>
                )}
              </div>

              {/* Quantity Selector */}
              {product.stock > 0 && (
                <div className="mb-8">
                  <label className="block text-sm font-light mb-3">
                    {t('product.quantity')}
                  </label>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-3 border border-gray-300 hover:border-black transition-fast"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-lg font-light w-12 text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="p-3 border border-gray-300 hover:border-black transition-fast"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Add to Cart Button */}
              <Button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="w-full btn-premium flex items-center justify-center gap-3"
              >
                <ShoppingBag className="w-5 h-5" />
                {t('common.addToCart')}
              </Button>

              {/* Accordion Sections */}
              <div className="mt-12 border-t pt-8">
                <Accordion type="single" collapsible className="w-full">
                  {/* Size Guide */}
                  <AccordionItem value="size-guide">
                    <AccordionTrigger className="text-base font-serif">
                      <span className="flex items-center gap-3">
                        <Ruler className="w-5 h-5" />
                        {t('product.sizeGuide')}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-muted-foreground mb-6">
                        {t('product.sizeGuideDescription')}
                      </p>

                      {/* Rings Size Table */}
                      <div className="mb-6">
                        <h4 className="font-medium mb-3">{t('product.ringsTitle')}</h4>
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b">
                                <th className="text-left py-2 pr-4 font-medium">{t('product.size')}</th>
                                <th className="text-left py-2 pr-4 font-medium">{t('product.diameter')}</th>
                                <th className="text-left py-2 pr-4 font-medium">{t('product.circumference')}</th>
                                <th className="text-left py-2 font-medium">{t('product.usSize')}</th>
                              </tr>
                            </thead>
                            <tbody>
                              {ringSizes.map((row) => (
                                <tr key={row.size} className="border-b border-gray-100">
                                  <td className="py-2 pr-4">{row.size}</td>
                                  <td className="py-2 pr-4">{row.diameter}</td>
                                  <td className="py-2 pr-4">{row.circumference}</td>
                                  <td className="py-2">{row.us}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Bracelets Size Table */}
                      <div>
                        <h4 className="font-medium mb-3">{t('product.braceletsTitle')}</h4>
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b">
                                <th className="text-left py-2 pr-4 font-medium">{t('product.size')}</th>
                                <th className="text-left py-2 font-medium">{t('product.length')}</th>
                              </tr>
                            </thead>
                            <tbody>
                              {braceletSizes.map((row) => (
                                <tr key={row.size} className="border-b border-gray-100">
                                  <td className="py-2 pr-4">{row.size}</td>
                                  <td className="py-2">{row.length}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Shipping Info */}
                  <AccordionItem value="shipping">
                    <AccordionTrigger className="text-base font-serif">
                      <span className="flex items-center gap-3">
                        <Truck className="w-5 h-5" />
                        {t('product.shipping')}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="overflow-x-auto mb-4">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left py-2 pr-4 font-medium">{t('product.deliveryZone')}</th>
                              <th className="text-left py-2 pr-4 font-medium">{t('product.deliveryTime')}</th>
                              <th className="text-left py-2 font-medium">{t('product.deliveryCost')}</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-b border-gray-100">
                              <td className="py-2 pr-4">{t('product.shippingIsrael')}</td>
                              <td className="py-2 pr-4">{t('product.shippingIsraelTime')}</td>
                              <td className="py-2">{t('product.shippingIsraelCost')}</td>
                            </tr>
                            <tr className="border-b border-gray-100">
                              <td className="py-2 pr-4">{t('product.shippingEurope')}</td>
                              <td className="py-2 pr-4">{t('product.shippingEuropeTime')}</td>
                              <td className="py-2">{t('product.shippingEuropeCost')}</td>
                            </tr>
                            <tr className="border-b border-gray-100">
                              <td className="py-2 pr-4">{t('product.shippingInternational')}</td>
                              <td className="py-2 pr-4">{t('product.shippingInternationalTime')}</td>
                              <td className="py-2">{t('product.shippingInternationalCost')}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <p className="text-muted-foreground text-sm">
                        {t('product.shippingNote')}
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Customer Reviews */}
                  <AccordionItem value="reviews">
                    <AccordionTrigger className="text-base font-serif">
                      <span className="flex items-center gap-3">
                        <Star className="w-5 h-5" />
                        {t('product.reviews')} ({mockReviews.length})
                      </span>
                    </AccordionTrigger>
                    <AccordionContent>
                      {/* Average Rating */}
                      <div className="flex items-center gap-4 mb-6 pb-4 border-b">
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-5 h-5 ${
                                star <= 4.7 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-lg font-medium">4.7</span>
                        <span className="text-muted-foreground">
                          {t('product.basedOn')} {mockReviews.length} {t('product.reviewsCount')}
                        </span>
                      </div>

                      {/* Review List */}
                      <div className="space-y-6">
                        {mockReviews.map((review) => (
                          <div key={review.id} className="pb-4 border-b border-gray-100 last:border-0">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{review.author}</span>
                                {review.verified && (
                                  <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded">
                                    {t('product.verifiedPurchase')}
                                  </span>
                                )}
                              </div>
                              <span className="text-sm text-muted-foreground">{review.date}</span>
                            </div>
                            <div className="flex items-center gap-1 mb-2">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`w-4 h-4 ${
                                    star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                            <p className="text-muted-foreground">{review.comment}</p>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
