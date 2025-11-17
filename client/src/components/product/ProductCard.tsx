import { Link } from 'wouter';
import { useTranslation } from '@/hooks/useTranslation';

interface ProductCardProps {
  id: number;
  slug: string;
  name: string;
  priceEurCents: number;
  priceIlsCents: number;
  image: string;
  isNew?: boolean;
  isFeatured?: boolean;
}

export function ProductCard({
  id,
  slug,
  name,
  priceEurCents,
  priceIlsCents,
  image,
  isNew,
  isFeatured,
}: ProductCardProps) {
  const { formatPrice, locale } = useTranslation();

  const price = locale === 'he' ? priceIlsCents : priceEurCents;

  return (
    <Link href={`/products/${slug}`}>
      <a className="group block">
        {/* Image Container */}
        <div className="overflow-hidden aspect-[4/5] bg-gray-50 relative mb-6">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-110"
          />
          
          {/* Badges */}
          {(isNew || isFeatured) && (
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {isNew && (
                <span className="bg-black text-white px-4 py-2 text-xs text-uppercase-spaced">
                  Nouveau
                </span>
              )}
              {isFeatured && (
                <span className="bg-gold text-black px-4 py-2 text-xs text-uppercase-spaced">
                  Sélection
                </span>
              )}
            </div>
          )}

          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-fast" />
        </div>

        {/* Product Info */}
        <div className="text-center px-4">
          <h3 className="font-serif text-lg lg:text-xl font-light mb-3 group-hover:text-gold transition-fast">
            {name}
          </h3>
          <p className="text-sm lg:text-base font-light text-uppercase-spaced tracking-wider">
            {formatPrice(price)}
          </p>
        </div>
      </a>
    </Link>
  );
}
