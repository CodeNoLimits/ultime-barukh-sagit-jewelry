import { Link } from 'wouter';
import { Facebook, Instagram, Twitter } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { APP_TITLE } from '@/const';

export function Footer() {
  const { t } = useTranslation();

  const navigationLinks = [
    { href: '/', label: t('nav.home') },
    { href: '/collections', label: t('nav.collections') },
    { href: '/about', label: t('nav.about') },
    { href: '/contact', label: t('nav.contact') },
  ];

  const informationLinks = [
    { href: '/delivery', label: t('footer.delivery') },
    { href: '/returns', label: t('footer.returns') },
    { href: '/terms', label: t('footer.terms') },
    { href: '/privacy', label: t('footer.privacy') },
  ];

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Twitter, href: '#', label: 'Twitter' },
  ];

  return (
    <footer className="bg-black text-white relative overflow-hidden">
      {/* Subtle pattern overlay */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="container relative">
        <div className="section-spacing-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16 mb-16">
            {/* Brand */}
            <div className="lg:col-span-2">
              <h3 className="text-2xl lg:text-3xl font-serif font-light mb-6">
                {APP_TITLE}
              </h3>
              <p className="text-gray-400 font-light leading-relaxed mb-8 max-w-md">
                {t('footer.description')}
              </p>
              <div className="flex gap-4">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.label}
                      href={social.href}
                      className="w-10 h-10 border border-gray-700 flex items-center justify-center hover:border-gold hover:text-gold transition-fast"
                      aria-label={social.label}
                    >
                      <Icon className="w-4 h-4" />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Navigation */}
            <div>
              <h4 className="text-sm text-uppercase-spaced mb-6">
                {t('footer.navigation')}
              </h4>
              <ul className="space-y-4">
                {navigationLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href}>
                      <a className="text-gray-400 font-light hover:text-gold transition-fast">
                        {link.label}
                      </a>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Information */}
            <div>
              <h4 className="text-sm text-uppercase-spaced mb-6">
                {t('footer.information')}
              </h4>
              <ul className="space-y-4">
                {informationLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href}>
                      <a className="text-gray-400 font-light hover:text-gold transition-fast">
                        {link.label}
                      </a>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="pt-8 border-t border-gray-800">
            <p className="text-center text-sm text-gray-500 font-light">
              {t('footer.copyright')}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
