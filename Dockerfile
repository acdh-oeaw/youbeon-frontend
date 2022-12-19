# syntax=docker/dockerfile:1

FROM node:18-slim AS build

RUN corepack enable

RUN mkdir /app && chown -R node:node /app
WORKDIR /app

USER node

COPY --chown=node:node .npmrc package.json pnpm-lock.yaml ./

RUN pnpm fetch

COPY --chown=node:node env.d.ts index.html tailwind.config.cjs tsconfig.json tsconfig.node.json vite.config.ts ./
COPY --chown=node:node scripts ./scripts
COPY --chown=node:node public ./public
COPY --chown=node:node config ./config
COPY --chown=node:node src ./src
COPY --chown=node:node data ./data
COPY --chown=node:node patches ./patches

ARG REDMINE_ID
ARG VITE_APP_BASE_URL
ARG VITE_APP_MATOMO_BASE_URL
ARG VITE_APP_MATOMO_ID

RUN pnpm install --frozen-lockfile --offline

ENV NODE_ENV=production

RUN pnpm run build

# serve
FROM node:18-slim AS serve

RUN mkdir /app && chown -R node:node /app
WORKDIR /app

COPY --chown=node:node serve.json ./dist
COPY --from=build --chown=node:node /app/dist ./dist

EXPOSE 8080

CMD ["npx", "serve", "-s", "dist", "-p", "8080", "-c", "serve.json"]
