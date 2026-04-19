'use client';

import { useTranslations } from 'next-intl';

import { cn } from '@/lib/utils';

interface StepIndicatorProps {
  step: number;
  total: number;
}

export function StepIndicator({ step, total }: StepIndicatorProps) {
  const t = useTranslations('candidate.onboarding');
  return (
    <div className="flex flex-col gap-2">
      <p className="text-muted text-sm font-medium">
        {t('progress', { step: step + 1, total })}
      </p>
      <div className="flex gap-1" role="progressbar" aria-valuenow={step + 1} aria-valuemin={1} aria-valuemax={total}>
        {Array.from({ length: total }).map((_, index) => (
          <span
            key={index}
            className={cn(
              'h-1.5 flex-1 rounded-full transition-colors',
              index <= step ? 'bg-[color:var(--color-primary)]' : 'bg-[color:var(--color-border)]',
            )}
          />
        ))}
      </div>
    </div>
  );
}
