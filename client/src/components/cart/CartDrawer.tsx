import { X, Minus, Plus, Trash2 } from 'lucide-react';
import { Link } from 'wouter';
import { useStore } from '@/store/useStore';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/button';

export function CartDrawer() {
  const { t, formatPrice, locale } = useTranslation();
  const {
    isCartOpen,
    closeCart,
    cart,
    updateQuantity,
    removeFromCart,
    getCartTotal,
  } = useStore();

  const currency = locale === 'he' ? 'ils' : 'eur';
  const total = getCartTotal(currency);

  if (!isCartOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/40 z-50 transition-opacity"
        onClick={closeCart}
      />

      {/* Drawer */}
      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-serif font-light">{t('cart.title')}</h2>
          <button
            onClick={closeCart}
            className="p-2 hover:text-gold transition-fast"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <p className="text-muted-foreground mb-6">{t('cart.empty')}</p>
              <Button onClick={closeCart} variant="outline">
                {t('cart.continueShopping')}
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {cart.map((item) => {
                const price = currency === 'eur' ? item.priceEurCents : item.priceIlsCents;
                return (
                  <div key={item.productId} className="flex gap-4">
                    {/* Image */}
                    <Link href={`/products/${item.productSlug}`}>
                      <a onClick={closeCart} className="flex-shrink-0">
                        <img
                          src={item.productImage}
                          alt={item.productName}
                          className="w-24 h-24 object-cover"
                        />
                      </a>
                    </Link>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <Link href={`/products/${item.productSlug}`}>
                        <a
                          onClick={closeCart}
                          className="font-serif font-light hover:text-gold transition-fast"
                        >
                          {item.productName}
                        </a>
                      </Link>
                      <p className="text-sm text-muted-foreground mt-1">
                        {formatPrice(price)}
                      </p>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3 mt-3">
                        <button
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity - 1)
                          }
                          className="p-1 hover:text-gold transition-fast"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="text-sm font-light w-8 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity + 1)
                          }
                          className="p-1 hover:text-gold transition-fast"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => removeFromCart(item.productId)}
                          className="ml-auto p-1 text-destructive hover:text-destructive/80 transition-fast"
                          aria-label={t('cart.remove')}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="border-t border-border p-6 space-y-4">
            <div className="flex items-center justify-between text-lg">
              <span className="font-light">{t('cart.subtotal')}</span>
              <span className="font-serif">{formatPrice(total)}</span>
            </div>
            <Link href="/checkout">
              <a onClick={closeCart} className="block">
                <Button className="w-full btn-premium">
                  {t('cart.checkout')}
                </Button>
              </a>
            </Link>
            <Button
              onClick={closeCart}
              variant="outline"
              className="w-full"
            >
              {t('cart.continueShopping')}
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
