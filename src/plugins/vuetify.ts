
import Vue from 'vue';
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css';
import de from 'vuetify/src/locale/de';
import en from 'vuetify/src/locale/en';

Vue.use(Vuetify);

export default new Vuetify({
  lang: {
    locales: {
      de,
      en,
    },
    current: 'de',
  },
  icons: {
    iconfont: 'mdi',
  },
  theme: {
    dark: false,
    themes: {
      light: {
          ci: '#3B89A0',
          primary: '#B0DCD9',
          secondary: '#FF8D06',
          background: '#E9E9E9'
      }
    }
  }
});