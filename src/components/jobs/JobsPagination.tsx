'use client';

import { useTranslations } from 'next-intl';
import { useCallback } from 'react';

import { Button } from '@/components/ui/button';
import { usePathname, useRouter } from '@/i18n/navigation';

interface JobsPaginationProps {
  page: number;
  total: number;
  limit: number;
  query: {
    country?: string;
    industry?: string;
    salaryMin?: string;
  };
}

export function JobsPagination({ page, total, limit, query }: JobsPaginationProps) {
  const t = useTranslations('pagination');
  const router = useRouter();
  const pathname = usePathname();
  const pages = Math.max(1, Math.ceil(total / limit));

  const go = useCallback(
    (next: number) => {
      const qs = new URLSearchParams();
      if (query.country) qs.set('country', query.country);
      if (query.industry) qs.set('industry', query.industry);
      if (query.salaryMin) qs.set('salaryMin', query.salaryMin);
      if (next > 1) qs.set('page', String(next));
      // @ts-expect-error — see LanguageSwitcher note: next-intl pathnames require
      // discriminated object for dynamic paths; query-only works at runtime.
      router.replace({ pathname, query: Object.fromEntries(qs.entries()) });
    },
    [pathname, query.country, query.industry, query.salaryMin, router],
  );

  if (pages <= 1) return null;

  return (
    <nav
      className="flex items-center justify-between gap-3"
      aria-label={t('page', { page, total: pages })}
    >
      <Button variant="ghost" size="sm" disabled={page <= 1} onClick={() => go(page - 1)}>
        {t('prev')}
      </Button>
      <span className="text-muted text-sm">{t('page', { page, total: pages })}</span>
      <Button variant="ghost" size="sm" disabled={page >= pages} onClick={() => go(page + 1)}>
        {t('next')}
      </Button>
    </nav>
  );
}
