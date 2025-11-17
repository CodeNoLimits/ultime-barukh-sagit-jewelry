import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Locale = 'fr' | 'en' | 'he';

export interface CartItem {
  productId: number;
  productSlug: string;
  productName: string;
  productImage: string;
  priceEurCents: number;
  priceIlsCents: number;
  quantity: number;
}

interface StoreState {
  // Locale
  locale: Locale;
  setLocale: (locale: Locale) => void;

  // Cart
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: (currency: 'eur' | 'ils') => number;
  getCartCount: () => number;

  // Cart drawer
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // Locale
      locale: 'fr',
      setLocale: (locale) => {
        set({ locale });
        // Update document direction for RTL
        if (typeof document !== 'undefined') {
          document.documentElement.setAttribute('dir', locale === 'he' ? 'rtl' : 'ltr');
          document.documentElement.setAttribute('lang', locale);
        }
      },

      // Cart
      cart: [],
      addToCart: (item, quantity = 1) => {
        const { cart } = get();
        const existingItem = cart.find((i) => i.productId === item.productId);

        if (existingItem) {
          set({
            cart: cart.map((i) =>
              i.productId === item.productId
                ? { ...i, quantity: i.quantity + quantity }
                : i
            ),
          });
        } else {
          set({
            cart: [...cart, { ...item, quantity }],
          });
        }
      },

      removeFromCart: (productId) => {
        set({
          cart: get().cart.filter((item) => item.productId !== productId),
        });
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(productId);
        } else {
          set({
            cart: get().cart.map((item) =>
              item.productId === productId ? { ...item, quantity } : item
            ),
          });
        }
      },

      clearCart: () => {
        set({ cart: [] });
      },

      getCartTotal: (currency) => {
        const { cart } = get();
        return cart.reduce((total: number, item: CartItem) => {
          const price = currency === 'eur' ? item.priceEurCents : item.priceIlsCents;
          return total + price * item.quantity;
        }, 0);
      },

      getCartCount: () => {
        return get().cart.reduce((count: number, item: CartItem) => count + item.quantity, 0);
      },

      // Cart drawer
      isCartOpen: false,
      openCart: () => set({ isCartOpen: true }),
      closeCart: () => set({ isCartOpen: false }),
      toggleCart: () => set({ isCartOpen: !get().isCartOpen }),
    }),
    {
      name: 'barukh-sagit-storage',
      partialize: (state: StoreState) => ({
        locale: state.locale,
        cart: state.cart,
      }),
    }
  )
);
