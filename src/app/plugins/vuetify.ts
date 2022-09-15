import Vue from 'vue'
import Vuetify from 'vuetify'
import de from 'vuetify/src/locale/de'
import en from 'vuetify/src/locale/en'

Vue.use(Vuetify)

export default new Vuetify({
  lang: {
    locales: {
      de,
      en,
    },
    current: 'de',
  },
  icons: {
    iconfont: 'mdiSvg',
  },
  theme: {
    dark: false,
    themes: {
      light: {
        primary: '#b0dcd9',
        secondary: '#ff8d06',
      },
    },
  },
})
