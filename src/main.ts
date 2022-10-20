import '@fontsource/inter/variable-full.css'
import 'tailwindcss/tailwind.css'
import '@/styles/index.css'
import '@/styles/nprogress.css'

import { createApp } from 'vue'

import App from '@/app/app.vue'
import { router } from '@/app/router'

createApp(App).use(router).mount('#app')
