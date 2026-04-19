'use client';

import { useTranslations } from 'next-intl';
import { useTransition } from 'react';

import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/features/auth/store';
import { Link, useRouter } from '@/i18n/navigation';

type Role = 'candidate' | 'employer' | 'admin';

const POST_LOGIN_DESTINATION: Record<Role, '/candidate/jobs' | '/employers' | '/'> = {
  candidate: '/candidate/jobs',
  employer: '/employers',
  admin: '/',
};

export function RoleLoginPanel() {
  const t = useTranslations('auth.login');
  const signInAs = useAuthStore((s) => s.signInAs);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function selectRole(role: Role) {
    signInAs(role);
    const destination = POST_LOGIN_DESTINATION[role];
    startTransition(() => {
      router.replace(destination);
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
        <Button variant="ghost" disabled={isPending} onClick={() => selectRole('admin')}>
          {t('admin')}
        </Button>
      </div>

      <p className="text-muted text-sm">
        {t('noAccount')}{' '}
        <Link href="/signup" className="text-primary underline">
          {t('signUpLink')}
        </Link>
      </p>
    </div>
  );
}
