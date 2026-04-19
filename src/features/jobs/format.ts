import type { Job } from './types';
import type { SupportedLocale } from '../shared/types';

const LOCALE_TO_INTL: Record<SupportedLocale, string> = {
  ru: 'ru-RU',
  en: 'en-GB',
  tr: 'tr-TR',
};

export function localizeText(
  text: Partial<Record<SupportedLocale, string>> & { ru: string },
  locale: SupportedLocale,
): string {
  return text[locale] ?? text.ru;
}

export function formatSalaryRange(
  job: Pick<Job, 'salaryMin' | 'salaryMax' | 'currency'>,
  locale: SupportedLocale,
): string {
  const { salaryMin, salaryMax, currency } = job;
  const formatter = new Intl.NumberFormat(LOCALE_TO_INTL[locale], {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  });
  if (salaryMin === salaryMax) return formatter.format(salaryMin);
  return `${formatter.format(salaryMin)} – ${formatter.format(salaryMax)}`;
}

export function formatSeason(
  job: Pick<Job, 'seasonStart' | 'seasonEnd'>,
  locale: SupportedLocale,
): string {
  const formatter = new Intl.DateTimeFormat(LOCALE_TO_INTL[locale], {
    month: 'short',
    year: 'numeric',
  });
  const start = formatter.format(new Date(job.seasonStart));
  const end = formatter.format(new Date(job.seasonEnd));
  return `${start} – ${end}`;
}
