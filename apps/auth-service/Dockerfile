# syntax=docker/dockerfile:1
# auth-service — build context is the repository root:
#   docker build -f apps/auth-service/Dockerfile .
# Targets: `build` (full toolchain: also used by the one-shot migrate containers) and `runtime` (default).

FROM node:24-slim AS base
ENV PNPM_HOME=/pnpm \
    PATH=/pnpm:$PATH \
    HUSKY=0
RUN corepack enable && corepack prepare pnpm@10.33.0 --activate
WORKDIR /app

FROM base AS build
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm prisma:generate:auth && pnpm exec nest build auth-service

FROM base AS prod-deps
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod --frozen-lockfile --ignore-scripts

FROM node:24-slim AS runtime
ENV NODE_ENV=production
WORKDIR /app
# package.json is needed at runtime: its "imports" map resolves the #…-prisma aliases
COPY --chown=node:node package.json ./
COPY --from=prod-deps --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/dist/apps/auth-service ./dist/apps/auth-service
# Prisma client of this service (package.json "imports" points here)
COPY --from=build --chown=node:node /app/apps/auth-service/prisma/generated ./apps/auth-service/prisma/generated
USER node
EXPOSE 3001
CMD ["node", "dist/apps/auth-service/apps/auth-service/src/main"]
