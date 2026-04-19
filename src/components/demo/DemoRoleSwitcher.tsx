'use client';

import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { useSyncExternalStore } from 'react';

import { useAuthStore } from '@/features/auth/store';
import type { UserRole } from '@/features/auth/types';

type DemoRole = 'guest' | 'candidate' | 'employer' | 'admin';

const ROLES: ReadonlyArray<DemoRole> = ['guest', 'candidate', 'employer', 'admin'];

function useIsMounted(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

export function DemoRoleSwitcher() {
  const t = useTranslations('demo');
  const user = useAuthStore((s) => s.user);
  const signInAs = useAuthStore((s) => s.signInAs);
  const signOut = useAuthStore((s) => s.signOut);
  const searchParams = useSearchParams();
  const isMounted = useIsMounted();

  if (!isMounted || searchParams.get('demo') !== 'true') return null;

  function onChange(role: DemoRole) {
    if (role === 'guest') {
      signOut();
    } else {
      signInAs(role);
    }
  }

  const current: UserRole = user.role;

  return (
    <label className="inline-flex items-center gap-2 text-xs">
      <span className="text-muted uppercase">{t('switcher')}</span>
      <select
        aria-label={t('switcher')}
        value={current}
        onChange={(e) => onChange(e.target.value as DemoRole)}
        className="border-border bg-surface rounded-md border px-2 py-1 text-xs"
      >
        {ROLES.map((role) => (
          <option key={role} value={role}>
            {t(role)}
          </option>
        ))}
      </select>
    </label>
  );
}
