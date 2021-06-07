import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import Idee from '../components/Ideen.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Idee
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
