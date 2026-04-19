import { useTranslations } from 'next-intl';

import { DemoRoleSwitcher } from '@/components/demo/DemoRoleSwitcher';
import { Link } from '@/i18n/navigation';

import { LanguageSwitcher } from './LanguageSwitcher';
import { NotificationBell } from './NotificationBell';

type NavItem = {
  href: '/' | '/jobs' | '/employers' | '/pricing' | '/trust' | '/about';
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

  return (
    <header className="border-border bg-surface-2 border-b">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link href="/" className="text-primary text-base font-semibold">
          {tApp('name')}
        </Link>
        <nav className="order-3 flex flex-wrap items-center gap-4 text-sm sm:order-2">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className="text-muted hover:text-foreground transition-colors"
            >
              {tNav(item.key)}
            </Link>
          ))}
          <Link href="/login" className="hover:text-foreground text-sm font-medium">
            {tNav('signIn')}
          </Link>
        </nav>
        <div className="order-2 flex items-center gap-3 sm:order-3">
          <DemoRoleSwitcher />
          <NotificationBell />
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
}
