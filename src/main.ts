import Vue from 'vue'
import App from '@/app/app.vue'
import router from '@/app/router'
import vuetify from '@/app/plugins/vuetify'

Vue.config.productionTip = false

new Vue({
  vuetify,
  router,
  render: (h) => h(App),
}).$mount('#app')
