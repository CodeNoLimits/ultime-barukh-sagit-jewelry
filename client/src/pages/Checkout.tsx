import { useState } from 'react';
import { useLocation } from 'wouter';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useTranslation } from '@/hooks/useTranslation';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export default function Checkout() {
  const [, setLocation] = useLocation();
  const { t, formatPrice, locale } = useTranslation();
  const { cart, getCartTotal, clearCart } = useStore();
  const [isProcessing, setIsProcessing] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
  });

  const currency = locale === 'he' ? 'ils' : 'eur';
  const subtotal = getCartTotal(currency);
  const shipping = 0; // Free shipping
  const tax = Math.round(subtotal * 0.2); // 20% VAT
  const total = subtotal + shipping + tax;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate order processing
    setTimeout(() => {
      clearCart();
      toast.success('Commande confirmée !');
      setLocation('/');
      setIsProcessing(false);
    }, 2000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-3xl font-serif font-light mb-6">
              {t('cart.empty')}
            </h2>
            <Button onClick={() => setLocation('/collections')} className="btn-premium">
              {t('cart.continueShopping')}
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pt-32 pb-20 lg:pt-40 lg:pb-28 bg-gray-50">
        <div className="container">
          <h1 className="text-4xl lg:text-5xl mb-12 text-center">
            {t('checkout.title')}
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Checkout Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="bg-white p-8 lg:p-12">
                {/* Customer Information */}
                <div className="mb-12">
                  <h2 className="text-2xl font-serif font-light mb-6">
                    {t('checkout.customerInfo')}
                  </h2>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-light mb-2">
                        {t('checkout.name')} *
                      </label>
                      <Input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-light mb-2">
                          {t('checkout.email')} *
                        </label>
                        <Input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-light mb-2">
                          {t('checkout.phone')}
                        </label>
                        <Input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="mb-12">
                  <h2 className="text-2xl font-serif font-light mb-6">
                    {t('checkout.shippingAddress')}
                  </h2>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-light mb-2">
                        {t('checkout.address')} *
                      </label>
                      <Input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                        className="w-full"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-light mb-2">
                          {t('checkout.city')} *
                        </label>
                        <Input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          required
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-light mb-2">
                          {t('checkout.postalCode')} *
                        </label>
                        <Input
                          type="text"
                          name="postalCode"
                          value={formData.postalCode}
                          onChange={handleChange}
                          required
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-light mb-2">
                          {t('checkout.country')} *
                        </label>
                        <Input
                          type="text"
                          name="country"
                          value={formData.country}
                          onChange={handleChange}
                          required
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full btn-premium-gold"
                >
                  {isProcessing ? t('checkout.processing') : t('checkout.placeOrder')}
                </Button>
              </form>
            </div>

            {/* Order Summary */}
            <div>
              <div className="bg-white p-8 sticky top-32">
                <h2 className="text-2xl font-serif font-light mb-6">
                  {t('checkout.orderSummary')}
                </h2>

                {/* Cart Items */}
                <div className="space-y-4 mb-6 pb-6 border-b border-border">
                  {cart.map((item) => {
                    const price = currency === 'eur' ? item.priceEurCents : item.priceIlsCents;
                    return (
                      <div key={item.productId} className="flex gap-4">
                        <img
                          src={item.productImage}
                          alt={item.productName}
                          className="w-16 h-16 object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-serif font-light text-sm truncate">
                            {item.productName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Qté: {item.quantity}
                          </p>
                        </div>
                        <p className="text-sm font-light">
                          {formatPrice(price * item.quantity)}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* Totals */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="font-light">{t('cart.subtotal')}</span>
                    <span className="font-light">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="font-light">{t('cart.shipping')}</span>
                    <span className="font-light text-green-600">Gratuit</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="font-light">{t('cart.tax')}</span>
                    <span className="font-light">{formatPrice(tax)}</span>
                  </div>
                  <div className="flex justify-between text-lg pt-3 border-t border-border">
                    <span className="font-serif">{t('cart.total')}</span>
                    <span className="font-serif">{formatPrice(total)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
