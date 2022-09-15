# syntax=docker/dockerfile:1

FROM node:16-slim

RUN mkdir /app && chown -R node:node /app
WORKDIR /app

USER node

COPY --chown=node:node package.json package-lock.json ./
COPY --chown=node:node tsconfig.json tsconfig.node.json .npmrc ./
COPY --chown=node:node public ./public
COPY --chown=node:node scripts ./scripts
COPY --chown=node:node data ./data
COPY --chown=node:node src ./src


RUN npm install --ci --no-audit --no-fund

ENV NODE_ENV=production

RUN npm run build

EXPOSE 8080

CMD ["npx", "serve", "-s", "dist", "-p", "8080"]
