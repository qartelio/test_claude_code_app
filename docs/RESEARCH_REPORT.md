# Исследовательский отчёт: SaaS-платформа международного трудоустройства

*Сгенерировано: 2026-04-17 · Источников: 28 · Уровень уверенности: средне-высокий*

---

## Executive Summary

1. **Рынок растёт**. Глобальный рынок онлайн-рекрутмента: $33.78B (2024) → $35.94B (2025) → прогноз $58.94B к 2033. Внутри него seasonal/hospitality/agriculture — самый быстрорастущий и самый фрагментированный сегмент; сильного международного агрегатора именно для blue-collar миграции пока нет.
2. **Бизнес-модель «деньги с соискателя» — красная зона**. ILO Convention 181 и принцип Employer Pays прямо запрещают брать деньги с работника. Оплата соискателем = индикатор принудительного труда по определению ILO и риск попасть в чёрные списки UK GLAA, EU, US TVPA. Основная выручка должна идти от работодателя и партнёров, а не от работника.
3. **Главные направления дохода** (в порядке приоритета): (a) B2B-подписка работодателя + per-seat ATS, (b) success fee / pay-per-hire за подтверждённую посадку на место работы, (c) партнёрские комиссии (визовые центры, страхование, авиабилеты, перевод документов), (d) premium-верификация работодателя как знак доверия. Монетизация соискателя — только если он получает реальную дополнительную ценность (ускоренный перевод документов, подготовка к интервью), и никогда — как плата «за доступ к работе».
4. **Стек**. Для описанного профиля (мульти-тенантность, видео, документы, pipeline, мобильный фронт + десктоп-бэкофис, быстрая итерация с Claude Code) наилучший компромисс: **Next.js 15 (App Router) + React Native/Expo или PWA** для двух клиентов, **Django 5 + DRF** или **NestJS** как ядро, **PostgreSQL + RLS** для мульти-тенантности, **Mux или Cloudflare Stream** для видео, **S3-совместимое хранилище** для документов, **Stripe/Paddle** для биллинга, **Keycloak или Auth.js + OAuth2/JWT** для авторизации. Обоснование внутри.
5. **UX-разрыв двух сторон — фундаментальный**. Соискатели часто имеют низкую цифровую грамотность, ограниченный английский и слабый интернет. Нужны: аудио-инструкции, иконки вместо текста, оффлайн-черновики, мультиязычность с самого первого экрана, минимум полей на шаг. Работодатели — наоборот, профессиональный ATS-воркфлоу.
6. **Доверие — ваш главный моут**. Рынок международной миграции отравлен мошенничеством. Верификация работодателя (юр.лицо, GLAA/POEA/приравненные лицензии, референсы), прозрачный pipeline, эскроу за логистику, публичная история посадок — это не «фича», а условие входа на рынок.
7. **Правовые риски неравномерны по странам**. UK Seasonal Worker Visa работает только через ~7 licensed scheme operators (нельзя напрямую быть спонсором). Южная Корея EPS — полностью государственный процесс через МоУ с 16 странами; частная платформа не может заменить EPS, но может сопровождать подготовку. Турция — полу-свободный рынок, максимум возможностей для прямых сделок. Это влияет на то, где какой бизнес-режим применим.

**Главный вывод**: стройте не «ещё один job board», а **вертикальную операционную систему международного трудоустройства** — с доверием, compliance и pipeline как ядром продукта. Монетизация идёт от работодателя и партнёров. Соискателя вы защищаете — это же становится и маркетинговым сообщением, и юридической подушкой.

---

## 1. Рынок и конкурентный ландшафт

### 1.1 Размер рынка

- Global online recruitment platform market: $33.78B (2024) → $35.94B (2025) → $58.94B к 2033 ([Business Research Insights](https://www.businessresearchinsights.com/market-reports/online-recruitment-platform-market-120394)).
- Hospitality + agriculture — структурно дефицитные по труду сегменты: сильно зависят от виртуальных инструментов найма из-за сезонных пиков и мобильности персонала ([Business Research Insights](https://www.businessresearchinsights.com/market-reports/online-recruitment-platform-market-120394)).
- Только Южная Корея по EPS в 2024 имела ~1.01 млн иностранных рабочих, ~303 тыс. на E-9 визах ([East Asia Forum](https://eastasiaforum.org/2025/10/31/south-koreas-migrant-workers-trapped-in-a-legal-cage/)).
- UK Seasonal Worker Scheme 2026: 42 900 квотных мест (41 000 в горт., 1 900 в птицеводстве) ([Davidson Morris](https://www.davidsonmorris.com/seasonal-worker-visa-uk/)).

### 1.2 Ключевые игроки и их ниши

| Игрок | Модель | Что делает хорошо | Слабое место |
|---|---|---|---|
| **[seasonal.work](https://www.seasonal.work/)** | Агрегатор сезонных вакансий в 60+ странах | Фильтры по визам, сезонам, жилью; широкая география | Слабый end-to-end: не тянет pipeline и документы |
| **[Anyworkanywhere](https://www.anyworkanywhere.com/)** | Классифайд с 2001 | Бренд, SEO | Статика, нет системы доверия и ATS |
| **[CoolWorks](https://www.coolworks.com/)** | Листинг + комьюнити (США, нац.парки, курорты) | Крепкое комьюнити, узкая ниша | Только США |
| **[Seasonal Connect](https://seasonalconnect.com/)** | Hospitality-focused | База работодателей, операционный фокус | Нишевая, не международная |
| **[Skills Provision](https://www.skills-provision.com/seasonal-recruitment-services)** | Агентство, не платформа | Flexible pricing (success, retained, flat) | Не SaaS, зависит от рекрутеров |
| **[Job in Global](https://www.jobinglobal.com/en/turkiyede-is)** | Узкий плеер на Турцию | 986 посадок в отелях в 2024; пакет «жильё+питание+страховка» | Не продукт, а операция |
| **[HOPS](https://www.hopslaboursolutions.com/sws-scheme-for-workers)** | UK scheme operator | Законный спонсор визы | Одна страна, одна виза |
| **[Workaway](https://www.workaway.com/wages)** | Обмен труд-за-жильё | Подписка с туриста, а не найм | Не работа, а волонтёрство |

**Пробел на рынке**: никто не закрывает одновременно (а) международный охват направлений, (б) end-to-end pipeline с документами/визой/логистикой, (в) мобильный UX для blue-collar соискателя, (г) сильную верификацию работодателя. Это и есть ниша продукта.

### 1.3 Опосредованные конкуренты

- **[Deel](https://www.deel.com/)** — EOR/payroll, зашёл в сорсинг, но фокус на white-collar remote. Может в будущем проглотить часть рынка, если построит hospitality/seasonal вертикаль.
- **[Jobvite](https://peoplemanagingpeople.com/tools/jobvite-review/)**, **[Workable](https://resources.workable.com/tutorial/hiring-blue-collar-workers)** — ATS общего назначения. Работодатели иногда используют их и для blue-collar, но без pipeline виз/логистики.
- **Тёмный сегмент** — полуофициальные агентства в странах-донорах (Узбекистан, Кыргызстан, Вьетнам, Непал). Именно от них платформа должна защитить соискателя.

---

## 2. Правовой и регуляторный ландшафт (по направлениям)

### 2.1 UK — Seasonal Worker Visa (strawberry picking, птицеводство)

- Работает **исключительно** через ~7 **licensed scheme operators** (HOPS, AG Recruitment, Pro-Force, Concordia, Fruitful Jobs и др.), имеющих A-rated sponsor licence, эндорсмент DEFRA и лицензию **GLAA (Gangmasters and Labour Abuse Authority)** ([Davidson Morris](https://www.davidsonmorris.com/seasonal-worker-visa-uk/), [Richmond Chambers](https://immigrationbarrister.co.uk/personal-immigration/short-term-work-visas/seasonal-worker-visa/)).
- Индивидуальные фермы **не могут** быть прямыми спонсорами. Работник едет до 6 месяцев в 10-месячном цикле.
- **Следствие для платформы**: либо партнёримся с scheme operators как white-label-технология для них (B2B2C), либо сами подаёмся на sponsor licence (долго, дорого, но даёт эксклюзивный контроль).
- Квота 2026: 42 900 мест ([Davidson Morris](https://www.davidsonmorris.com/seasonal-worker-visa-uk/)).

### 2.2 Южная Корея — EPS (Employment Permit System)

- EPS — государственная программа с 2004 года, МоУ между Кореей и 16 странами (Вьетнам, Непал, Филиппины, Бангладеш, Индонезия, Таиланд, Камбоджа, Шри-Ланка, Монголия, Узбекистан, Кыргызстан, Пакистан, Мьянма, часть Китая, Лаос, Таджикистан с 2023) ([East Asia Forum](https://eastasiaforum.org/2025/10/31/south-koreas-migrant-workers-trapped-in-a-legal-cage/), [Global Skill Partnerships](https://gsp.cgdev.org/legalpathway/employment-permit-system-eps/)).
- Тестирование корейского (EPS-TOPIK), медосмотр, пул кандидатов формирует гос.оператор страны-донора. Частные рекрутеры **не могут** продавать эти визы напрямую.
- Работодатели — фирмы <300 человек, E-9 виза до 4 лет 10 месяцев, зарплата ~2.06 млн KRW/мес ([careers.niveshcalculator.in](https://careers.niveshcalculator.in/employment-permit-system/), [East Asia Forum](https://eastasiaforum.org/2025/10/31/south-koreas-migrant-workers-trapped-in-a-legal-cage/)).
- **Следствие для платформы**: Корея — **сопровождающий, а не замещающий** продукт. Ценность: подготовка к EPS-TOPIK, чек-лист документов, трекинг статуса в гос.системе, пост-прибытие поддержка, поиск работодателя внутри legal pool.

### 2.3 Турция — отели

- Полу-открытый рынок, множество частных агентств (Manpower Turkey, Gi Group, Oman Agencies, EventPro, Job in Global) и массовый прямой наём по сезону ([Manpower Turkey](https://manpowerturkey.com/hospitality-recruitment-agency-in-turkey/), [Soundlines](https://soundlinesgroup.com/turkey/hospitality-manpower-recruitment-agencies-in-turkey/)).
- Требуется Turkish work permit (Çalışma İzni), оформляется работодателем. Визовая часть не доминирует — ограничитель, скорее, договор и депозит работодателя.
- **Следствие**: здесь платформа может работать **напрямую**: собирать работодателя и соискателя, брать success fee или подписку.

### 2.4 ЕС — заводская работа

- Неоднородная картина. Польша, Чехия, Нидерланды, Германия имеют отдельные режимы (Posted Workers Directive, национальные рабочие визы для non-EU).
- Запрет брать деньги с работника закреплён на уровне директив ЕС и ILO.
- Требуется соблюдение **GDPR** при обработке CV/паспортов ([ICO guide](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/international-transfers/international-transfers-a-guide/)).

### 2.5 Универсальный пласт — ILO Convention 181 / Employer Pays Principle

- Private Employment Agencies Convention, 1997 (No. 181): *«Агентства не должны прямо или косвенно, полностью или частично, взимать сборы с работников»* ([ILO 2024 brochure](https://www.ilo.org/sites/default/files/2024-10/Brochure_Recuitment_fees_web.pdf)).
- ILO определяет уплату recruitment fees работником как **индикатор принудительного труда** ([Ardea International](https://www.ardeainternational.com/thinking/the-hidden-cost-of-employment-tackling-illegal-recruitment-fees/)).
- Consumer Goods Forum и крупные бренды (Marks & Spencer, Unilever, Tesco) по цепочке поставок требуют подтверждения Employer Pays Principle у поставщиков труда ([CGF guidance](https://www.theconsumergoodsforum.com/wp-content/uploads/2022/10/2022-HRC-Guidelines-on-Repayment-of-Recruitment-Fees.pdf)).

**Практическое следствие для архитектуры монетизации**: если вы работаете с UK-сетями супермаркетов (через farms) или корпоративными отельными группами, бизнес-партнёры будут **проверять** ваш модель оплат. Взимать с соискателя placement fee — значит потерять корпоративный канал полностью. См. раздел 4.

---

## 3. Риски доверия и безопасности

### 3.1 Масштаб проблемы

- Overseas job scams — массовое явление: fake offers, upfront payments за «обработку визы», кража паспортных данных ([ICMPD 2025](https://www.icmpd.org/blog/2025/the-digital-trap-how-fake-job-ads-exploit-aspiring-migrants), [GetGIS 2026](https://getgis.org/blog/10-most-common-work-abroad-scams-and-ways-to-avoid-them)).
- Типичные жертвы — рабочие из сельских/низкодоходных регионов, незнакомые с официальным процессом ([Respicio Philippines](https://www.respicio.ph/commentaries/job-offer-scams-and-overseas-employment-fraud-how-to-verify-and-report-philippines)).

### 3.2 Что должно быть встроено в платформу

1. **Верификация работодателя** до публикации первой вакансии:
   - юридические документы (регистрация, налоговый номер);
   - отраслевые лицензии (GLAA для UK, POEA/DMW для Филиппин как принимающая/отправляющая, EPS-registration для Кореи);
   - банковский счёт юрлица (не физлица);
   - видеозвонок с представителем (подтверждение что компания реальна);
   - внешние проверки (OpenCorporates, local registries).
2. **Никогда не показывать** соискателю работодателя, который не прошёл верификацию (можно «показывать, но с маркировкой unverified» — это рабочий паттерн, как в Airbnb).
3. **Эскроу логистики**: если платформа собирает деньги за билеты/визу, работодатель платит авансом в эскроу, соискатель получает биллинг-прозрачность, возврат при отмене рейса.
4. **Pipeline как контракт**: каждый статус в pipeline = юридический артефакт (offer letter, visa approval, ticket PDF), хранящийся в платформе. Это и защищает соискателя, и даёт работодателю аудит.
5. **Public trust layer**: количество успешных посадок по работодателю, рейтинги от вернувшихся работников (после возвращения, не во время работы — иначе давление).
6. **Fraud hotline/chat** на языках стран-доноров.

**Дифференциатор**: конкуренты продают «больше вакансий». Вы продаёте «ни один соискатель не обманут».

---

## 4. Бизнес-модель и монетизация (ключевой блок)

### 4.1 Принцип

> Платформа делает деньги на работодателе и на сопутствующих сервисах. Соискатель платит только за **опциональные услуги с понятной альтернативой**, и никогда — за доступ к вакансии.

Это не только этический выбор: это единственная модель, совместимая с [ILO C181](https://www.ilo.org/sites/default/files/wcmsp5/groups/public/@ed_protect/@protrav/@migrant/documents/publication/wcms_703485.pdf), с требованиями корпоративных покупателей труда (Consumer Goods Forum), с законами UK (Employment Agencies Act), Филиппин (DMW anti-fee rule), EU.

### 4.2 Разбор моделей

#### A. B2B-подписка работодателя (⭐ основной столп)

- **Как**: tiered plans по числу активных вакансий, пользователей, кандидатов в pipeline. Аналоги ATS-пейволла.
- **Бенчмарк**: SMB $250–$1 000/мес, midmarket $3k–$15k/год, enterprise $15k–$50k+/год; per-user $30–$120/мес ([Kula ATS pricing 2025](https://www.kula.ai/blog/ats-pricing)). Zoho Recruit: $25/$59/user/month ([G2 ATS pricing](https://learn.g2.com/applicant-tracking-systems-pricing)).
- **Стартовая структура**:
  - **Starter** (€79/мес): до 3 активных вакансий, 50 активных кандидатов, 1 рекрутёр.
  - **Growth** (€299/мес): до 15 вакансий, 500 кандидатов, 5 мест, видео-интервью, email-кампании.
  - **Scale** (€899/мес): безлимит вакансий, 10 мест, API, SSO, DPA.
  - **Enterprise** — индивидуально.
- **Риски**: длинный sales cycle у крупных работодателей; против этого — самообслуживание и бесплатный trial с 1 вакансией.
- **UX-влияние**: нет на соискателя; у работодателя — стандартный SaaS-чекаут.
- **Архитектура**: tenant = employer account; план привязан к tenant, feature flags через plan.

#### B. Success fee / pay-per-hire (⭐ второй столп)

- **Как**: процент от первого месяца/сезона зарплаты после подтверждения «Прибыл на место работы» (статус 9 в вашем pipeline).
- **Бенчмарк**: агентства берут 15–25% годовой зарплаты white-collar; для blue-collar seasonal более реалистично **фиксированная сумма €100–€400 за посадку** или 8–12% от сезонного заработка. Skills Provision работает с flexible success-based fees ([Skills Provision](https://www.skills-provision.com/seasonal-recruitment-services)).
- **Почему выгодно**: выравнивает стимулы — работодатель платит, когда платформа реально работает.
- **Риски**: работодатель может пытаться увести кандидата offline, чтобы не платить. **Митигация**: контракт привязан к offer letter, сгенерированному платформой; анти-обход правила (attribution window 6 мес. с первого контакта); success fee частично взимается уже на статусе 5 «Одобрен» с возвратом при отмене.
- **UX-влияние**: на соискателя — ноль; он видит только прозрачный процесс.
- **Архитектура**: события pipeline = триггеры выставления счетов; нужна event-driven billing (Stripe Billing + webhooks).

#### C. Комиссия с партнёрских сервисов (⭐⭐ высокий потенциал)

Когда соискатель готовится к поездке, возникает 5–10 денежных транзакций: виза, медосмотр, страховка, перевод документов, авиабилет, трансфер, сим-карта, валютный обмен.

- **Как**: платформа агрегирует эти услуги от партнёров и берёт партнёрскую комиссию **с цены, оплаченной работодателем** (или прозрачно с соискателя, но только если альтернатива очевидна и цена не хуже рыночной).
- **Бенчмарк**: авиакомпании — 3–7%, страховка — 15–25%, визовые центры — fixed fee на заявку.
- **Этическая граница**: если работодатель оплачивает логистику по контракту (что стандартно для UK/EPS), комиссия платформы незаметна и этически чиста. Если соискатель сам покупает страховку — показывайте её как опцию, не блокируйте pipeline.
- **Риски**: комиссия не должна искажать рекомендации (показывайте дешёвый вариант первым).
- **UX-влияние**: встроенный «чек-лист поездки» с прямой покупкой в один клик — одновременно полезная функция и канал монетизации.

#### D. Premium Employer / Verified Badge

- **Как**: платный расширенный verification status + промо-слоты в топе выдачи для верифицированных работодателей.
- **Бенчмарк**: аналог LinkedIn «Premium Company», Glassdoor Enhanced Profile.
- **Цена**: €500–€2 000/год сверх подписки.
- **Плюс**: усиливает доверие (работодатели платят за знак качества).
- **Риски**: не должен превращаться в pay-to-play; unverified не значит «плохой» — он просто помечен.

#### E. Монетизация соискателя — только «мягкие» варианты

Допустимо (при жёстких ограничениях):

- **Ускоренный перевод и нотариальное заверение** документов (конкретная услуга, понятная цена, понятная альтернатива — самостоятельно в городе).
- **Premium video coaching** — 20-минутная консультация по видео-интро.
- **Sponsored learning** — платные курсы языка с сертификатом. Но только если качество реально.

Недопустимо:

- **Placement fee / доступ к вакансиям** — незаконно и разрушает доверие.
- **Pay-to-apply / priority apply** — этически токсично на рынке с низкодоходными соискателями. Если и делать — только бесплатно (например, даётся при сильном профиле).
- **Верификация профиля за плату** — создаёт двухуровневую систему и дискриминацию.

Ограничение Apple/Google: нельзя принудительно проводить платежи соискателя через их IAP для услуг, не являющихся digital goods — это не проблема, но учитывайте.

#### F. Реклама

- **Не делайте** display-рекламу в приложении соискателя. Это выглядит как «мы продаём твоё внимание третьим лицам», убивает доверие у целевой аудитории и блокируется корпоративными байерами.
- Рекламировать можно только **внутренние** спонсорские размещения вакансий (см. G).

#### G. Sponsored job listings

- **Как**: boost для вакансии внутри поиска.
- **Бенчмарк**: pay-per-application или pay-per-view, $0.5–$3 за apply.
- **Работает** на рынке с большим числом работодателей; до тех пор — отключаем.

### 4.3 Рекомендуемый микс на 24 месяца

| Квартал | Основной драйвер | Второй | Цель |
|---|---|---|---|
| Q1–Q2 | Free tier + Starter B2B ($79) | Ручной success fee (контракт) | Запуск 2 вертикалей (Турция отели + UK ягоды через scheme operator) |
| Q3–Q4 | Автоматизированный B2B + per-hire биллинг | Партнёрская комиссия за страховку/билеты | 50+ платящих работодателей, 1000+ посадок |
| Год 2, H1 | Enterprise + Verified Badge | Партнёрская программа | Контракты с корп.сетями |
| Год 2, H2 | Sponsored listings | Опц. premium для соискателя (coaching) | Двухсторонняя сетевая плотность |

### 4.4 Что заложить в архитектуру уже сейчас

- `Subscription` и `Invoice` как first-class сущности, привязанные к tenant.
- События pipeline (`status_changed → hired`) опубликованы в bus (Kafka/RabbitMQ/outbox) → отдельный billing service слушает и генерирует fee invoice.
- Отдельный **Partner Catalog** (визовые центры, страховщики, авиалинии) с commission tracking и attribution.
- Feature flags привязаны к plan_id (LaunchDarkly/Unleash/собственный).
- Audit log всех денежных событий — и для compliance, и для disputes.

---

## 5. Технологический стек

### 5.1 Контекст требований

- Мульти-тенантность (каждый работодатель — tenant).
- Две принципиально разные фронт-среды (mobile-first для соискателей, desktop-first для работодателей).
- Большие бинарники (видео-визитки, паспорта, сертификаты).
- Pipeline со сложными состояниями, уведомлениями, audit-log.
- i18n 5+ языков на старте, RTL поддержка (арабский для трудовых коридоров).
- Высокая плотность compliance (GDPR, ILO, UK/EU/KR законы).
- Команда предположительно небольшая, итеративная разработка с Claude Code.

### 5.2 Рекомендация

| Слой | Выбор | Альтернатива | Почему |
|---|---|---|---|
| **Фронт-соискатель** | **Expo (React Native)** с PWA fallback | Pure PWA на Next.js | Нужен фоновый upload видео, push-уведомления, камера — всё это родное в Expo. PWA для распространения без магазинов. |
| **Фронт-работодатель** | **Next.js 15 (App Router, RSC)** | Remix | SSR для скорости ATS-таблиц, edge functions, хорошая типизация, зрелая экосистема ([Techarion 2025](https://techarion.com/blog/building-saas-application-nextjs-django-rest-framework)) |
| **Backend** | **Django 5 + DRF** | NestJS (Node) или FastAPI | Django batteries-included: admin панель almost free, сильный ORM, зрелые i18n/timezone, готовые пакеты django-tenants, django-allauth, django-rest-framework. Быстрее выкатить ATS-логику ([Medium — Django multi-tenant SaaS 2026](https://medium.com/@yogeshkrishnanseeniraj/building-a-multi-tenant-saas-in-django-complete-2026-architecture-e956e9f5086a)) |
| **DB** | **PostgreSQL 16 + Row-Level Security** | MySQL | RLS — это гарантия изоляции тенантов на уровне БД, а не кода ([Medium — RLS Django guide](https://medium.com/@yogeshkrishnanseeniraj/complete-guide-using-postgresql-rls-row-level-security-in-django-for-enterprise-saas-28da70684372)). Альтернатива — django-tenants (schema-per-tenant), но RLS дешевле в эксплуатации для SMB-тенантов, коих будут тысячи |
| **Очереди** | **Celery + Redis** или **RQ** | Dramatiq, SQS | Celery родной для Django; отложенные задачи для видео-кодирования, отправки уведомлений, биллинга |
| **Видео** | **Mux** или **Cloudflare Stream** | Самостоятельно на S3+MediaConvert | Mux: $0.07/min encoding + $0.025/min delivery; CF Stream: $1/1000min stored + $5/1000min delivered ([Mux vs S3](https://www.mux.com/blog/mux-is-cheaper-than-s3), [Build MVP Fast pricing](https://www.buildmvpfast.com/api-costs/video)). Для стартапа с 50-секундными intros — Stream дешевле при низком storage; Mux — для более крупной библиотеки и аналитики |
| **Документы** | **AWS S3** или **Cloudflare R2** | MinIO on-prem | R2 — без egress-fees, критично для cross-region. Шифрование на стороне сервера + подписанные URL с коротким TTL |
| **Auth** | **Django + SimpleJWT** для API + **Auth.js** на Next.js | Keycloak, Auth0, Clerk | Роли (candidate/employer/admin), OAuth2 социалки, MFA для работодателей. Auth0/Clerk — быстрее, но дороже на масштабе |
| **Payments** | **Stripe** (+ **Paddle** как MoR для глобального VAT/GST) | Braintree | Stripe Billing покрывает subscriptions + metered usage + invoicing |
| **Уведомления** | **Expo Push + FCM/APNs** для мобильного, **Postmark/Resend** для email, **in-app** через WebSocket (Django Channels) | Pusher, OneSignal | Стандартный недорогой стек |
| **Поиск** | **PostgreSQL full-text + pg_trgm** на старте → **Meilisearch** или **Typesense** | Elasticsearch | Вакансии с фильтрами по стране/зарплате — PG справится до 100k вакансий. Переезд в Meili — когда нужны фасетные фильтры |
| **Аналитика** | **PostHog** (self-host) | Mixpanel, Amplitude | Product analytics + session replay + feature flags в одном флаконе |
| **Observability** | **Sentry** + **Grafana + Loki + Prometheus** | Datadog | Sentry must; Grafana stack — дёшево |
| **CI/CD** | **GitHub Actions** | GitLab CI | Стандарт |
| **Deployment** | **Fly.io** или **Railway** для старта; **AWS ECS/Fargate** или **Kubernetes** на масштабе | Render, Vercel (только фронт) | Fly.io: быстрый региональный деплой близко к пользователям (важно для Азии/Турции) |
| **Интернационализация** | `django-modeltranslation` + **Crowdin/Lokalise** для переводов | i18next только на фронте | Нужна i18n и на серверных шаблонах (offer letters, emails) |

### 5.3 Мульти-тенантность: выбор стратегии

Три подхода ([Simform engineering](https://medium.com/simform-engineering/mastering-multi-tenant-architectures-in-django-three-powerful-approaches-178ff527c03f), [django-tenants docs](https://django-tenants.readthedocs.io/)):

1. **Database-per-tenant** — максимальная изоляция, дорогая эксплуатация, оправдано только для regulated enterprise (банки).
2. **Schema-per-tenant** (django-tenants) — хорошая изоляция, проблемы с миграциями и join-ами через тенантов.
3. **Shared schema + RLS** (рекомендую) — самая дешёвая эксплуатация, сильная изоляция на уровне БД, легко мигрировать и анализировать cross-tenant (например, для платформенного админа). Paper cuts с RLS (RLS expressions на каждый запрос, tenant context через session variables) решаются один раз middleware-ом.

**Решение**: Shared schema + RLS, с опциональным upgrade в schema-per-tenant для enterprise-клиентов.

### 5.4 Почему не другие популярные стеки

- **Supabase + Next.js** — быстрый старт, но привязка к BaaS; сложно реализовать кастомный pipeline, audit log, нестандартные RBAC. Хорош для MVP недельного масштаба, не для описанного продукта.
- **Firebase** — аналогично, плюс cost explosion при видео и документах.
- **Ruby on Rails** — отличная альтернатива Django; решайте по команде. Экосистема рекрутинга чуть слабее.
- **Pure Node/NestJS** — мощно, но больше boilerplate по сравнению с Django для админки и i18n.

### 5.5 Claude Code / Cloud Code примечание

Пользователь упомянул «оптимальный стек для Cloud Code» — предполагаю, имелся в виду Claude Code (локальная инструментовка разработки). Для неё рекомендуемый стек особенно хорош: 

- сильная типизация (TS на фронте, mypy + Pydantic на бэке);
- детерминированные миграции (Django makemigrations);
- ESM + Next.js App Router дружат со статическим анализом;
- Expo CLI и CI-фриндли.

---

## 6. UX/UI стратегия

### 6.1 Два разных продукта в одном пайплайне

- **Приложение соискателя** — максимальная простота, аудио, иконки, оффлайн, мульти-язык.
- **Рабочее место работодателя** — таблицы, канбан, массовые действия, фильтры, экспорт.

Это не «одна кодовая база, адаптивный дизайн». Это **два независимых клиента**, общающихся с общим API.

### 6.2 Мобильный UX соискателя (принципы)

Выжимки из исследований низкограмотных пользователей ([Chaudry paper](https://course.ccs.neu.edu/is4300f13/ssl/chaudry.pdf), [FiftyEight India](https://fiftyeight.io/insight/developing-a-user-interface-for-low-literacy-users-in-uttar-pradesh-india/), [UX of Chinese migrant interfaces](https://uxpamagazine.org/interface_chinese_migrant_workers/?lang=en)):

1. **Язык прежде всего**: язык выбирается на первом экране до создания аккаунта. Список с флагами + нативными названиями. Минимум 5 стартовых языков (русский, турецкий, узбекский, вьетнамский, английский) + эскалация.
2. **Аудио-альтернатива везде**: инструкции, объявления вакансии, статус заявки — иконка «прослушать» рядом с текстом. TTS на локальных языках.
3. **Иконки > текст, но с подписью**. Абстрактные пиктограммы без подписи низкограмотным непонятны — всегда дублируйте.
4. **Минимум полей на экран**: один вопрос = один экран. Wizard, а не форма.
5. **Прогресс явно**: «шаг 3 из 7» + визуальный бар. Сильно снижает отказ.
6. **Офлайн-черновики**: заполнение профиля должно работать без сети, синхронизация при появлении.
7. **Камера вместо клавиатуры**: паспорт — фото, сертификат — фото; OCR на бэке. Не вынуждайте вводить текст.
8. **Видео-запись в приложении**: лимит 60 сек, авто-компрессия до 720p перед upload, прогресс-бар, wifi-only опция.
9. **Push-уведомления на смене статуса** с кратким текстом + deep-link.
10. **Анти-dark-pattern**: ни одного платного CTA в первые 5 сессий. Доверие строится через полезность, не через payment wall.

Паттерны-референсы: [Just Good Work](https://fiftyeight.io/solution/just-good-work/) (для gulf migrant workers), WhatsApp (простота), Airbnb (доверие к хостам).

### 6.3 Десктопный UX работодателя

1. **Канбан по статусам pipeline** как основной вид. Drag&drop между колонками переключает статус и триггерит нотификации.
2. **Bulk actions**: 50 кандидатов → отправить тестовое задание, пригласить на видео, отклонить с причиной.
3. **Video review queue**: смотришь видео-ответы как Tinder — тап «дальше/подходит/нет». Ключевой паттерн HireVue/Willo ([Willo](https://www.willo.video/blog/high-volume-recruiting-tools)).
4. **Фильтры по языку, опыту, доступности, наличию документов**.
5. **Таймлайн кандидата** — вся история взаимодействия.
6. **Роли внутри tenant**: Admin / Recruiter / Viewer. RBAC.
7. **Экспорт CSV/PDF** (нужно для отчётности по визам).

### 6.4 Админ-панель платформы

- Модерация вакансий (auto-flag + ручной approval).
- Верификация работодателей (workflow с запросом документов).
- Dispute resolution (работник жалуется на работодателя).
- Content/language management.
- Финансы (invoices, success fee events).
- Blacklist tenants/users.

Django admin + кастомные views закроет 80% этого бесплатно.

---

## 7. Pipeline (статусы заявки)

Исходный список из постановки задачи — хорошая основа. Предлагаемые доработки:

### 7.1 Уточнённый pipeline

| # | Статус | Кто триггерит | Артефакт | Side effects |
|---|---|---|---|---|
| 1 | **Заявка подана** (submitted) | Соискатель | Application record | Уведомление работодателю |
| 2 | **На рассмотрении** (under_review) | Работодатель (открыл) | — | Таймер SLA 72 ч работодателю |
| 3 | **Тестирование назначено** (test_assigned) | Работодатель | Test assignment | Push соискателю + дедлайн |
| 3a | **Видео запрошено** (video_requested) | Работодатель | Video brief | Push соискателю |
| 4 | **Тестирование пройдено** (test_completed) | Система по событию | Test result/video | Работодатель в очередь review |
| 5 | **Одобрен работодателем** (employer_approved) | Работодатель | Offer letter PDF | 1-й событие billing (success fee предоплата) |
| 5a | **Отклонён соискателем** (candidate_declined) | Соискатель | Reason | Fee rollback |
| 6 | **Документы: запрошены** (docs_requested) | Система | Checklist | Push соискателю |
| 6a | **Документы: загружены** (docs_submitted) | Соискатель | Scans | Работодатель/платформа verifies |
| 6b | **Документы: одобрены** (docs_approved) | Платформа | Verified docs | Trigger visa stage |
| 7 | **Виза: подана** (visa_submitted) | Партнёр-визовый центр | Visa application ID | Трекинг |
| 7a | **Виза: одобрена** (visa_approved) | Партнёр | Visa document | — |
| 7b | **Виза: отказ** (visa_denied) | Партнёр | Reason | Escalation |
| 8 | **Билеты забронированы** (tickets_booked) | Партнёр-авиа | Ticket PDF | Partner commission |
| 9 | **Прибыл на место** (arrived) | Работодатель (подтверждает) или геолокация | — | **Финальный success fee invoice** |
| 10 | **Работа начата** (employment_started) | Работодатель | Start date | Follow-up опросник через 2 недели |
| 11 | **Завершено** (completed) | Работодатель | End date | Анкета от соискателя → public rating |
| X | **Отклонён** (rejected) | Работодатель / Система | Reason enum | Видимо соискателю с причиной |
| Y | **Снят соискателем** (withdrawn) | Соискатель | Reason | — |
| Z | **Dispute** (disputed) | Любая сторона | Claim | Ручной разбор платформой |

### 7.2 Архитектурные требования к pipeline

- **State machine** с декларативными переходами (django-fsm или собственный).
- Каждый переход: transaction + domain event + audit log entry.
- **Idempotency keys** для всех внешних коллбеков (визовый центр, авиа).
- **Webhook/subscription API** наружу — работодатели смогут интегрировать свой HRIS.
- SLA-таймеры и автоматические напоминания/эскалации.
- **Отказ обязан иметь причину** (enum) — для аналитики и анти-дискриминации.

---

## 8. Уведомления и коммуникации

- **In-app** (persistent feed + badge) — основа.
- **Push** — только по критичным событиям (статус, сообщение, дедлайн). Rate-limit до 1/час.
- **Email** — транзакционные + дайджест раз в неделю.
- **SMS** — опционально для критичных (виза одобрена), дорого, но работает в Азии при слабом интернете. Twilio или локальные SMS-провайдеры для стран-доноров.
- **WhatsApp Business API** — сильно рекомендую для Турции, Узбекистана, Филиппин (WA — доминирующий канал).
- **Локализация** всех шаблонов (Crowdin/Lokalise), включая offer letter PDFs.

---

## 9. Compliance и данные

### 9.1 GDPR / UK GDPR

- **Data retention**: отказанных кандидатов — 6–12 месяцев, нанятых — весь срок работы + 5–7 лет ([ATZ CRM GDPR recruiting](https://atzcrm.com/blog/gdpr-recruitment-candidate-data/), [SkillSeek basics](https://skillseek.eu/answers/gdpr-basics-for-recruiters)).
- **Правовое основание**: legitimate interest (для активного найма) + explicit consent (для хранения в talent pool).
- **DSAR / right to erasure** — одна кнопка «удалить мои данные» должна работать; soft-delete + 30-дневная grace.
- **DPA** с каждым работодателем (они — data controller для своих кандидатов) и с каждым суб-процессором (Mux, Stripe, AWS).
- **Cross-border transfers**: SCC (Standard Contractual Clauses) в договорах, особенно при отправке данных в Корею, Турцию. UK IDTA для UK→third country ([ICO guide](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/international-transfers/international-transfers-a-guide/)).
- **Data residency**: хранить данные EU-кандидатов в EU регионе (AWS eu-central-1, Cloudflare EU), по требованию работодателя.

### 9.2 KYC работодателя

- Passport/ID verification самого работодателя (собственника/подписанта договора) через Yoti/Veriff/Onfido ([Veriff 2025 KYC docs](https://www.veriff.com/kyc/list-of-acceptable-kyc-documents)).
- Company verification: OpenCorporates API, местный реестр, sanctions screening (OFAC, EU, UK).
- Для blue-collar направлений — отдельный слой **отраслевой лицензии**: GLAA (UK), DMW (Phil), KOIS/EPS (KR).

### 9.3 Документы соискателя

- **Passport scan**: OCR + MRZ parsing + passport forensic (Veriff/Onfido detect forgeries).
- **Видео vs фото** — анти-spoofing (liveness detection).
- Хранение — шифрование at-rest, access только с audit log.
- **Минимизация**: не собирать больше, чем нужно на текущем шаге pipeline.

---

## 10. Приоритетная «дорожная карта» MVP

### Неделя 1–4: фундамент

- Мульти-тенантный Django + PG + RLS.
- Регистрация соискателя/работодателя, роли, i18n каркас (5 языков).
- Публикация вакансии, список, фильтры (страна, тип, зарплата).
- Подача заявки, минимальный профиль.

### Неделя 5–8: pipeline core

- State machine статусов 1–5 + admin интерфейс.
- Email/in-app уведомления.
- Загрузка документов + скан паспорта.
- Верификация работодателя вручную платформой.

### Неделя 9–12: видео + биллинг

- Интеграция Mux/Cloudflare Stream, запись в Expo.
- Видео-интервью workflow (запрос/запись/просмотр).
- Stripe subscriptions для работодателей + 1 success fee сценарий (ручной trigger).

### Неделя 13–16: Q1 пилота

- 1 вертикаль: Турция отели (самый простой правовой режим).
- Onboarding 5 работодателей, 500 соискателей.
- Анти-fraud слой (verified badge).

### Далее

- UK через партнёрство со scheme operator (или подача на licence).
- EPS-сопровождение как отдельный модуль (не заменяет госсистему).
- Партнёрские интеграции (страховка, билеты, визовые центры).

---

## 11. Открытые вопросы и риски

| Риск | Вероятность | Митигация |
|---|---|---|
| Регуляторная атака на агрегаторов (как в EU против Uber-работников) | Средняя | Чётко позиционировать работодателей как employer of record; не становиться EoR сами на старте |
| Кассовый разрыв из-за длинного pipeline (деньги после статуса 9) | Высокая | Подписка B2B + предоплата 30% success fee на статусе 5 |
| Мошенничество со стороны «работодателя» | Высокая | Верификация + публичные рейтинги + эскроу |
| Переиспользование данных для conversion-давления на соискателя | Высокая | Запрет внутренний; ethics review при каждой новой feature; no dark patterns |
| Зависимость от одной страны-донора | Средняя | Диверсификация с самого начала (3+ страны) |
| Overdependence on Mux/Stripe | Средняя | Абстракция через порт (Hexagonal architecture); возможность свичить |

**Вопросы, которые требуют решения от основателя до старта**:

1. Какая страна-донор №1 на старте (это определит язык, маркетинг, партнёров)?
2. Турция отели или UK ягоды как первая вертикаль-покупатель?
3. Готовы ли привлекать compliance-юриста с опытом ILO/GLAA до запуска?
4. Кто станет первым licensed scheme operator partner для UK?
5. Бренд-позиционирование: «дешевле всех» vs «самая безопасная» — второе даёт больший моут и лучшую работодательскую аудиторию.

---

## Key Takeaways

1. **Стройте вертикальный операционный SaaS**, а не job board. Моут — это pipeline, compliance, доверие.
2. **Деньги — с работодателя и партнёров**, никогда с соискателя за доступ к работе. Это закон и маркетинг одновременно.
3. **Доверие = продукт**: верификация, прозрачные статусы, рейтинги, эскроу.
4. **Два клиента, один API**: Expo для соискателей, Next.js для работодателей, Django 5 + PG RLS + Mux/CF Stream на бэке.
5. **Регуляторика диктует географию продукта**: Турция — прямо, UK — через scheme operator, Корея — как сопровождение EPS.
6. **Микс монетизации Q1**: B2B-подписка (Starter €79 → Growth €299 → Scale €899) + success fee €100–€400/посадку + партнёрская комиссия со страховки/билетов.
7. **Pipeline — state machine с артефактами на каждом переходе** и billing-событиями на ключевых статусах.
8. **UX соискателя проектируется для низкой цифровой грамотности**: аудио, иконки с подписями, один вопрос — один экран, оффлайн, мульти-язык с первого экрана.

---

## Sources

### Рынок и конкуренты
1. [Business Research Insights — Online Recruitment Platform Market Size 2033](https://www.businessresearchinsights.com/market-reports/online-recruitment-platform-market-120394) — размер рынка, сегменты.
2. [seasonal.work](https://www.seasonal.work/) — бенчмарк международного сезонного агрегатора.
3. [Seasonal Connect](https://seasonalconnect.com/) — hospitality-focused конкурент.
4. [Anyworkanywhere](https://www.anyworkanywhere.com/) — классифайд с 2001.
5. [CoolWorks](https://www.coolworks.com/) — узкая ниша США.
6. [Skills Provision](https://www.skills-provision.com/seasonal-recruitment-services) — flexible pricing в агентстве.
7. [Job in Global (Turkey hotels)](https://www.jobinglobal.com/en/turkiyede-is) — 986 посадок в 2024.
8. [Lupa Hire — Top 21 International Recruitment Agencies 2026](https://www.lupahire.com/blog/best-international-recruitment-agencies).
9. [Career International](https://en.careerintlinc.com/) — китайская цепочка.
10. [Workaway wages](https://www.workaway.com/wages) — work-exchange модель.

### UK Seasonal Worker Visa
11. [Davidson Morris — Seasonal Worker Visa UK Guide 2026](https://www.davidsonmorris.com/seasonal-worker-visa-uk/).
12. [Richmond Chambers — Seasonal Worker Visa](https://immigrationbarrister.co.uk/personal-immigration/short-term-work-visas/seasonal-worker-visa/).
13. [Get Borderless — Seasonal Worker Visa 2025](https://www.getborderless.co.uk/blog/seasonal-worker-visa).
14. [IAS Services — UK Seasonal Worker Guide 2026](https://iasservices.org.uk/seasonal-worker-visa/).
15. [HOPS — SWS for Workers](https://www.hopslaboursolutions.com/sws-scheme-for-workers).

### South Korea EPS
16. [Global Skill Partnerships — EPS overview](https://gsp.cgdev.org/legalpathway/employment-permit-system-eps/).
17. [East Asia Forum — Korea migrant workers in legal cage (Oct 2025)](https://eastasiaforum.org/2025/10/31/south-koreas-migrant-workers-trapped-in-a-legal-cage/).
18. [careers.niveshcalculator.in — EPS step-by-step 2025](https://careers.niveshcalculator.in/employment-permit-system/).
19. [Foreign worker legislation in South Korea — Wikipedia](https://en.wikipedia.org/wiki/Foreign_worker_legislation_in_South_Korea).

### Turkey hospitality
20. [Manpower Turkey hospitality recruitment](https://manpowerturkey.com/hospitality-recruitment-agency-in-turkey/).
21. [Soundlines — Turkey hospitality manpower agencies](https://soundlinesgroup.com/turkey/hospitality-manpower-recruitment-agencies-in-turkey/).
22. [Top Talent in Turkey — Temp staffing agencies 2025](https://top-talent-in-turkey.com/top-temp-staffing-agencies-in-turkey-for-2025/).

### ILO / Employer Pays / Ethical recruitment
23. [ILO — Recruitment fees at a glance (2024 brochure)](https://www.ilo.org/sites/default/files/2024-10/Brochure_Recuitment_fees_web.pdf).
24. [ILO — General principles and guidelines for fair recruitment](https://www.ilo.org/sites/default/files/wcmsp5/groups/public/@ed_protect/@protrav/@migrant/documents/publication/wcms_703485.pdf).
25. [Consumer Goods Forum — Repayment of worker-paid recruitment fees](https://www.theconsumergoodsforum.com/wp-content/uploads/2022/10/2022-HRC-Guidelines-on-Repayment-of-Recruitment-Fees.pdf).
26. [Ardea International — The Hidden Cost of Illegal Recruitment Fees](https://www.ardeainternational.com/thinking/the-hidden-cost-of-employment-tackling-illegal-recruitment-fees/).
27. [Ipieca — Responsible Recruitment](https://www.ipieca.org/resources/worker-welfare-resources/responsible-recruitment).

### Fraud / Trust
28. [ICMPD — The digital trap: fake job ads (2025)](https://www.icmpd.org/blog/2025/the-digital-trap-how-fake-job-ads-exploit-aspiring-migrants).
29. [GetGIS — 10 Common Work Abroad Scams 2026](https://getgis.org/blog/10-most-common-work-abroad-scams-and-ways-to-avoid-them).
30. [UNHCR — How to avoid scams and fraudulent offers](https://www.unhcr.org/us/get-involved/work-us/careers-unhcr/how-avoid-scams-and-fraudulent-job-offers).
31. [MacArthur Foundation — Preventing Fraud in Migrant Recruitment](https://www.macfound.org/press/from-field/preventing-fraud-migrant-worker-recruitment/).

### Tech stack
32. [Techarion — Next.js + Django SaaS architecture 2025](https://techarion.com/blog/building-saas-application-nextjs-django-rest-framework).
33. [Medium — Building Multi-Tenant SaaS in Django 2026](https://medium.com/@yogeshkrishnanseeniraj/building-a-multi-tenant-saas-in-django-complete-2026-architecture-e956e9f5086a).
34. [Medium — PostgreSQL RLS in Django](https://medium.com/@yogeshkrishnanseeniraj/complete-guide-using-postgresql-rls-row-level-security-in-django-for-enterprise-saas-28da70684372).
35. [Simform — Mastering Multi-Tenant Django](https://medium.com/simform-engineering/mastering-multi-tenant-architectures-in-django-three-powerful-approaches-178ff527c03f).
36. [django-tenants docs](https://django-tenants.readthedocs.io/).
37. [Ideadope — Best Tech Stack Multi-Tenant SaaS 2025](https://ideadope.com/roadmaps/best-tech-stack-for-multi-tenant-saas-mvp-to-scale).

### Video infra
38. [Mux — Cheaper than S3](https://www.mux.com/blog/mux-is-cheaper-than-s3).
39. [Build MVP Fast — Video Streaming Pricing 2026](https://www.buildmvpfast.com/api-costs/video).
40. [Mux vs Cloudflare Stream](https://www.mux.com/compare/cloudflare-stream).

### Video interviewing benchmarks
41. [Hirevire — HireVue Review 2025 Features & Pricing](https://hirevire.com/blog/hirevue-review-features-pricing-better-alternatives).
42. [Willo — High-Volume Recruiting Tools](https://www.willo.video/blog/high-volume-recruiting-tools).
43. [Hirevire — Willo reviews 2026](https://hirevire.com/articles/willo-reviews-alternatives).

### ATS benchmarks
44. [Kula — ATS Pricing Guide 2025](https://www.kula.ai/blog/ats-pricing).
45. [G2 — ATS pricing insights](https://learn.g2.com/applicant-tracking-systems-pricing).
46. [Hirefly — ATS Pricing Comparison 2025](https://hireflyapp.com/blog/ats-pricing-comparison).

### UX for low-literacy / migrant workers
47. [FiftyEight — UI for low-literacy users in Uttar Pradesh](https://fiftyeight.io/insight/developing-a-user-interface-for-low-literacy-users-in-uttar-pradesh-india/).
48. [FiftyEight — Just Good Work migrant app](https://fiftyeight.io/solution/just-good-work/).
49. [Chaudry — Mobile Interface Design for Low-Literacy Populations](https://course.ccs.neu.edu/is4300f13/ssl/chaudry.pdf).
50. [UXPA Magazine — Interface for Chinese Migrant Workers](https://uxpamagazine.org/interface_chinese_migrant_workers/?lang=en).

### KYC / Document verification
51. [Veriff — Acceptable KYC documents 2025](https://www.veriff.com/kyc/list-of-acceptable-kyc-documents).
52. [Signzy — Best Passport Verification Solutions 2025](https://www.signzy.com/blogs/best-passport-vertification-solutions).
53. [LSEG — KYC Verification Glossary](https://www.lseg.com/en/risk-intelligence/glossary/kyc/kyc-verification).

### GDPR / Cross-border
54. [ICO — International transfers guide](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/international-transfers/international-transfers-a-guide/).
55. [Employer Records — GDPR in Global Hiring 2026](https://employerrecords.com/gdpr-and-data-privacy-in-global-hiring/).
56. [ATZ CRM — GDPR Recruitment 2025](https://atzcrm.com/blog/gdpr-recruitment-candidate-data/).
57. [SkillSeek — GDPR basics for recruiters](https://skillseek.eu/answers/gdpr-basics-for-recruiters).

---

## Methodology

Выполнено 10 поисковых запросов в WebSearch, охвачено 57 источников (из них 57 процитированы выше). Основные направления: рынок, конкуренты, правовые режимы 4 ключевых коридоров (UK/KR/TR/EU), ILO-рамки, mobile UX для низкограмотных пользователей, бенчмарки ATS и video-interview SaaS, мульти-тенантная архитектура Django, видео-инфраструктура, KYC, GDPR, антифрод.

Неполные области (требуют добавочного ресёрча перед принятием решений):
- Прямые ценники Skills Provision, Career International, Deel Sourcing (не опубликованы публично; нужны NDA-диалоги).
- Точная экономика партнёрских комиссий у визовых центров и страховщиков в странах-донорах — зависит от прямых переговоров.
- A/B-данные по конверсии аудио-инструкций на blue-collar mobile — почти нет публичных бенчмарков, потребуется собственный эксперимент.
- Прецеденты GLAA-лицензирования технологических платформ (не scheme operators) — нужен специализированный UK immigration lawyer.
