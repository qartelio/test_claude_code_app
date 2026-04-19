'use client';

import { useTranslations } from 'next-intl';
import type { ReactNode } from 'react';

import { Link, usePathname } from '@/i18n/navigation';
import { cn } from '@/lib/utils';

type TabKey = 'jobs' | 'applications' | 'messages' | 'profile';

type TabHref =
  | '/candidate/jobs'
  | '/candidate/applications'
  | '/candidate/messages'
  | '/candidate/profile';

interface Tab {
  href: TabHref;
  key: TabKey;
  icon: ReactNode;
}

const TABS: ReadonlyArray<Tab> = [
  { href: '/candidate/jobs', key: 'jobs', icon: <IconBriefcase /> },
  { href: '/candidate/applications', key: 'applications', icon: <IconList /> },
  { href: '/candidate/messages', key: 'messages', icon: <IconChat /> },
  { href: '/candidate/profile', key: 'profile', icon: <IconUser /> },
];

export function CandidateBottomNav() {
  const t = useTranslations('candidate.nav');
  const pathname = usePathname();
  return (
    <nav
      aria-label="Candidate navigation"
      className="glass border-border fixed inset-x-0 bottom-0 z-40 border-t pb-[env(safe-area-inset-bottom)] sm:static sm:border-t-0 sm:bg-transparent sm:backdrop-blur-none"
    >
      <ul className="mx-auto flex max-w-3xl justify-around">
        {TABS.map((tab) => {
          const active = pathname === tab.href || pathname.startsWith(`${tab.href}/`);
          return (
            <li key={tab.key} className="flex-1">
              <Link
                href={tab.href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'relative flex flex-col items-center gap-1 px-2 py-2.5 text-[11px] font-medium transition-colors',
                  active ? 'text-primary' : 'text-muted hover:text-foreground',
                )}
              >
                <span
                  className={cn(
                    'flex h-9 w-9 items-center justify-center rounded-full transition-all',
                    active ? 'bg-primary-soft scale-105' : 'scale-100',
                  )}
                >
                  {tab.icon}
                </span>
                <span>{t(tab.key)}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function IconBriefcase() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <path d="M3 13h18" />
    </svg>
  );
}

function IconList() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M8 6h13M8 12h13M8 18h13" />
      <circle cx="4" cy="6" r="1" />
      <circle cx="4" cy="12" r="1" />
      <circle cx="4" cy="18" r="1" />
    </svg>
  );
}

function IconChat() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 12a8 8 0 0 1-12.3 6.7L3 20l1.3-5.7A8 8 0 1 1 21 12Z" />
    </svg>
  );
}

function IconUser() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </svg>
  );
}
