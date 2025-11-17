import { useStore } from '@/store/useStore';
import frTranslations from '@/locales/fr.json';
import enTranslations from '@/locales/en.json';
import heTranslations from '@/locales/he.json';

type TranslationKey = string;

const translations = {
  fr: frTranslations,
  en: enTranslations,
  he: heTranslations,
};

export function useTranslation() {
  const locale = useStore((state) => state.locale);

  const t = (key: TranslationKey): string => {
    const keys = key.split('.');
    let value: any = translations[locale];

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        console.warn(`Translation key not found: ${key} for locale ${locale}`);
        return key;
      }
    }

    return typeof value === 'string' ? value : key;
  };

  const formatPrice = (cents: number, currency?: 'eur' | 'ils'): string => {
    const actualCurrency = currency || (locale === 'he' ? 'ils' : 'eur');
    const amount = cents / 100;

    if (actualCurrency === 'ils') {
      return new Intl.NumberFormat('he-IL', {
        style: 'currency',
        currency: 'ILS',
      }).format(amount);
    }

    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  return { t, locale, formatPrice };
}
