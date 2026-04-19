'use client';

import { useTranslations } from 'next-intl';
import { useTransition } from 'react';

import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/features/auth/store';
import { Link, useRouter } from '@/i18n/navigation';

export function RoleSignupPanel() {
  const t = useTranslations('auth.signup');
  const signInAs = useAuthStore((s) => s.signInAs);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function selectRole(role: 'candidate' | 'employer') {
    signInAs(role);
    startTransition(() => {
      router.replace('/');
    });
  }

  return (
    <div className="border-border bg-surface-2 shadow-card flex flex-col gap-4 rounded-md border p-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold">{t('title')}</h1>
        <p className="text-muted text-sm">{t('subtitle')}</p>
      </header>

      <div className="flex flex-col gap-2">
        <Button disabled={isPending} onClick={() => selectRole('candidate')}>
          {t('candidate')}
        </Button>
        <Button variant="secondary" disabled={isPending} onClick={() => selectRole('employer')}>
          {t('employer')}
        </Button>
      </div>

      <p className="text-muted text-sm">
        {t('hasAccount')}{' '}
        <Link href="/login" className="text-primary underline">
          {t('signInLink')}
        </Link>
      </p>
    </div>
  );
}
