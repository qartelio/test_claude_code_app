'use client';

import { useTranslations } from 'next-intl';

import { Link, usePathname } from '@/i18n/navigation';
import { cn } from '@/lib/utils';

type TabHref =
  | '/candidate/jobs'
  | '/candidate/applications'
  | '/candidate/messages'
  | '/candidate/profile';

interface Tab {
  href: TabHref;
  key: 'jobs' | 'applications' | 'messages' | 'profile';
}

const TABS: ReadonlyArray<Tab> = [
  { href: '/candidate/jobs', key: 'jobs' },
  { href: '/candidate/applications', key: 'applications' },
  { href: '/candidate/messages', key: 'messages' },
  { href: '/candidate/profile', key: 'profile' },
];

export function CandidateBottomNav() {
  const t = useTranslations('candidate.nav');
  const pathname = usePathname();
  return (
    <nav className="border-border bg-surface-2 fixed inset-x-0 bottom-0 z-40 border-t sm:static sm:border-t-0">
      <ul className="mx-auto flex max-w-3xl justify-around">
        {TABS.map((tab) => {
          const active = pathname === tab.href || pathname.startsWith(`${tab.href}/`);
          return (
            <li key={tab.key} className="flex-1">
              <Link
                href={tab.href}
                className={cn(
                  'flex flex-col items-center gap-1 px-2 py-3 text-xs font-medium transition-colors',
                  active
                    ? 'text-[color:var(--color-primary)]'
                    : 'text-muted hover:text-foreground',
                )}
              >
                <span>{t(tab.key)}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
