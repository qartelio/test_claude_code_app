import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['ru', 'en', 'tr'] as const,
  defaultLocale: 'ru',
  localePrefix: 'as-needed',
  pathnames: {
    '/': '/',
    '/about': {
      ru: '/о-нас',
      en: '/about',
      tr: '/hakkimizda',
    },
    '/employers': {
      ru: '/для-работодателей',
      en: '/for-employers',
      tr: '/isverenler-icin',
    },
    '/pricing': {
      ru: '/тарифы',
      en: '/pricing',
      tr: '/fiyatlar',
    },
    '/trust': {
      ru: '/доверие',
      en: '/trust',
      tr: '/guven',
    },
    '/login': {
      ru: '/вход',
      en: '/login',
      tr: '/giris',
    },
    '/signup': {
      ru: '/регистрация',
      en: '/signup',
      tr: '/kayit',
    },
    '/jobs': {
      ru: '/вакансии',
      en: '/jobs',
      tr: '/isler',
    },
    '/jobs/[id]': {
      ru: '/вакансии/[id]',
      en: '/jobs/[id]',
      tr: '/isler/[id]',
    },
    '/candidate/onboarding': {
      ru: '/соискатель/онбординг',
      en: '/candidate/onboarding',
      tr: '/aday/kayit',
    },
    '/candidate/jobs': {
      ru: '/соискатель/вакансии',
      en: '/candidate/jobs',
      tr: '/aday/isler',
    },
    '/candidate/applications': {
      ru: '/соискатель/заявки',
      en: '/candidate/applications',
      tr: '/aday/basvurular',
    },
    '/candidate/applications/[id]': {
      ru: '/соискатель/заявки/[id]',
      en: '/candidate/applications/[id]',
      tr: '/aday/basvurular/[id]',
    },
    '/candidate/profile': {
      ru: '/соискатель/профиль',
      en: '/candidate/profile',
      tr: '/aday/profil',
    },
    '/candidate/documents': {
      ru: '/соискатель/документы',
      en: '/candidate/documents',
      tr: '/aday/belgeler',
    },
    '/candidate/messages': {
      ru: '/соискатель/сообщения',
      en: '/candidate/messages',
      tr: '/aday/mesajlar',
    },
  },
});

export type Locale = (typeof routing.locales)[number];
export type AppPathname = keyof typeof routing.pathnames;
