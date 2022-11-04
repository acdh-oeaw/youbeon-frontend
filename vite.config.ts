import { join } from 'node:path'

import vue from '@vitejs/plugin-vue'
import type { Plugin } from 'vite'
import { defineConfig, loadEnv } from 'vite'
import { imagetools } from 'vite-imagetools'

import { metadata } from './config/metadata.config'
import { createAnalyticsScript } from './src/app/matomo-analytics'

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const env = loadEnv(process.env['NODE_ENV']!, process.cwd())

const canonicalUrl = env['VITE_APP_BASE_URL']
const title = [metadata.shortTitle, metadata.title].join(' - ')

/**
 * Plugin to add `<title>` and `<meta>` to `index.html`.
 */
function meta(): Plugin {
  return {
    name: 'meta',
    transformIndexHtml(html) {
      return {
        html: html.replace(/<html lang="(.*?)">/, `<html lang="${metadata.locale}">`),
        tags: [
          { tag: 'title', children: title, injectTo: 'head' },
          {
            tag: 'link',
            attrs: { href: '/favicon.ico', rel: 'icon', sizes: 'any' },
            injectTo: 'head',
          },
          {
            tag: 'link',
            attrs: { href: '/apple-touch-icon.png', rel: 'apple-touch-icon' },
            injectTo: 'head',
          },
          { tag: 'link', attrs: { href: '/app.webmanifest', rel: 'manifest' }, injectTo: 'head' },
          {
            tag: 'meta',
            attrs: { name: 'description', content: metadata.description },
            injectTo: 'head',
          },
          { tag: 'link', attrs: { rel: 'canonical', href: canonicalUrl }, injectTo: 'head' },

          { tag: 'meta', attrs: { property: 'og:type', content: 'website' }, injectTo: 'head' },
          { tag: 'meta', attrs: { property: 'og:url', content: canonicalUrl }, injectTo: 'head' },
          { tag: 'meta', attrs: { property: 'og:title', content: title }, injectTo: 'head' },
          {
            tag: 'meta',
            attrs: { property: 'og:description', content: metadata.description },
            injectTo: 'head',
          },
          {
            tag: 'meta',
            attrs: { property: 'og:image', content: '/image.webp' },
            injectTo: 'head',
          },
          {
            tag: 'meta',
            attrs: { property: 'og:locale', content: metadata.locale },
            injectTo: 'head',
          },
        ],
      }
    },
  }
}

/**
 * Add preload `<link>` for database chunk.
 */
function preloadDatabase(): Plugin {
  return {
    name: 'preloadDatabase',
    transformIndexHtml(html, ctx) {
      /** Only add in production build. */
      if (ctx.bundle == null) return
      const key = Object.keys(ctx.bundle).find((key) => {
        return key.startsWith('assets/db.')
      })
      if (key == null) return undefined
      return [{ tag: 'link', attrs: { rel: 'modulepreload', href: '/' + key }, injectTo: 'head' }]
    },
  }
}

/**
 * Add Matomo analytics script.
 */
function matomoAnalytics(): Plugin | undefined {
  const baseUrl = env['VITE_APP_MATOMO_BASE_URL']
  const id = env['VITE_APP_MATOMO_ID']

  if (baseUrl == null || id == null) return

  return {
    name: 'matomoAnalytics',
    transformIndexHtml(html, ctx) {
      /** Only add in production build. */
      if (ctx.bundle == null) return
      return [
        {
          tag: 'script',
          attrs: { defer: true },
          children: createAnalyticsScript(baseUrl, id),
          injectTo: 'body',
        },
      ]
    },
  }
}

export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          /** Could probably be further optimized by putting all idea.quotes in a separete file and chunk. */
          if (id.includes('/src/db/')) {
            return 'db'
          }
          return undefined
        },
      },
    },
  },
  define: {
    __VUE_OPTIONS_API__: false,
  },
  plugins: [vue(), imagetools(), meta(), preloadDatabase(), matomoAnalytics()],
  resolve: {
    /** Consider using `vite-tsconfig-paths` plugin. */
    alias: {
      '@': join(process.cwd(), 'src'),
      '~': process.cwd(),
    },
  },
})
