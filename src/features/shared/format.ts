import type { SupportedLocale } from './types';

export const LOCALE_TO_INTL: Record<SupportedLocale, string> = {
  ru: 'ru-RU',
  en: 'en-GB',
  tr: 'tr-TR',
};

export function formatDateTime(iso: string, locale: SupportedLocale): string {
  return new Intl.DateTimeFormat(LOCALE_TO_INTL[locale], {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso));
}

export function formatDateShort(iso: string, locale: SupportedLocale): string {
  return new Intl.DateTimeFormat(LOCALE_TO_INTL[locale], {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(iso));
}
