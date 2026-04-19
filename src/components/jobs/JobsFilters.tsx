'use client';

import { useTranslations } from 'next-intl';
import { useCallback, useTransition } from 'react';

import { Button } from '@/components/ui/button';
import type { Country, Industry } from '@/features/shared/types';
import { usePathname, useRouter } from '@/i18n/navigation';

const COUNTRIES: ReadonlyArray<Country> = ['TR', 'UK', 'KR', 'PL', 'DE', 'NL'];
const INDUSTRIES: ReadonlyArray<Industry> = [
  'hospitality',
  'agriculture',
  'manufacturing',
  'construction',
];

interface JobsFiltersProps {
  current: {
    country: Country | null;
    industry: Industry | null;
    salaryMin: number | null;
  };
}

export function JobsFilters({ current }: JobsFiltersProps) {
  const t = useTranslations('jobs.filters');
  const tCountry = useTranslations('country');
  const tIndustry = useTranslations('industry');
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const updateQuery = useCallback(
    (patch: Record<string, string | undefined>) => {
      const params = new URLSearchParams();
      if (current.country) params.set('country', current.country);
      if (current.industry) params.set('industry', current.industry);
      if (current.salaryMin != null) params.set('salaryMin', String(current.salaryMin));
      for (const [key, value] of Object.entries(patch)) {
        if (value == null || value === '') {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      }
      params.delete('page');
      const query = Object.fromEntries(params.entries());
      startTransition(() => {
        // @ts-expect-error — pathname is a static AppPathname here, next-intl's
        // dynamic-params inference rejects the query-only form.
        router.replace({ pathname, query });
      });
    },
    [current.country, current.industry, current.salaryMin, pathname, router],
  );

  const reset = useCallback(() => {
    startTransition(() => {
      // @ts-expect-error — see note in updateQuery.
      router.replace({ pathname, query: {} });
    });
  }, [pathname, router]);

  return (
    <form
      className="border-border bg-surface-2 grid gap-3 rounded-md border p-4 sm:grid-cols-3"
      aria-busy={isPending}
    >
      <label className="flex flex-col gap-1 text-sm">
        <span className="text-muted">{t('country')}</span>
        <select
          value={current.country ?? ''}
          onChange={(e) => updateQuery({ country: e.target.value })}
          className="border-border bg-surface rounded-md border px-2 py-1"
        >
          <option value="">{t('any')}</option>
          {COUNTRIES.map((c) => (
            <option key={c} value={c}>
              {tCountry(c)}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-1 text-sm">
        <span className="text-muted">{t('industry')}</span>
        <select
          value={current.industry ?? ''}
          onChange={(e) => updateQuery({ industry: e.target.value })}
          className="border-border bg-surface rounded-md border px-2 py-1"
        >
          <option value="">{t('any')}</option>
          {INDUSTRIES.map((i) => (
            <option key={i} value={i}>
              {tIndustry(i)}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-1 text-sm">
        <span className="text-muted">{t('salaryMin')}</span>
        <input
          type="number"
          inputMode="numeric"
          min={0}
          step={100}
          value={current.salaryMin ?? ''}
          onChange={(e) => updateQuery({ salaryMin: e.target.value })}
          className="border-border bg-surface rounded-md border px-2 py-1"
          placeholder="0"
        />
      </label>
      <div className="sm:col-span-3">
        <Button type="button" variant="ghost" size="sm" onClick={reset}>
          {t('reset')}
        </Button>
      </div>
    </form>
  );
}
