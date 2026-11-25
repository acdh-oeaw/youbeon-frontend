# syntax=docker/dockerfile:1

FROM node:26-slim AS build

# install the pnpm version set in `devEngines.packageManager`.
COPY package.json /tmp/package.json
RUN npm install --global "pnpm@$(node --print 'require("/tmp/package.json").devEngines.packageManager.version')"

RUN mkdir /app && chown -R node:node /app
WORKDIR /app

USER node

# avoid installing git hooks.
ENV CI=true
# use the node.js version provided by the base image.
ENV PNPM_CONFIG_RUNTIME=false

COPY --chown=node:node package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY --chown=node:node patches ./patches

RUN pnpm fetch

COPY --chown=node:node env.d.ts index.html tsconfig.json vite.config.ts ./
COPY --chown=node:node scripts ./scripts
COPY --chown=node:node public ./public
COPY --chown=node:node config ./config
COPY --chown=node:node src ./src
COPY --chown=node:node data ./data

ARG VITE_APP_BASE_URL
ARG VITE_APP_MATOMO_BASE_URL
ARG VITE_APP_MATOMO_ID
ARG VITE_APP_REDMINE_ID

RUN pnpm install --frozen-lockfile --offline

ENV NODE_ENV=production

RUN pnpm run build

# serve
FROM caddy:2-alpine AS serve

COPY Caddyfile /etc/caddy/Caddyfile
COPY --from=build /app/dist /srv

EXPOSE 3000
