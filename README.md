# Work Abroad — демо-прототип

Фронтенд-прототип вертикальной ОС международного трудоустройства: соискатели (blue-collar mobile-first), работодатели (desktop), админ-панель платформы. Mock-бэкенд через MSW, русский UI по умолчанию.

- План реализации: [docs-expressive-rainbow.md](../../../.claude/plans/docs-expressive-rainbow.md)
- HLD: [docs/HLD_FRONTEND_PROTOTYPE.md](docs/HLD_FRONTEND_PROTOTYPE.md)
- Исследование: [docs/RESEARCH_REPORT.md](docs/RESEARCH_REPORT.md)

## Запуск

```bash
pnpm install
pnpm dev
```

Откройте http://localhost:3000 — загрузится русский лендинг, под капотом MSW перехватит `GET /api/jobs` и вернёт seed-данные. Локали: `/` (ru), `/en`, `/tr`.

## Полезные скрипты

| Скрипт | Что делает |
|---|---|
| `pnpm dev` | Next.js dev-сервер (Turbopack) |
| `pnpm build` | Production build с SSG по локалям |
| `pnpm start` | Запуск production-сборки |
| `pnpm lint` | ESLint (flat config + prettier) |
| `pnpm typecheck` | `tsc --noEmit` со strict-режимом |
| `pnpm format` | Prettier write по `src/**` |
| `pnpm format:check` | Prettier check без изменений |

## Стек

- **Next.js 16** App Router + React 19 + TypeScript strict
- **Tailwind v4** (`@theme inline`, токены HLD §6.6 в `globals.css`)
- **shadcn/ui** паттерны + Radix Slot (пока только `Button`)
- **next-intl 4** — `ru`/`en`/`tr`, `localePrefix: 'as-needed'`
- **MSW 2** — Service Worker в `public/mockServiceWorker.js`
- **TanStack Query 5** + devtools
- **Zustand 5** (UI-state, ещё не используется)
- **React Hook Form + Zod** (формы, ещё не используется)
- **lucide-react**, `date-fns`, `clsx`, `tailwind-merge`, `class-variance-authority`

## Структура

```
src/
├── app/
│   ├── [locale]/layout.tsx    # html/body, NextIntlClientProvider, Providers
│   ├── [locale]/page.tsx      # лендинг
│   ├── providers.tsx          # QueryClient + MSW
│   └── globals.css            # токены HLD §6.6 + @theme inline
├── components/
│   ├── layout/                # CandidateShell/EmployerShell/AdminShell + Topbar + LanguageSwitcher
│   ├── landing/JobsPreview.tsx
│   └── ui/button.tsx
├── features/
│   ├── shared/types.ts        # Country, Industry, Currency, LocalizedText, ApiResponse
│   ├── jobs/                  # types, api, hooks (useJobs)
│   ├── employers/types.ts
│   └── pipeline/              # types + machine.ts (canTransition, nextStages, ALL_STAGES)
├── i18n/                      # routing, request, navigation
├── lib/utils.ts               # cn()
├── mocks/
│   ├── seed/{jobs,employers}.seed.ts
│   ├── db.ts                  # in-memory БД поверх seed + LocalStorage
│   ├── delay.ts               # simulatedDelay 120–600 мс (HLD §9.1)
│   ├── handlers.ts            # GET /api/jobs, /api/jobs/:id, /api/employers/:id
│   ├── browser.ts             # setupWorker
│   └── MswProvider.tsx        # client-стартер воркера
└── middleware.ts              # next-intl middleware
messages/{ru,en,tr}.json
```

## Критичные инварианты

1. Все UI-строки через `useTranslations()` — никакого хардкода.
2. Компоненты читают данные через TanStack Query → MSW. Прямой импорт `@/mocks/seed` вне `mocks/` запрещён.
3. Любое изменение `Application.status` проверяется через `canTransition`.
4. Pipeline — чистая функция в `src/features/pipeline/machine.ts` (HLD §7.1).

## Status недели 1 — DoD

- [x] `pnpm dev` → лендинг на ru, переключатель `ru/en/tr` работает через `next-intl`.
- [x] `pnpm typecheck` и `pnpm lint` — без ошибок.
- [x] `pnpm build` → SSG генерирует три статичные версии лендинга.
- [x] MSW инициализируется на клиенте, `GET /api/jobs` перехватывается — на лендинге рендерится секция «Все вакансии» с seed-данными.
- [x] `canTransition` покрывает граф из HLD §7.1 (unit-тесты — неделя 3).

Дальнейшие недели — в плане.
