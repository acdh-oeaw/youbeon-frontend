import { defineConfig } from '@vue/cli-service'

import { metadata } from './config/metadata.config.mjs'

const config = defineConfig({
  chainWebpack(config) {
    /**
     * @see https://github.com/vuejs/vue-cli/issues/3123
     */
    config.resolve.alias.set('~', process.cwd())

    config.plugin('html').tap((args) => {
      args[0].title = metadata.title
      args[0].meta = {
        description: metadata.description,
        'og:title': metadata.title,
        'og:description': metadata.description,
      }
      return args
    })
  },
  productionSourceMap: false,
  transpileDependencies: true,
})

export default config
