import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { Menu, X, ShoppingBag } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { useTranslation } from '@/hooks/useTranslation';
import { APP_TITLE } from '@/const';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t, locale } = useTranslation();
  const { setLocale, toggleCart, getCartCount } = useStore();
  const cartCount = getCartCount();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/', label: t('nav.home') },
    { href: '/collections', label: t('nav.collections') },
    { href: '/about', label: t('nav.about') },
    { href: '/contact', label: t('nav.contact') },
  ];

  const locales: Array<{ code: 'fr' | 'en' | 'he'; label: string }> = [
    { code: 'fr', label: 'FR' },
    { code: 'en', label: 'EN' },
    { code: 'he', label: 'HE' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <div className="container">
        <div className="flex items-center justify-between h-20 lg:h-24">
          {/* Logo */}
          <Link href="/">
            <a className="text-xl lg:text-2xl font-serif font-light tracking-tight hover:text-gold transition-fast">
              {APP_TITLE}
            </a>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-12">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <a className="text-sm text-uppercase-spaced font-light hover:text-gold transition-fast">
                  {link.label}
                </a>
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-6">
            {/* Language Switcher */}
            <div className="hidden md:flex items-center gap-3">
              {locales.map((loc) => (
                <button
                  key={loc.code}
                  onClick={() => setLocale(loc.code)}
                  className={`text-xs font-light transition-fast ${
                    locale === loc.code
                      ? 'text-gold font-normal'
                      : 'text-foreground/60 hover:text-foreground'
                  }`}
                >
                  {loc.label}
                </button>
              ))}
            </div>

            {/* Cart */}
            <button
              onClick={toggleCart}
              className="relative p-2 hover:text-gold transition-fast"
              aria-label={t('nav.cart')}
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-gold text-black text-xs flex items-center justify-center font-normal">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 hover:text-gold transition-fast"
              aria-label="Menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-border">
          <nav className="container py-8 flex flex-col gap-6">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <a
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-lg text-uppercase-spaced font-light hover:text-gold transition-fast"
                >
                  {link.label}
                </a>
              </Link>
            ))}

            {/* Mobile Language Switcher */}
            <div className="flex items-center gap-4 pt-4 border-t border-border">
              {locales.map((loc) => (
                <button
                  key={loc.code}
                  onClick={() => {
                    setLocale(loc.code);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`text-sm font-light transition-fast ${
                    locale === loc.code
                      ? 'text-gold font-normal'
                      : 'text-foreground/60'
                  }`}
                >
                  {loc.label}
                </button>
              ))}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
