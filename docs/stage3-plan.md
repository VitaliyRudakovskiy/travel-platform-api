# План: Modsen Travel Platform — Этап III (микросервисы)

Источник: `Modsen Travel Platform (Part 3).pdf`. Основа — код этапа II в этом репозитории.
Порядок шагов повторяет график из ТЗ (декомпозиция → booking и оркестрация → события → gateway → завершение),
но gateway вынесен в конец сознательно: до него каждый сервис проверяется напрямую, а заголовки, которые потом
будет ставить gateway, ты передаёшь вручную. Так лучше понятна модель доверия.

---

## 0. Решения, которые нужно подтвердить до начала

ТЗ местами противоречиво или неполно. Ниже по каждому пункту есть рекомендация. Если согласен, план идёт по ним.

| # | Вопрос | Рекомендация | Почему |
|---|---|---|---|
| D1 | Как организовать 5 приложений в одном репозитории | **Nest monorepo mode**: `apps/*` + `libs/*`, один `package.json` | Штатный механизм Nest (`nest generate app/library`). Один lint, один набор тестов, одна lock-файл. pnpm workspaces чище изолируют зависимости, но заметно добавляют инфраструктуры |
| D2 | ТЗ требует одновременно «HTTP GET/PATCH `/internal/v1/offers/...`» (п. 3.3–3.4) и «gRPC между booking и catalog» (п. 4.2) | **Оба транспорта.** Availability и capacity идут по HTTP, как написано в п. 3.4. Чтение данных оффера (цена, владелец, направление) идёт по gRPC | Буква ТЗ выполняется полностью, и у gRPC появляется настоящая работа, а не дублирование HTTP |
| D3 | Модель «ёмкости» оффера: тело `{ reservedDelta: 1 }` не содержит дат | **Счётчик** `offers.reserved_capacity`; `remaining = maxConcurrentBookings - reservedCapacity` | Ровно то, что описано в ТЗ (KISS). Минус: пересечение дат больше не учитывается. Записать в README как отклонение |
| D4 | Кто отправляет письмо подтверждения email: в auth-service нет ни notify_db, ни Outbox (Outbox по ТЗ есть только в booking) | **auth-service вызывает `POST /internal/v1/notifications/email-verification`** в notification-service | В ТЗ события RabbitMQ только `booking.*`. Внутренний HTTP-вызов — самый простой путь, и он не противоречит правилу «новые эндпоинты только в `/internal/v1/`» |
| D5 | Jest или Vitest | **Оставить Vitest** (уже записан в отклонения этапов I–II) | Переезд на Jest ничего не даёт для обучения |
| D6 | В списке публичных маршрутов ТЗ нет `POST /api/v2/sessions/refresh`, `DELETE /api/v2/sessions`, `POST /api/v2/email-verifications`, `GET /api/v2/destinations*`, `GET /api/v1/offers/:id` | **Сделать их публичными** | Иначе refresh-токен невозможно использовать: при истёкшем access-токене refresh вернёт 401. Контракты этапа II это нарушило бы. Записать в README |
| D7 | В таблице маршрутизации ТЗ нет `/api/v2/destinations/*` | Направлять в **catalog-service** | Эндпоинт есть с этапа II, контракт менять нельзя |

---

## 1. Целевая архитектура

```
                         ┌──────────────┐   Redis (кэш JWT-claims)
  Клиент / Bruno ──────► │ api-gateway  │◄──────────┐
       :3000             │  JWT, proxy, │           │
                         │  rate limit  │───────────┘
                         └──────┬───────┘
          X-User-Id, X-User-Role, X-Email-Verified (только внутренняя сеть Docker)
     ┌──────────────┬───────────┴───────┬──────────────────────┐
     ▼              ▼                   ▼                      ▼
 auth-service   catalog-service     booking-service      notification-service
  :3001          :3002 HTTP          :3003                 :3004
  Prisma         :50052 gRPC         Prisma                Prisma
  auth_db        TypeORM             booking_db            notify_db
                 catalog_db              │                     ▲
                    ▲   ▲                │ Outbox-воркер       │ @RabbitSubscribe
                    │   └─ gRPC ─────────┤                     │
                    └──── HTTP /internal ┘   RabbitMQ: exchange travel.events
                                             └─► queue travel.notifications ─┘
                                                                     │
                                                                Mailhog (SMTP)
```

| Сервис | Порт HTTP | БД (порт на хосте) | Что переезжает из монолита |
|---|---|---|---|
| api-gateway | 3000 | — | `main.ts`/Swagger/health — новое |
| auth-service | 3001 | `auth_db` (5433) | v1 `users`, `sessions`; v2 `users`, `sessions`, `email-verifications`, `client-profiles.service.ts` |
| catalog-service | 3002, gRPC 50052 | `catalog_db` (5434) | v1/v2 `destinations`, `offers` (Prisma → TypeORM) |
| booking-service | 3003 | `booking_db` (5435) | v1/v2 `bookings`, `favorites`, v2 `analytics`, `states/` |
| notification-service | 3004 | `notify_db` (5436) | v2 `notifications` (worker, mail.service) |

Инфраструктура: RabbitMQ (5672, UI 15672), Redis (6379), Mailhog (1025, UI 8025).

### Структура репозитория (после шага 0)

```
apps/
  api-gateway/src/...
  auth-service/        src/  prisma/schema/*.prisma  prisma.config.ts  Dockerfile  .env
  catalog-service/     src/  src/database/{data-source.ts,migrations/}  Dockerfile  .env
  booking-service/     src/  prisma/...  Dockerfile  .env
  notification-service/src/  prisma/...  Dockerfile  .env
  travel-platform-api/ ← старый монолит, живёт до шага 9 как эталон для сравнения
libs/
  common/      ← инфраструктура: exception filter, ZodValidationPipe, guards, decorators, configureApp, health-индикаторы
  contracts/   ← межсервисные контракты: zod-схемы событий, internal DTO, catalog.proto
e2e/           ← E2E-тесты через gateway
docker-compose.yml
docker-compose.debug.yml  ← публикует порты сервисов на хост (для Bruno и Prisma Studio)
```

### Схема аутентификации (одинакова во всех шагах)

1. **v2:** gateway проверяет подпись и срок JWT (`JWT_SECRET` общий с auth-service). Затем ищет claims в Redis
   по ключу `jwt:claims:<sha256(token)>`. Если ключа нет, вызывает `GET /internal/v1/users/:id` в auth-service
   (свежие `role`, `isEmailVerified`, как в `JwtStrategy` этапа II) и кладёт claims в Redis с TTL = `exp - now`.
2. Gateway **удаляет** входящие `X-User-*` и `X-Email-Verified`: клиент не должен иметь возможности подделать роль.
   После этого он выставляет эти заголовки сам.
3. **v1:** клиент сам передаёт `X-User-Id`, как на этапе I. Gateway находит пользователя (тот же endpoint и тот же
   кэш) и, если пользователь найден, добавляет `X-User-Role` и `X-Email-Verified`.
4. Сервисы используют `GatewayAuthGuard` из `libs/common`, который собирает `request.user` из заголовков. Если нет
   `X-User-Id`, ответ 401. Если `X-User-Id` есть, а `X-User-Role` нет (пользователь не найден), ответ 404
   «User not found», ровно как в v1 `AuthGuard`. `RolesGuard`, `EmailVerifiedGuard` и `@CurrentUser()` переносятся
   без изменений: они читают `request.user`.

Компромисс: после подтверждения email claims в кэше остаются старыми до истечения access-токена (≤ 15 мин).
Решение для клиента: сделать `POST /api/v2/sessions/refresh`. Новый токен даёт новый ключ кэша и свежие claims.
Записать в README.

---

## Шаг 0. Подготовка репозитория

### Что добавить
1. **GitFlow** (требование ТЗ, на этапах I–II не соблюдалось):
   ```bash
   git tag stage-2                  # точка возврата к монолиту
   git checkout -b develop && git push -u origin develop
   git checkout -b feature/stage3-monorepo
   ```
   Каждый следующий шаг делается в своей ветке `feature/stage3-<шаг>` и вливается в `develop`, в конце `develop` → `main`.
2. ~~Проверка сообщений коммитов (commitlint)~~ — **пропущено по решению автора**.
3. **Перевод в Nest monorepo** (✅ сделано):
   ```bash
   pnpm nest generate app auth-service      # первый вызов переносит src/ → apps/travel-platform-api/
   pnpm nest generate app catalog-service
   pnpm nest generate app booking-service
   pnpm nest generate app notification-service
   pnpm nest generate app api-gateway
   ```
   Шаблоны (hello-world контроллер, Jest-спеки, `test/jest-e2e.json`) удалены. В каждом сервисе остались `main.ts`
   (фиксированный порт) и пустой модуль. `libs/contracts` создаётся на шаге 2, когда появится `catalog.proto`.
4. **`libs/common`** (✅ сделано). `nest generate library` без TTY не может спросить префикс, поэтому библиотека
   создана вручную: `libs/common/src/index.ts`, `tsconfig.lib.json`, проект в `nest-cli.json`, алиас `@app/common`.
   Из монолита перенесено только то, что не зависит от Prisma и DTO монолита: `GlobalExceptionFilter`,
   `ZodValidationPipe`, `paginatedSchema`, `configureApp`. Монолит импортирует их из `@app/common`.
   `RolesGuard`, `@Roles()`, `EmailVerifiedGuard`, `@CurrentUser()` и новый `GatewayAuthGuard` создаются в
   `libs/common` **на шаге 1**: они завязаны на `AuthenticatedUser`, который использует `UserResponseDto` и `UserRole`
   из `#prisma` монолита. В библиотеке нужен TS-тип `UserRole = "Admin" | "Agent" | "User"`, потому что у каждого
   сервиса свой Prisma-клиент.

### Как настроить
- `nest-cli.json`: у всех проектов `"compilerOptions": { "webpack": false, "tsConfigPath": "apps/<name>/tsconfig.app.json" }`.
  Webpack в monorepo mode включён по умолчанию и плохо работает со сгенерированным клиентом Prisma и `@grpc/grpc-js`.
- **`rootDir: "../.."` во всех `tsconfig.app.json` и `entryFile: "apps/<app>/src/main"` в `nest-cli.json`.** Без webpack
  `tsc` кладёт файлы в `dist` с полной структурой папок, как только приложение импортирует что-то из `libs/`.
  Явный `rootDir` делает структуру `dist/apps/<app>/apps/<app>/src/main.js` одинаковой у всех приложений,
  независимо от того, используют ли они библиотеки. Корневой `tsconfig.json` тоже получил `rootDir: "./"`.
- Алиасы `@app/common` (и позже `@app/contracts`) продублировать в `vitest.config.mjs`.
- **Prisma-клиенты сервисов подключать ТОЛЬКО через `package.json` → `imports`** (`#auth-prisma`, `#booking-prisma`,
  `#notify-prisma`, как `#prisma`), **без записи в `tsconfig.json` → `paths`**. Nest CLI переписывает алиасы из
  `paths` в относительные пути, считая их от исходного файла. Для папок вне `dist` (а `prisma/generated` именно
  такая) путь получается неверным, и приложение падает с `Cannot find module`. Именно так сломался `#prisma`
  после переноса монолита. Исправлено на шаге 0.4: в JS остаётся `require("#prisma")`, и Node разрешает его
  через `imports`. Для Vitest алиас всё равно нужен в `vitest.config.mjs`.
- Скрипты в `package.json`:
  ```json
  "start:auth": "nest start auth-service --watch",
  "start:catalog": "nest start catalog-service --watch",
  "start:booking": "nest start booking-service --watch",
  "start:notification": "nest start notification-service --watch",
  "start:gateway": "nest start api-gateway --watch",
  "studio:auth": "prisma studio --config apps/auth-service/prisma.config.ts --port 5561",
  "studio:booking": "prisma studio --config apps/booking-service/prisma.config.ts --port 5563",
  "studio:notify": "prisma studio --config apps/notification-service/prisma.config.ts --port 5564"
  ```
- **docker-compose (только инфраструктура).** Заменить единственный `postgres` на четыре: `postgres-auth` (5433:5432,
  `POSTGRES_DB=auth_db`), `postgres-catalog` (5434, `catalog_db`), `postgres-booking` (5435, `booking_db`),
  `postgres-notify` (5436, `notify_db`). У каждого свой volume и healthcheck `pg_isready`. Добавить:
  ```yaml
  rabbitmq:
    image: rabbitmq:4-management
    ports: ["5672:5672", "15672:15672"]
    healthcheck: { test: ["CMD", "rabbitmq-diagnostics", "-q", "ping"], interval: 10s, retries: 10 }
  redis:
    image: redis:7-alpine
    ports: ["6379:6379"]
    healthcheck: { test: ["CMD", "redis-cli", "ping"], interval: 5s, retries: 10 }
  ```
  Mailhog остаётся. Заодно уходит баг с `travel-platform` / `travel_platform`: имена БД теперь задаются явно.

### Проверка
- `pnpm nest start travel-platform-api` — монолит запускается из нового места, `pnpm test` зелёный.
- `docker compose up -d` → `docker compose ps`: 4 postgres, rabbitmq, redis, mailhog в статусе `healthy`.
- http://localhost:15672 (guest/guest) — открывается RabbitMQ UI.
- **Bruno:** прогнать коллекцию против монолита. Сохрани результат как эталон для сравнения после переезда.

---

## Шаг 1. auth-service (Prisma, `auth_db`)

> **✅ Сделано** (ветка `feature/stage3-auth-service`, работа от `main` вместо GitFlow — решение автора).
> Отличия от первоначального плана:
> - Passport — вариант (a): `LocalAuthGuard` сначала валидирует тело `loginSchema` (400), затем passport-local (401).
> - `SessionsService.validateCredentials()` стал публичным (его вызывает `LocalStrategy`); `login()` / `loginWithTokens()`
>   принимают уже проверенного пользователя.
> - `libs/common` получил `UserRole` (const-объект), `AuthenticatedUser`, `GatewayAuthGuard`, `RolesGuard`, `@Roles`,
>   `EmailVerifiedGuard`, `@CurrentUser`, `GATEWAY_HEADERS`.
> - Сгенерированный клиент сервиса **не коммитится** (`apps/*/prisma/generated` в `.gitignore`); в отличие от монолита.
> - `.env` / `.env.example` сервиса создаёт разработчик (файлы `.env*` закрыты для агента правилами доступа).
> - Пути в `prisma.config.ts` Prisma считает от самого файла конфига; seed-команда выполняется из корня репозитория.

### Что добавить
1. **Схема** `apps/auth-service/prisma/schema/`: `user.prisma`, `client-profile.prisma`, `user-session.prisma`,
   `email-verification.prisma`, `base.prisma` (generator → `apps/auth-service/prisma/generated`).
   Из `User` **удалить связи** на `Offer`, `Booking`, `Favorite`, `Notification`, `IdempotencyKey`: этих таблиц в
   `auth_db` больше нет (ТЗ 4.5: «сервисы не обращаются к чужим БД»).
2. **Модули** (переносятся из монолита почти без изменений): v1 `users`, `sessions`; v2 `users` (+ `client-profiles.service.ts`),
   `sessions`, `email-verifications`. `PrismaService` теперь импортирует клиент из `#auth-prisma`.
3. **Защита маршрутов:** `JwtAuthGuard` / `AuthGuard` → `GatewayAuthGuard`. `JwtModule` остаётся: auth-service по-прежнему
   **выпускает** токены, но больше не проверяет их на каждом запросе.
4. **PassportJS** (ТЗ 4.2: «PassportJS (auth-service)»). `passport-jwt` переезжает на gateway, поэтому в auth-service
   логичное применение Passport — `LocalStrategy` для входа:
   `pnpm add passport-local && pnpm add -D @types/passport-local`, `LocalStrategy.validate(username, password)` вызывает
   существующую проверку пароля, а `POST /api/v2/sessions` получает `@UseGuards(LocalAuthGuard)`.
   Контракт не меняется: в теле те же поля. Если имя поля логина не `username`, задать `usernameField`.
5. **Внутренний эндпоинт** `GET /internal/v1/users/:id` → `{ id, email, role, isEmailVerified }`, иначе 404.
   Его вызывают gateway (claims) и notification-service (адрес для письма).
   ```ts
   @Controller({ path: "internal/v1/users", version: VERSION_NEUTRAL })
   ```
   `VERSION_NEUTRAL` обязателен: иначе URI-версионирование превратит путь в `/api/v1/internal/v1/...`
   (тот же приём уже используется в `HealthController`).
6. **Отправка письма подтверждения (D4).** В `email-verifications.service.ts` создание `notification` в транзакции
   заменить на вызов после коммита:
   `POST http://notification-service:3004/internal/v1/notifications/email-verification` с телом `{ userId, email, token }`.
   Клиент — `@nestjs/axios` (`HttpModule.register({ timeout: 5000 })`, 5 с по ТЗ 4.3). Если вызов не удался, писать
   `Logger.warn` и **не откатывать регистрацию**: пользователь может запросить повторную отправку.
7. **Seed** `apps/auth-service/prisma/seed.ts`: пользователи `admin`, `agent`, `user`, все с `isEmailVerified = true`
   и ClientProfile. Подключить через `migrations.seed` в `prisma.config.ts`. Админа сейчас создают вручную, а для E2E
   и Bruno нужны предсказуемые учётки. `id` зафиксировать константами: их будет использовать seed каталога (`ownerId`).

### Как настроить
- `apps/auth-service/.env`: `DATABASE_URL=postgresql://postgres:postgres@localhost:5433/auth_db`, `JWT_SECRET`,
  `JWT_ACCESS_EXPIRES_IN`, `JWT_REFRESH_EXPIRES_IN`, `EMAIL_VERIFICATION_EXPIRES_IN`, `NOTIFICATION_SERVICE_URL=http://localhost:3004`, `PORT=3001`.
  `ConfigModule.forRoot({ envFilePath: "apps/auth-service/.env" })`.
- `npx prisma migrate dev --config apps/auth-service/prisma.config.ts --name init_auth`. Это новая история миграций
  с нуля: старые миграции монолита остаются в `apps/travel-platform-api`.
- `npx prisma db seed --config apps/auth-service/prisma.config.ts`.

### Теория
**Database per service.** У каждого сервиса своя БД, и внешние ключи между сервисами исчезают: `Booking.userId` —
просто строка. Целостность больше не гарантирует СУБД. Её обеспечивают проверки через API и события. Это главная
плата за независимость сервисов.

### Проверка
- **Prisma Studio** (`pnpm studio:auth` → http://localhost:5561): таблицы `users`, `client_profiles`, `user_sessions`,
  `email_verifications`, других нет. После `POST /api/v2/users` появляются строка в `users` (`isEmailVerified=false`)
  и пустой `client_profiles`. После логина — строка в `user_sessions`, после logout она исчезает.
- **Bruno**, напрямую на `http://localhost:3001` (gateway ещё нет):
  - `POST /api/v2/users`, `POST /api/v2/sessions`, `/refresh`, `DELETE /sessions` — ответы такие же, как у монолита.
  - `GET /api/v2/users/:id/profile` с заголовками `X-User-Id: <id>`, `X-User-Role: User`, `X-Email-Verified: true`
    (так их будет ставить gateway) → 200. Без `X-User-Id` → 401. С чужим id и ролью `User` → 403.
  - `GET /internal/v1/users/:id` → `{ id, email, role, isEmailVerified }`; несуществующий id → 404.
  - `POST /api/v1/users`, `GET /api/v1/users/:id` с `X-User-Id` — контракт v1.
  - Регистрация при выключенном notification-service: 201, в логах auth-service warning.

---

## Шаг 2. catalog-service (TypeORM, `catalog_db`) + internal + gRPC-сервер

> **✅ Сделано** (ветка `feature/stage3-catalog-service`). Отличия от первоначального плана:
> - Версии: `typeorm@0.3` + `@nestjs/typeorm@11`, `@nestjs/microservices` зафиксирован на `11.1.29` (11.2/12.x несовместимы с core 11.1).
> - CLI миграций через `tsx` (без `ts-node`); таблица истории `typeorm_migrations`; `uuidExtension: "pgcrypto"`.
> - Контракты вынесены в `libs/contracts` уже сейчас: `catalog.proto`, типы gRPC, Zod-схемы availability/capacity.
> - availability: 200 + `reason` (`OFFER_NOT_ACTIVE`, `INVALID_DATES`, `DATES_OUT_OF_RANGE`, `GUESTS_EXCEEDED`, `NO_CAPACITY`)
>   для маппинга в 404/400/409 на шаге 3; неизвестный оффер → 404.
> - Ответ оффера больше не содержит `user` (пользователи в auth_db); `destination` сохранён.
> - Soft-deleted офферы больше не попадают в `GET /offers?status=archived` (в монолите попадали).
> - Найдено вживую: `returning()` TypeORM принимает имена свойств, а не колонок (иначе пустой RETURNING → 500).

### Что добавить
1. **Зависимости:** `pnpm add @nestjs/typeorm typeorm @nestjs/microservices @grpc/grpc-js @grpc/proto-loader`
   (`pg` уже стоит). Для CLI миграций: `pnpm add -D ts-node`.
2. **Сущности** `apps/catalog-service/src/modules/*/entities/`:
   ```ts
   @Entity("offers")
   export class OfferEntity {
     @PrimaryGeneratedColumn("uuid") id: string;
     @Column({ type: "enum", enum: OfferType }) type: OfferType;
     @Column({ name: "destination_id", type: "uuid" }) destinationId: string;
     @ManyToOne(() => DestinationEntity) @JoinColumn({ name: "destination_id" }) destination: DestinationEntity;
     @Column({ name: "owner_id", type: "uuid" }) ownerId: string;          // без FK: users живут в auth_db
     @Column({ type: "numeric", precision: 7, scale: 2, transformer: decimalTransformer }) price: number;
     @Column({ name: "max_concurrent_bookings", type: "int" }) maxConcurrentBookings: number;
     @Column({ name: "reserved_capacity", type: "int", default: 0 }) reservedCapacity: number; // НОВОЕ (D3)
     // ... остальные поля 1:1 с offer.prisma, тип-специфичные nullable
     @CreateDateColumn({ name: "created_at" }) createdAt: Date;
     @UpdateDateColumn({ name: "updated_at" }) updatedAt: Date;
     @DeleteDateColumn({ name: "deleted_at" }) deletedAt: Date | null;   // soft delete «из коробки»
   }
   ```
   Типичная ловушка: драйвер `pg` возвращает `numeric` **строкой**, поэтому нужен `decimalTransformer`
   (`from: v => v === null ? null : Number(v)`, `to: v => v`). Иначе `price` в ответе станет `"120.00"`,
   и Zod-схема ответа упадёт.
   Плюс `DestinationEntity` (`destinations`) и CHECK `reserved_capacity BETWEEN 0 AND max_concurrent_bookings`
   (`@Check(...)`) как защита на уровне БД.
3. **Сервисы:** переписать `DestinationsService` и `OffersService` с Prisma на `Repository<T>` (`@InjectRepository`).
   Контроллеры v1/v2 и Zod-схемы переносятся **без изменений**: меняется только доступ к данным внутри сервиса.
   - Пагинация: `findAndCount({ where, skip, take, order })`.
   - Фильтры: `Between(minPrice, maxPrice)`, `MoreThanOrEqual`, `LessThanOrEqual`, `ILike(\`%${name}%\`)`.
   - Soft delete: `repository.softDelete(id)`. `find*` автоматически исключает записи с `deletedAt`.
   - `DELETE /api/v1/offers/force/:id`: `repository.delete(id)`.
4. **Внутренние HTTP-эндпоинты** `InternalOffersController` (`path: "internal/v1/offers"`, `VERSION_NEUTRAL`):
   - `GET /internal/v1/offers/:id/availability?startDate&endDate&guestsCount` → `{ available, remainingCapacity }`.
     Логика переносится из `BookingsService.create` монолита: оффер существует (иначе 404), `status = active`,
     даты внутри `availableFrom..availableTo`, `startDate < endDate`, `guestsCount <= maxGuests`,
     `remainingCapacity = maxConcurrentBookings - reservedCapacity > 0`. Если оффер недоступен, ответ всё равно
     **200** с `available: false`: это нормальный ответ на вопрос, а не ошибка. Допустимо добавить поле `reason`,
     чтобы booking-service вернул клиенту понятное сообщение 409.
   - `PATCH /internal/v1/offers/:id/capacity` с телом `{ reservedDelta: 1 | -1 }` (Zod) → `{ remainingCapacity }`.
     Обновление **атомарное, одним SQL**, без «прочитал → проверил → записал»:
     ```ts
     const result = await this.offers.createQueryBuilder()
       .update(OfferEntity)
       .set({ reservedCapacity: () => "reserved_capacity + :delta" })
       .where("id = :id AND deleted_at IS NULL")
       .andWhere("reserved_capacity + :delta BETWEEN 0 AND max_concurrent_bookings")
       .setParameters({ id, delta })
       .execute();
     if (result.affected === 0) throw new ConflictException("No capacity left"); // (или 404, если оффера нет)
     ```
5. **gRPC-сервер (D2).** `libs/contracts/proto/catalog.proto`:
   ```proto
   syntax = "proto3";
   package catalog;
   service CatalogService {
     rpc GetOffer (GetOfferRequest) returns (OfferInfo);
     rpc GetOffersByIds (GetOffersByIdsRequest) returns (OffersInfo);
     rpc ListOfferIdsByOwner (ListOfferIdsByOwnerRequest) returns (OfferIds);
   }
   message GetOfferRequest { string id = 1; }
   message GetOffersByIdsRequest { repeated string ids = 1; }
   message ListOfferIdsByOwnerRequest { string owner_id = 1; }
   message OfferInfo {
     string id = 1; string owner_id = 2; string title = 3; string type = 4;
     string price = 5;            // decimal строкой: в proto нет точного decimal
     string currency = 6; string destination_id = 7; string destination_name = 8;
     string status = 9; bool deleted = 10;
   }
   message OffersInfo { repeated OfferInfo offers = 1; }
   message OfferIds { repeated string ids = 1; }
   ```
   `CatalogGrpcController` с `@GrpcMethod("CatalogService", "GetOffer")`. Если оффер не найден, бросать
   `new RpcException({ code: status.NOT_FOUND, message })` (`status` из `@grpc/grpc-js`).
6. **Seed** каталога: 2–3 направления и офферы всех трёх типов с `ownerId` = id агента из seed auth-service.
   Один оффер сделать с `maxConcurrentBookings = 1`: он понадобится для проверки 409.

### Как настроить
- `TypeOrmModule.forRootAsync({ useFactory: (c) => ({ type: "postgres", url: c.getOrThrow("DATABASE_URL"),
  autoLoadEntities: true, synchronize: false, migrations: [__dirname + "/database/migrations/*.js"], migrationsRun: true }) })`.
  `synchronize: false` обязателен: схему меняют только миграции, как и с Prisma. `migrationsRun: true` применяет
  миграции при старте, это удобно для Docker.
- `src/database/data-source.ts` (`new DataSource({...})`) для CLI. Скрипты:
  ```json
  "typeorm:catalog": "typeorm-ts-node-commonjs -d apps/catalog-service/src/database/data-source.ts",
  "migration:catalog:generate": "pnpm typeorm:catalog migration:generate apps/catalog-service/src/database/migrations/Init",
  "migration:catalog:run": "pnpm typeorm:catalog migration:run"
  ```
- `main.ts` — hybrid-приложение (HTTP + gRPC в одном процессе):
  ```ts
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: { package: "catalog", protoPath: join(__dirname, "../../../libs/contracts/proto/catalog.proto"), url: "0.0.0.0:50052" },
  });
  await app.startAllMicroservices();
  await app.listen(3002);
  ```
  Путь к `.proto` после сборки должен существовать: добавить `assets` в `nest-cli.json` (`"assets": [{ "include": "../../../libs/contracts/proto/*.proto" }]`)
  или копировать `proto/` в Dockerfile.
- `.env`: `DATABASE_URL=postgresql://postgres:postgres@localhost:5434/catalog_db`, `PORT=3002`, `GRPC_URL=0.0.0.0:50052`.

### Теория
- **Зачем два ORM (для README).** Prisma даёт schema-first, сгенерированные типы и удобные миграции. Хорош там, где
  схема и запросы простые (auth, booking, notify). TypeORM — code-first: сущности-классы, декораторы, `QueryBuilder`,
  встроенный soft delete (`@DeleteDateColumn`). Он удобен для каталога с динамическими фильтрами, сортировкой и
  атомарным `UPDATE ... SET x = x + :d WHERE ...`. ТЗ требует оба, а в README нужно описать, где какой сильнее.
- **Атомарность capacity.** Два параллельных бронирования последнего слота при «read → check → write» оба увидят
  `remaining = 1`, и оба запишут. Условие в `WHERE` превращает проверку и запись в одну операцию: PostgreSQL блокирует
  строку, и второй `UPDATE` увидит уже обновлённое значение.

### Проверка
- **Prisma Studio** для `catalog_db` не подходит: схема описана в TypeORM, а не в Prisma. Смотреть через psql:
  ```bash
  docker exec -it travel-catalog-db psql -U postgres -d catalog_db \
    -c "select id, title, status, max_concurrent_bookings, reserved_capacity, deleted_at from offers;"
  docker exec -it travel-catalog-db psql -U postgres -d catalog_db -c "select * from migrations;"   # таблица истории TypeORM
  ```
  (Или подключить любой GUI — DBeaver, DataGrip, расширение VS Code — к `localhost:5434`.)
- **Bruno** напрямую на `http://localhost:3002`:
  - `GET /api/v1/offers?type=hotel&minPrice=...&sortBy=price`, `GET /api/v1/offers/:id`, `GET /api/v1/destinations?countryCode=BY`.
    Ответы совпадают с эталоном шага 0, `price` — **число**.
  - `POST /api/v2/offers` с `X-User-Id: <agentId>`, `X-User-Role: Agent` → 201. С `X-User-Role: User` → 403.
  - `DELETE /api/v2/offers/:id` → в psql у оффера заполнен `deleted_at`, `GET` по нему → 404.
  - `GET /internal/v1/offers/:id/availability?startDate=...&endDate=...&guestsCount=2` → `{ available: true, remainingCapacity: N }`;
    `guestsCount` больше `maxGuests` → `available: false`.
  - `PATCH /internal/v1/offers/:id/capacity` `{ "reservedDelta": 1 }` на оффере с `maxConcurrentBookings = 1` → 200,
    повтор → **409**, `{ "reservedDelta": -1 }` → 200, повтор `-1` → **409** (ниже нуля нельзя). Каждый раз сверять `reserved_capacity` в psql.
- **gRPC в Bruno:** в новых версиях Bruno есть gRPC-запросы: импортировать `catalog.proto`, адрес `localhost:50052`,
  метод `CatalogService/GetOffer` с `{ "id": "..." }`. Если твоя версия не умеет gRPC, проверь через
  `grpcurl -plaintext -import-path libs/contracts/proto -proto catalog.proto -d '{"id":"..."}' localhost:50052 catalog.CatalogService/GetOffer`.

---

## Шаг 3. booking-service: перенос + оркестрация с компенсацией

### Что добавить
1. **Схема** `apps/booking-service/prisma/schema/`:
   - `Booking`: как сейчас, но **без relation** на `User`/`Offer`. `userId`, `offerId` — обычные `String`, индексы оставить.
     Новое поле `capacityReleased Boolean @default(false)` (зачем — ниже).
   - `Favorite`: без relation, `@@unique([userId, offerId])`.
   - `IdempotencyKey`: без relation на `User`.
   - `OutboxEvent` (таблицу заводим сейчас, воркер — на шаге 4):
     ```prisma
     enum OutboxEventType { booking_created @map("booking.created")  booking_status_changed @map("booking.status_changed") }
     enum OutboxStatus    { pending  published  failed }
     model OutboxEvent {
       id          String          @id @default(uuid())   // это и есть eventId в payload
       eventType   OutboxEventType @map("event_type")
       payload     Json
       status      OutboxStatus    @default(pending)
       attempts    Int             @default(0)            // сверх ТЗ: чтобы перевести в failed после N попыток
       createdAt   DateTime        @default(now()) @map("created_at")
       publishedAt DateTime?       @map("published_at")
       @@index([status, createdAt])
       @@map("outbox_events")
     }
     ```
     Prisma не разрешает точку в имени значения enum, поэтому имя в коде `booking_created`, а в БД `booking.created` через `@map`.
2. **Модули:** v1/v2 `bookings`, `favorites`, v2 `analytics`, `states/booking-state.ts` (State pattern без изменений).
   Guards → `GatewayAuthGuard`, `EmailVerifiedGuard` теперь читает `X-Email-Verified` (п. 1 оркестрации по ТЗ).
3. **`CatalogClient`** (`src/modules/catalog-client/catalog-client.service.ts`) — единственное место, которое знает,
   как ходить в catalog-service:
   - HTTP (`@nestjs/axios`, `baseURL = CATALOG_HTTP_URL`, `timeout: 5000`): `checkAvailability()`, `reserve()`, `release()`.
   - gRPC (`ClientsModule.register([{ name: "CATALOG_GRPC", transport: Transport.GRPC, options: { package: "catalog", protoPath, url: CATALOG_GRPC_URL } }])`,
     `client.getService<CatalogGrpc>("CatalogService")`, `firstValueFrom(svc.getOffer({ id }).pipe(timeout(5000)))`):
     `getOffer()`, `getOffersByIds()`, `listOfferIdsByOwner()`.
   - Маппинг ошибок в Nest-исключения: сеть или таймаут → `ServiceUnavailableException` (503); HTTP 404 / gRPC
     `NOT_FOUND` → `NotFoundException`; HTTP 409 → `ConflictException`.
4. **Оркестрация `BookingsService.create`** (общая для v1 и v2, как сейчас):
   ```
   0. (v2) EmailVerifiedGuard: X-Email-Verified = true, иначе 403              ← шаг 1 ТЗ
   1. (v2) assertIdempotency — ДО резервирования, чтобы повтор не занимал слот
   2. offer = catalog.getOffer(offerId)          [gRPC] — цена для totalPrice
   3. catalog.checkAvailability(...)             [HTTP] — available=false → 409 ← шаг 2 ТЗ
   4. catalog.reserve(offerId)                   [HTTP] — 409 из каталога → 409 ← шаг 3 ТЗ
   5. try {
        prisma.$transaction: booking(pending) + idempotencyKey + outboxEvent(booking.created)   ← шаги 4–5 ТЗ
      } catch (e) {
        await catalog.release(offerId).catch(logCompensationFailure)                            ← шаг 6 ТЗ
        throw e   // P2002 по idempotency key → 409 с bookingId, как сейчас
      }
   6. Logger.log("Booking created ...")
   ```
   Payload `booking.created`: `{ eventId, bookingId, userId, offerId, offerOwnerId, offerTitle, status, startDate, endDate, totalPrice, occurredAt }`,
   где `eventId` = `id` строки `OutboxEvent` (сгенерировать `randomUUID()` заранее и передать в `create` и в payload).
   Схема payload — Zod в `libs/contracts/events/`, её же использует notification-service.
5. **Смена статуса `changeStatus`.** `tx.notification.createMany` заменить на `tx.outboxEvent.create(booking.status_changed)`
   с `{ eventId, bookingId, userId, offerId, offerOwnerId, fromStatus, toStatus, occurredAt }`. `offerOwnerId` берётся
   через `getOffer` по gRPC. **Освобождение ёмкости:** при переходе в `cancelled` или `completed`, если
   `capacityReleased = false`, после коммита вызвать `catalog.release()` и выставить `capacityReleased = true`.
   Флаг защищает от двойного `-1` на `completed → cancelled`. Счётчик в модели D3 не знает дат, поэтому завершённую
   бронь тоже нужно освобождать, иначе слот будет занят навсегда.
   Проверку `maxConcurrentBookings` при `confirm` (`assertCanConfirm`) удалить: слот уже занят при создании брони.
6. **Чтение данных через gRPC:**
   - Agent в `GET /api/v2/bookings`: `listOfferIdsByOwner(me)` → `where: { offerId: { in: ids } }`.
   - `GET /favorites` (v1/v2): монолит отдавал оффер через `include`. Теперь `getOffersByIds(ids)` и склейка в
     сервисе, ответ тот же. Удалённые офферы (`deleted = true`) пропускать.
   - `POST /favorites`: существование оффера проверять через `getOffer` (404).
   - Analytics `groupBy=destination`: `prisma.booking.groupBy({ by: ["offerId"], _count })` по `booking_db` →
     `getOffersByIds` → сложить по `destinationId` → отсортировать по убыванию → `limit`. `groupBy=status` не меняется.

### Как настроить
- `pnpm add @nestjs/axios axios` (gRPC-пакеты уже стоят с шага 2).
- `.env`: `DATABASE_URL=...localhost:5435/booking_db`, `CATALOG_HTTP_URL=http://localhost:3002`,
  `CATALOG_GRPC_URL=localhost:50052`, `PORT=3003`.
- `npx prisma migrate dev --config apps/booking-service/prisma.config.ts --name init_booking`.

### Теория
- **Оркестрация против Saga.** ТЗ просит не распределённую транзакцию, а «оркестратор с компенсацией»: booking-service
  сам ведёт процесс и при сбое отменяет то, что успел сделать в чужом сервисе (`+1` → `-1`). Атомарности нет: если
  упадёт и компенсация, слот «утечёт». Это нужно залогировать (`error` с `offerId`) и описать в README
  как известное ограничение.
- **Таймаут — неоднозначный исход.** Если `reserve` отвалился по таймауту, каталог мог успеть выполнить `+1`. ТЗ
  велит компенсировать и шаг 3, а условие `BETWEEN 0 AND max` гарантирует, что лишний `-1` не уведёт счётчик в минус.
- **Почему idempotency-проверка стоит до резервирования:** повторный запрос клиента не должен занимать второй слот,
  даже на короткое время.

### Проверка
- **Prisma Studio** (`pnpm studio:booking`): после `POST /api/v2/bookings` в `bookings` новая строка `pending`, в
  `outbox_events` — `booking.created` / `pending` (воркера ещё нет). В `payload.eventId` совпадает с `id` строки.
  `idempotency_keys` — как на этапе II.
- **psql catalog_db:** `reserved_capacity` увеличился на 1. После `PATCH status → cancelled` он уменьшился, а у брони
  в Studio `capacityReleased = true`.
- **Bruno** напрямую на `http://localhost:3003` (заголовки вручную):
  - `POST /api/v2/bookings` (`X-User-Id`, `X-User-Role: User`, `X-Email-Verified: true`, `Idempotency-Key: {{$randomUUID}}`) → 201.
  - То же с `X-Email-Verified: false` → 403, в catalog `reserved_capacity` **не изменился**.
  - Оффер с `maxConcurrentBookings = 1`: первая бронь 201, вторая **409**.
  - Повтор с тем же `Idempotency-Key` → 409 с `details.bookingId`, `reserved_capacity` не вырос.
  - **Компенсация вручную:** `docker stop travel-booking-db` → `POST /api/v2/bookings` → ошибка (500) → в psql
    catalog `reserved_capacity` вернулся к исходному значению, в логах booking-service видны `reserve` и `release`.
    `docker start travel-booking-db`.
  - **Каталог недоступен:** остановить catalog-service → `POST /api/v2/bookings` → **503** через ~5 с, не дольше.
  - `GET /api/v2/favorites`, `GET /api/v2/analytics/bookings?groupBy=destination&from=...&to=...` (`X-User-Role: Admin`) —
    формат ответа как в эталоне.

---

## Шаг 4. Transactional Outbox → RabbitMQ (booking-service)

### Что добавить
1. `pnpm add @golevelup/nestjs-rabbitmq` (внутри использует `amqplib`, как требует ТЗ 4.2).
2. Подключение:
   ```ts
   RabbitMQModule.forRootAsync({
     useFactory: (c: ConfigService) => ({
       uri: c.getOrThrow("RABBITMQ_URL"),
       exchanges: [{ name: "travel.events", type: "topic", options: { durable: true } }],
       connectionInitOptions: { wait: false },   // сервис стартует и без RabbitMQ; health покажет 503
     }),
     inject: [ConfigService],
   })
   ```
3. `OutboxWorker` (`@Interval(5000)`, флаг `isRunning` против наложения запусков, как в `NotificationsWorker`):
   ```
   events = outboxEvent.findMany({ where: { status: pending }, orderBy: { createdAt: asc }, take: 50 })
   for each event:
     try   amqp.publish("travel.events", event.eventType /* "booking.created" */, event.payload,
                        { messageId: event.id, persistent: true })
           update → status = published, publishedAt = now()
     catch update → attempts + 1; attempts >= 5 → status = failed; Logger.error
   ```
   `persistent: true` и `durable` exchange нужны, чтобы сообщение пережило рестарт брокера.

### Как настроить
- `.env`: `RABBITMQ_URL=amqp://guest:guest@localhost:5672`.
- `ScheduleModule.forRoot()` в `AppModule` booking-service.

### Теория
**Зачем Outbox.** Если публиковать в RabbitMQ прямо в `create()`, возможны два сбоя: бронь записана, а публикация
упала (событие потеряно), или публикация прошла, а транзакция откатилась (событие о брони, которой нет). Outbox
записывает событие в ту же транзакцию, что и бронь: либо есть оба, либо ничего. Публикацией отдельно занимается
воркер. Гарантия получается **at-least-once**: если воркер упадёт между `publish` и `update`, событие уйдёт повторно.
Поэтому потребитель обязан быть идемпотентным (шаг 5).
При нескольких экземплярах booking-service воркеры будут брать одни и те же строки. Тогда понадобится
`SELECT ... FOR UPDATE SKIP LOCKED` через `$queryRaw`. Для одного экземпляра это не нужно (YAGNI), но в README стоит упомянуть.

### Проверка
- **RabbitMQ UI** (http://localhost:15672): Exchanges → `travel.events` (type topic). Пока нет очередей, сообщения
  отбрасываются, и это нормально. Для проверки временно создай очередь `debug` и привяжи её к `travel.events`
  с routing key `booking.#`. После брони: Queues → `debug` → **Get messages** → видно JSON с `eventId`.
- **Prisma Studio (booking):** у `outbox_events` статус `published`, заполнен `publishedAt`.
- **Демонстрация Outbox:** `docker stop travel-rabbitmq` → создать бронь (201, бронирование работает!) → в Studio
  событие висит `pending`, `attempts` растёт → `docker start travel-rabbitmq` → через ≤ 5 с `published`.
- **Bruno:** `PATCH /api/v2/bookings/:id/status` `{ "status": "confirmed" }` → в `outbox_events` появилось `booking.status_changed`.

---

## Шаг 5. notification-service (Prisma, `notify_db`)

### Что добавить
1. **Схема:** `Notification` как на этапе II, плюс:
   - `eventId String? @map("event_id")`, `offerOwnerId String? @map("offer_owner_id")`, `bookingId String?` (без FK);
   - `@@unique([eventId, channel])` — основа идемпотентности;
   - в `NotificationType` добавить `booking_created`. ТЗ требует уведомлять о `booking.created`, но такого значения
     нет в enum этапа II. Записать в README.
2. **Потребитель:**
   ```ts
   @RabbitSubscribe({
     exchange: "travel.events",
     routingKey: ["booking.created", "booking.status_changed"],
     queue: "travel.notifications",
     queueOptions: { durable: true },
   })
   async handle(raw: unknown) {
     const event = bookingEventSchema.parse(raw);              // zod из libs/contracts
     const { email } = await this.authClient.getUser(event.userId);   // GET /internal/v1/users/:id
     await this.prisma.notification.createMany({
       data: [
         { eventId: event.eventId, channel: "email",  status: "pending", payload: { ...event, email }, ... },
         { eventId: event.eventId, channel: "in_app", status: "sent", sentAt: new Date(), payload: event, ... },
       ],
       skipDuplicates: true,                                   // повторная доставка → 0 новых строк
     });
   }
   ```
   `email` кладётся **только** в email-уведомление: in-app уведомления видит и Agent (владелец оффера), и ему не нужен
   адрес клиента. Поведение при ошибке задать явно: при исключении сообщение возвращается (`nack` + requeue) или уходит
   в DLQ. Проще всего начать с requeue и добавить dead-letter exchange `travel.events.dlx`, чтобы «ядовитое»
   сообщение не крутилось бесконечно.
3. **Отправка в Mailhog:** `NotificationsWorker` + `MailService` переносятся с этапа II без изменений («notification-воркер» в ТЗ 4.2).
4. **Внутренний эндпоинт** `POST /internal/v1/notifications/email-verification` `{ userId, email, token }` →
   `Notification(type=email_verification, channel=email, status=pending)`. Вызывается из auth-service (D4).
5. **`GET /api/v2/notifications`** — тот же контракт. Фильтрация по ролям из заголовков: User → `userId = me`,
   Agent → `offerOwnerId = me`, Admin → все. Только `in_app`.

### Как настроить
- `.env`: `DATABASE_URL=...localhost:5436/notify_db`, `RABBITMQ_URL`, `AUTH_SERVICE_URL=http://localhost:3001`,
  `SMTP_HOST`, `SMTP_PORT`, `MAIL_FROM`, `PORT=3004`.
- `npx prisma migrate dev --config apps/notification-service/prisma.config.ts --name init_notify`.

### Теория
**Идемпотентный потребитель.** RabbitMQ гарантирует доставку at-least-once, а Outbox может опубликовать событие
повторно. Проверять «а нет ли уже такого уведомления» через `findFirst` перед вставкой нельзя: две копии события,
обработанные параллельно, обе ничего не найдут. Уникальный индекс `(eventId, channel)` переносит проверку в БД,
а `skipDuplicates` превращает дубликат в «0 вставленных строк» без ошибки.

### Проверка
- **RabbitMQ UI:** Queues → `travel.notifications`, binding на `travel.events` с ключами `booking.created` и
  `booking.status_changed`, Consumers = 1. Временную очередь `debug` из шага 4 удалить.
- **Prisma Studio** (`pnpm studio:notify`): после брони — две строки с одинаковым `eventId`: `email`/`pending` → через
  ≤ 10 с `sent` с `sentAt`, и `in_app`/`sent`.
- **Mailhog** (http://localhost:8025): письмо о бронировании. После регистрации — письмо подтверждения с токеном.
- **Проверка идемпотентности без кода:** в RabbitMQ UI → Exchanges → `travel.events` → **Publish message**, routing key
  `booking.created`, payload скопировать из Studio (тот же `eventId`). Опубликовать дважды → в `notifications`
  **не появилось** новых строк.
- **Ошибка доставки:** `docker stop travel-platform-mailhog` → бронь → email-уведомление получает `failed` и `errorMessage`.
- **Bruno** напрямую `http://localhost:3004`: `GET /api/v2/notifications?type=booking_created` с заголовками User →
  свои; Agent (`X-User-Id` = владелец оффера) → уведомления по его офферам; Admin → все.

---

## Шаг 6. api-gateway

### Что добавить
1. `pnpm add @nestjs/throttler ioredis` (`@nestjs/axios` и `@nestjs/jwt` уже есть).
2. **Таблица маршрутов** `routes.config.ts` (порядок важен, сравнение по префиксу):
   ```ts
   export const ROUTES = [
     { prefix: "/api/v1/users", target: "AUTH" }, { prefix: "/api/v1/sessions", target: "AUTH" },
     { prefix: "/api/v2/users", target: "AUTH" }, { prefix: "/api/v2/sessions", target: "AUTH" },
     { prefix: "/api/v2/email-verifications", target: "AUTH" },
     { prefix: "/api/v1/destinations", target: "CATALOG" }, { prefix: "/api/v1/offers", target: "CATALOG" },
     { prefix: "/api/v2/destinations", target: "CATALOG" }, { prefix: "/api/v2/offers", target: "CATALOG" },   // D7
     { prefix: "/api/v1/bookings", target: "BOOKING" }, { prefix: "/api/v1/favorites", target: "BOOKING" },
     { prefix: "/api/v2/bookings", target: "BOOKING" }, { prefix: "/api/v2/favorites", target: "BOOKING" },
     { prefix: "/api/v2/analytics", target: "BOOKING" },
     { prefix: "/api/v2/notifications", target: "NOTIFICATION" },
   ];
   export const PUBLIC_V2 = [   // метод + регулярное выражение пути (D6)
     ["POST", /^\/api\/v2\/users$/], ["POST", /^\/api\/v2\/sessions$/], ["POST", /^\/api\/v2\/sessions\/refresh$/],
     ["DELETE", /^\/api\/v2\/sessions$/], ["POST", /^\/api\/v2\/email-verifications$/],
     ["GET", /^\/api\/v2\/offers(\/[^/]+)?$/], ["GET", /^\/api\/v2\/destinations(\/[^/]+)?$/],
   ];
   ```
   Маршрутов `/internal/*` в таблице **нет**, поэтому через gateway они дают 404. Это требование ТЗ.
3. **`ProxyController`** — Nest-контроллер, а не `http-proxy-middleware`. Так на proxied-запросы действуют guards
   (JWT, throttler) и глобальный exception filter:
   ```ts
   @Controller({ version: VERSION_NEUTRAL })
   export class ProxyController {
     @All("api/*path")
     @UseGuards(GatewayThrottlerGuard, GatewayJwtGuard)
     proxy(@Req() req: Request, @Res() res: Response) { return this.proxyService.forward(req, res); }
   }
   ```
   `ProxyService.forward`: найти target → `httpService.axiosRef.request({ method, url: base + req.originalUrl, data: req.body,
   headers: filtered, timeout: 5000, validateStatus: () => true })` → `res.status(r.status).json(r.data)`.
   Ошибки downstream (4xx/5xx) уже в едином формате и передаются как есть. `ECONNREFUSED`, `ENOTFOUND` и таймаут →
   `throw new ServiceUnavailableException(...)` → 503 в едином формате.
   Пробрасывать заголовки `content-type`, `authorization` (не нужен downstream, но не мешает), `idempotency-key`,
   `x-user-id` (только v1); hop-by-hop заголовки (`host`, `connection`, `content-length`) — нет.
   В gateway **не** включать `enableVersioning` с префиксом `api/v`, иначе он перехватит пути: версии разбирают сами сервисы.
4. **`GatewayJwtGuard`** — логика из раздела «Схема аутентификации»:
   ```ts
   const key = `jwt:claims:${sha256(token)}`;
   let claims = JSON.parse(await redis.get(key) ?? "null");
   if (!claims) {
     const payload = await jwt.verifyAsync(token).catch(() => { throw new UnauthorizedException(); });
     claims = await authClient.getUser(payload.sub);                 // 404 → 401
     await redis.set(key, JSON.stringify(claims), "EX", payload.exp - Math.floor(Date.now() / 1000));
   }
   ```
   Хранить хеш, а не сам токен: ключи Redis не должны содержать секреты.
5. **Rate limiting:** `ThrottlerModule.forRoot([{ ttl: 60_000, limit: 100 }])` + `GatewayThrottlerGuard extends ThrottlerGuard`
   с `shouldSkip()` → `true` для всего, кроме `GET /api/v1/offers*` и `GET /api/v2/offers*`. Трекер по IP:
   `app.set("trust proxy", true)` нужен, только если gateway стоит за другим прокси. Ответ 429 (в списке кодов ТЗ его
   нет, но это стандарт).
6. **Единый формат ошибок:** `GlobalExceptionFilter` из `libs/common` и `configureApp` без версионирования.
7. **Агрегированный Swagger:** каждый сервис публикует `/api/docs-json`. Gateway проксирует их как
   `GET /docs/{auth,catalog,booking,notification}.json` и настраивает
   `SwaggerModule.setup("api/docs", app, gatewayDoc, { explorer: true, swaggerOptions: { urls: [{ url: "/docs/auth.json", name: "auth-service" }, ...] } })`.
   В документах сервисов задать `.addServer("/")`, чтобы «Try it out» шёл через gateway. Пути одинаковые, поэтому
   запрос пройдёт gateway как обычный.

### Как настроить
- `.env`: `JWT_SECRET` (тот же, что у auth-service), `REDIS_URL=redis://localhost:6379`, `AUTH_SERVICE_URL`,
  `CATALOG_SERVICE_URL`, `BOOKING_SERVICE_URL`, `NOTIFICATION_SERVICE_URL`, `PORT=3000`.
- Redis-клиент — провайдер `{ provide: "REDIS", useFactory: (c) => new Redis(c.getOrThrow("REDIS_URL")) }` с
  `onModuleDestroy → quit()`.

### Проверка
- **Bruno:** в окружении поменять `baseUrl` на `http://localhost:3000` и **прогнать всю коллекцию этапов I–II без
  изменений**. Это и есть проверка требования «без изменения контрактов». Сравнить с эталоном шага 0.
  - Логин: post-response script `bru.setEnvVar("accessToken", res.body.accessToken)`, в защищённых запросах
    `Authorization: Bearer {{accessToken}}`.
  - `GET /api/v2/bookings` без токена → 401; с токеном → 200.
  - Подделка: `GET /api/v2/analytics/bookings` с токеном User **и** заголовком `X-User-Role: Admin` → 403
    (gateway затёр заголовок).
  - `GET /internal/v1/users/<id>` через `:3000` → 404.
  - Регистрация → `POST /api/v2/bookings` → 403 (email не подтверждён) → взять токен из письма в Mailhog →
    `POST /api/v2/email-verifications` → `POST /api/v2/sessions/refresh` → бронь → 201.
  - Остановить booking-service → `GET /api/v2/bookings` → 503 в едином формате.
- **Redis:**
  ```bash
  docker exec -it travel-redis redis-cli --scan --pattern 'jwt:claims:*'
  docker exec -it travel-redis redis-cli TTL jwt:claims:<hash>      # ≤ 900 с
  ```
  Второй запрос с тем же токеном **не** оставляет записи в логах auth-service про `/internal/v1/users`.
- **Rate limit:** Bruno Runner, 105 итераций `GET /api/v1/offers`, или из терминала:
  `for i in $(seq 1 105); do curl -s -o /dev/null -w "%{http_code}\n" localhost:3000/api/v1/offers; done | sort | uniq -c`
  → `100 200`, `5 429`. `GET /api/v1/destinations` не ограничивается.
- **Swagger:** http://localhost:3000/api/docs — выпадающий список из 4 сервисов.

---

## Шаг 7. Health-checks и полный docker-compose

### Что добавить
1. **`/health/ready` в каждом сервисе** (`@nestjs/terminus`; при ошибке он сам отвечает 503):
   - auth / booking / notification: `PrismaHealthIndicator.pingCheck("database", prisma)`;
   - catalog: `TypeOrmHealthIndicator.pingCheck("database")`;
   - booking / notification: свой `RabbitMqHealthIndicator` в `libs/common`: `amqpConnection.managedConnection.isConnected()`
     → `indicator.up()` / `down()` (через `HealthIndicatorService`, API Terminus 11);
   - gateway: `HttpHealthIndicator.pingCheck("auth-service", "http://auth-service:3001/health/ready")` × 4.
2. **Dockerfile на каждый сервис** (`apps/<svc>/Dockerfile`, контекст сборки — корень репозитория), multi-stage
   по образцу текущего. В build-стадии `pnpm nest build <svc>` и `prisma generate --config ...`. В runtime-стадии
   `CMD ["sh", "-c", "pnpm prisma migrate deploy --config apps/<svc>/prisma.config.ts && node dist/apps/<svc>/main"]`
   (у catalog миграции применяет `migrationsRun`). Скопировать `libs/contracts/proto`.
3. **docker-compose.yml.** Добавить 5 приложений в профиль `app`, как сейчас:
   ```yaml
   booking-service:
     build: { context: ., dockerfile: apps/booking-service/Dockerfile }
     environment:
       DATABASE_URL: postgresql://postgres:postgres@postgres-booking:5432/booking_db
       RABBITMQ_URL: amqp://guest:guest@rabbitmq:5672
       CATALOG_HTTP_URL: http://catalog-service:3002
       CATALOG_GRPC_URL: catalog-service:50052
     healthcheck:
       test: ["CMD", "node", "-e", "fetch('http://localhost:3003/health/ready').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"]
       interval: 10s
       start_period: 30s
       retries: 5
     depends_on:
       postgres-booking: { condition: service_healthy }
       rabbitmq:         { condition: service_healthy }
       catalog-service:  { condition: service_healthy }
   ```
   Граф зависимостей: `auth → postgres-auth`; `catalog → postgres-catalog`; `booking → postgres-booking, rabbitmq, catalog`;
   `notification → postgres-notify, rabbitmq, mailhog, auth`; `gateway → redis, auth, catalog, booking, notification`
   (все `service_healthy`, требование ТЗ 4.6).
   Наружу публикуются **только** `api-gateway` (3000) и UI (15672, 8025). Порты сервисов и баз вынести в
   `docker-compose.debug.yml` и подключать явно:
   `docker compose -f docker-compose.yml -f docker-compose.debug.yml --profile app up -d`.

### Проверка
- `docker compose --profile app up -d --build` → `docker compose ps`: все контейнеры `healthy`, gateway стартует последним.
- **Bruno:** `GET http://localhost:3000/health/ready` → 200 с `details` по 4 сервисам.
- `docker stop travel-rabbitmq` → `GET :3003/health/ready` (debug-порт) → 503 с `rabbitmq: down`; gateway
  `/health/ready` → 503, в `details` booking-service и notification-service `down`. Запустить обратно → 200.
- `docker compose ps` после остановки RabbitMQ: booking-service становится `unhealthy` через ~30 с.

---

## Шаг 8. Тесты

### Что добавить
1. **Unit (Vitest, D5).** Переехавшие спеки живут рядом с кодом в `apps/<svc>/src`. В корневом `vitest.config.mjs`
   задать `test.projects` (по проекту на сервис) и coverage с порогом 60%, как сейчас.
   - catalog: моки `getRepositoryToken(OfferEntity)` вместо `PrismaService`. Тесты availability (каждая причина
     `available: false`) и capacity (`affected = 0` → 409).
   - booking — **оркестрация** с замоканным `CatalogClient`: недоступно → 409 и `reserve` не вызван; `reserve` → 409 →
     брони нет; ошибка транзакции → `release` вызван ровно один раз; успех → `outboxEvent.create` вызван в той же
     транзакции. `OutboxWorker`: publish ok → `published`; publish throw → `attempts + 1`; 5-я ошибка → `failed`.
     `booking-state.spec.ts` переезжает как есть.
   - notification: повторное событие → `createMany` с `skipDuplicates`; невалидный payload → исключение.
   - gateway: попадание в кэш → `authClient` не вызван; промах → вызван, `redis.set` с правильным TTL; входящий
     `X-User-Role` затёрт; публичный маршрут без токена пропущен; таймаут downstream → 503.
2. **Integration-тесты оркестрации (booking + catalog, ТЗ 4.6).** `apps/booking-service/test/orchestration.int-spec.ts`:
   в одном процессе поднять **настоящие** catalog-service (HTTP на случайном порту + gRPC) и booking-service на
   тестовых БД `catalog_test` и `booking_test` (защита по суффиксу `_test` переносится из этапа II). `AmqpConnection`
   замокан, воркеры отключены. Сценарии:
   успех (бронь `pending` + outbox + `reserved_capacity = 1`); последний слот (вторая бронь 409, счётчик не вырос);
   сбой транзакции (через `vi.spyOn(prisma, "$transaction").mockRejectedValueOnce`) → счётчик вернулся в 0;
   отмена → счётчик −1.
3. **E2E через gateway (ТЗ 4.6).** `e2e/booking-flow.e2e-spec.ts` против поднятого `docker compose --profile app`:
   регистрация → поиск письма через Mailhog API
   (`GET http://localhost:8025/api/v2/search?kind=to&query=<email>`) → `POST /api/v2/email-verifications` →
   логин → `POST /api/v2/bookings` (оффер из seed) → опрос `GET /api/v2/notifications?type=booking_created`
   до появления записи (таймаут 30 с) → в Mailhog есть письмо о бронировании.
   Скрипт `"test:e2e": "vitest run --config vitest.e2e.config.mjs"`.

### Проверка
- `pnpm test`, `pnpm test:cov` (≥ 60% по каждому сервису), `pnpm test:int`, `pnpm test:e2e` — зелёные.

---

## Шаг 9. Завершение

1. **Удалить монолит** `apps/travel-platform-api` (он остаётся в git под тегом `stage-2`), его `prisma/` и старый `.env`.
2. **README** — пункты, обязательные по ТЗ 4.4:
   схема сервисов (диаграмма из раздела 1) и таблица маршрутизации `/api/v1` / `/api/v2`; запуск `docker compose up`;
   какой модуль монолита куда переехал (таблица из раздела 1); обоснование Prisma и TypeORM; схема аутентификации
   (JWT → Redis → заголовки, доверие внутренней сети, компромисс со свежестью claims).
   Плюс таблица отклонений: D3, D6, D7, `booking_created`, Vitest, поле `attempts`, `capacityReleased`, известные
   ограничения (утечка слота при сбое компенсации, один экземпляр outbox-воркера).
3. **CLAUDE.md и `.claude/rules/*` (+ `.cursor/rules/*`)** переписать под новую архитектуру: правило «Controller → Service → PrismaService» теперь
   действует внутри каждого сервиса; добавляются `libs/common`, `libs/contracts`, TypeORM в catalog, `/internal/v1`,
   доверие к заголовкам gateway.
4. **GitFlow:** `develop` → `main`, тег `stage-3`.

---

## Сводка новых зависимостей

| Пакет | Где | Зачем |
|---|---|---|
| `@nestjs/typeorm`, `typeorm`, `ts-node` (dev) | catalog | ORM каталога и CLI миграций |
| `@nestjs/microservices`, `@grpc/grpc-js`, `@grpc/proto-loader` | catalog, booking | gRPC |
| `@nestjs/axios`, `axios` | auth, booking, notification, gateway | внутренние HTTP-вызовы с таймаутом 5 с |
| `@golevelup/nestjs-rabbitmq` | booking, notification | RabbitMQ (amqplib) |
| `ioredis` | gateway | кэш claims |
| `@nestjs/throttler` | gateway | rate limiting |
| `passport-local` (+ types) | auth | вход через Passport |

## Где что смотреть (шпаргалка)

| Что | Как |
|---|---|
| auth_db / booking_db / notify_db | `pnpm studio:auth` (:5561) / `studio:booking` (:5563) / `studio:notify` (:5564) |
| catalog_db | `docker exec -it travel-catalog-db psql -U postgres -d catalog_db` или GUI на `localhost:5434` |
| RabbitMQ | http://localhost:15672 (guest/guest): exchange `travel.events`, queue `travel.notifications`, Publish/Get messages |
| Redis | `docker exec -it travel-redis redis-cli --scan --pattern 'jwt:claims:*'`, `TTL <key>` |
| Письма | http://localhost:8025 |
| Swagger | http://localhost:3000/api/docs (агрегированный), `:300X/api/docs` у каждого сервиса (debug-порты) |
| Health | `GET :3000/health/ready` и `GET :300X/health/ready` |
