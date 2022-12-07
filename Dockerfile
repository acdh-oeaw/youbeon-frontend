# syntax=docker/dockerfile:1

FROM node:18-slim

RUN mkdir /app && chown -R node:node /app
WORKDIR /app

USER node

COPY --chown=node:node package.json package-lock.json ./
COPY --chown=node:node serve.json ./
COPY --chown=node:node app.d.ts index.html tailwind.config.cjs tsconfig.json tsconfig.node.json vite.config.ts ./
COPY --chown=node:node scripts ./scripts
COPY --chown=node:node public ./public
COPY --chown=node:node config ./config
COPY --chown=node:node src ./src
COPY --chown=node:node data ./data
COPY --chown=node:node patches ./patches

ARG REDMINE_ID=19337
ARG VITE_APP_BASE_URL
ARG VITE_APP_MATOMO_BASE_URL
ARG VITE_APP_MATOMO_ID

RUN npm install --ci --no-audit --no-fund

ENV NODE_ENV=production

RUN npm run build

EXPOSE 8080

CMD ["npx", "serve", "-s", "dist", "-p", "8080", "-c", "../serve.json"]
