import { useState } from 'react';
import { useRoute, Link } from 'wouter';
import { Minus, Plus, ShoppingBag } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { useTranslation } from '@/hooks/useTranslation';
import { useStore } from '@/store/useStore';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

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
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
