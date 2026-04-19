'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';

import { DemoRoleSwitcher } from '@/components/demo/DemoRoleSwitcher';
import { useAuthStore } from '@/features/auth/store';
import type { UserRole } from '@/features/auth/types';
import { Link, usePathname, useRouter } from '@/i18n/navigation';
import { cn } from '@/lib/utils';

import { LanguageSwitcher } from './LanguageSwitcher';
import { NotificationBell } from './NotificationBell';

type NavHref = '/' | '/jobs' | '/employers' | '/pricing' | '/trust' | '/about';

type NavItem = {
  href: NavHref;
  key: string;
};

const NAV_ITEMS: ReadonlyArray<NavItem> = [
  { href: '/jobs', key: 'jobs' },
  { href: '/employers', key: 'employers' },
  { href: '/pricing', key: 'pricing' },
  { href: '/trust', key: 'trust' },
  { href: '/about', key: 'about' },
];

export function Topbar() {
  const tApp = useTranslations('app');
  const tNav = useTranslations('nav');
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const signOut = useAuthStore((s) => s.signOut);
  const mounted = useIsMounted();

  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isAuthed = mounted && user.role !== 'guest';

  const closeMenu = () => setOpen(false);

  const handleSignOut = () => {
    signOut();
    closeMenu();
    router.replace('/');
  };

  return (
    <header
      className={cn(
        'sticky top-0 z-40 transition-all duration-200',
        scrolled
          ? 'glass border-border/80 border-b shadow-[0_1px_0_rgba(15,23,42,0.04)]'
          : 'bg-surface-2/80 border-b border-transparent backdrop-blur',
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="group flex items-center gap-2">
          <span className="bg-brand-gradient flex h-9 w-9 items-center justify-center rounded-xl text-white shadow-[0_4px_14px_-4px_rgba(37,99,235,0.5)] transition-transform group-hover:scale-105">
            <LogoMark />
          </span>
          <span className="text-foreground text-base font-semibold tracking-tight">
            {tApp('name')}
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.key}
                href={item.href}
                className={cn(
                  'rounded-full px-3.5 py-1.5 text-sm font-medium transition-all',
                  active
                    ? 'text-primary bg-primary-soft'
                    : 'text-muted hover:text-foreground hover:bg-surface-muted',
                )}
              >
                {tNav(item.key)}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-2 md:flex">
            <DemoRoleSwitcher />
            <NotificationBell />
            <LanguageSwitcher />
            {isAuthed ? (
              <UserMenu
                displayName={user.displayName}
                role={user.role}
                onSignOut={handleSignOut}
                tNav={tNav}
              />
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-muted hover:text-foreground ml-1 rounded-full px-3 py-1.5 text-sm font-medium transition-colors"
                >
                  {tNav('signIn')}
                </Link>
                <Link
                  href="/signup"
                  className="bg-brand-gradient ml-1 inline-flex h-9 items-center justify-center rounded-full px-4 text-sm font-semibold text-white shadow-[0_4px_14px_-4px_rgba(37,99,235,0.5)] transition-transform hover:scale-[1.02] hover:shadow-[0_6px_20px_-4px_rgba(37,99,235,0.6)]"
                >
                  {tNav('signUp')}
                </Link>
              </>
            )}
          </div>

          <div className="flex items-center gap-1 md:hidden">
            <NotificationBell />
            <LanguageSwitcher />
            <button
              type="button"
              aria-label="Menu"
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="hover:bg-surface-muted text-foreground inline-flex h-10 w-10 items-center justify-center rounded-full transition-colors"
            >
              {open ? <IconClose /> : <IconMenu />}
            </button>
          </div>
        </div>
      </div>

      {open ? (
        <div className="border-border bg-surface-2 border-t md:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3">
            {NAV_ITEMS.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  onClick={closeMenu}
                  className={cn(
                    'rounded-xl px-3 py-2.5 text-base font-medium transition-colors',
                    active
                      ? 'text-primary bg-primary-soft'
                      : 'text-foreground hover:bg-surface-muted',
                  )}
                >
                  {tNav(item.key)}
                </Link>
              );
            })}
            <div className="border-border mt-2 flex flex-col gap-2 border-t pt-3">
              <DemoRoleSwitcher />
              {isAuthed ? (
                <>
                  <div className="bg-surface-muted flex items-center gap-3 rounded-xl px-3 py-2">
                    <Avatar name={user.displayName} />
                    <div className="flex flex-col">
                      <span className="text-foreground text-sm font-semibold">
                        {user.displayName}
                      </span>
                      <span className="text-muted text-xs capitalize">{user.role}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="border-border bg-surface-2 hover:bg-surface-muted inline-flex h-11 items-center justify-center rounded-xl border px-4 text-sm font-semibold"
                  >
                    {tNav('signOut')}
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={closeMenu}
                    className="border-border bg-surface-2 hover:bg-surface-muted inline-flex h-11 items-center justify-center rounded-xl border px-4 text-sm font-semibold"
                  >
                    {tNav('signIn')}
                  </Link>
                  <Link
                    href="/signup"
                    onClick={closeMenu}
                    className="bg-brand-gradient inline-flex h-11 items-center justify-center rounded-xl px-4 text-sm font-semibold text-white shadow-[0_4px_14px_-4px_rgba(37,99,235,0.5)]"
                  >
                    {tNav('signUp')}
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}

interface UserMenuProps {
  displayName: string;
  role: UserRole;
  onSignOut: () => void;
  tNav: (key: string) => string;
}

function UserMenu({ displayName, role, onSignOut, tNav }: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative ml-1">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="border-border bg-surface-2 hover:border-primary/40 hover:bg-primary-soft/40 inline-flex h-9 items-center gap-2 rounded-full border py-1 pr-3 pl-1 text-sm font-semibold transition-all"
      >
        <Avatar name={displayName} size="sm" />
        <span className="max-w-[120px] truncate">{displayName}</span>
        <IconChevron />
      </button>

      {open ? (
        <div
          role="menu"
          className="border-border bg-surface-2 shadow-elevated absolute right-0 mt-2 w-64 overflow-hidden rounded-2xl border"
        >
          <div className="bg-surface-muted/60 border-border flex items-center gap-3 border-b px-4 py-3">
            <Avatar name={displayName} />
            <div className="flex flex-col">
              <span className="text-foreground text-sm font-semibold">{displayName}</span>
              <span className="text-muted text-xs capitalize">{role}</span>
            </div>
          </div>
          {role === 'candidate' ? (
            <Link
              href="/candidate/profile"
              onClick={() => setOpen(false)}
              className="text-foreground hover:bg-surface-muted block px-4 py-2.5 text-sm"
              role="menuitem"
            >
              {tNav('profile')}
            </Link>
          ) : null}
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onSignOut();
            }}
            role="menuitem"
            className="text-danger hover:bg-surface-muted block w-full px-4 py-2.5 text-left text-sm font-semibold"
          >
            {tNav('signOut')}
          </button>
        </div>
      ) : null}
    </div>
  );
}

interface AvatarProps {
  name: string;
  size?: 'sm' | 'md';
}

function Avatar({ name, size = 'md' }: AvatarProps) {
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p.charAt(0))
    .join('')
    .toUpperCase();

  const sizeClass = size === 'sm' ? 'h-7 w-7 text-[11px]' : 'h-9 w-9 text-xs';

  return (
    <span
      aria-hidden
      className={cn(
        'bg-brand-gradient inline-flex shrink-0 items-center justify-center rounded-full font-bold text-white',
        sizeClass,
      )}
    >
      {initials || 'U'}
    </span>
  );
}

function useIsMounted(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

function LogoMark() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3a14 14 0 0 1 0 18" />
      <path d="M12 3a14 14 0 0 0 0 18" />
    </svg>
  );
}

function IconMenu() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

function IconClose() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

function IconChevron() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
