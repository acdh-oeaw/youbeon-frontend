import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'places',
    component() {
      return import('@/components/places.vue')
    },
  },
  {
    path: '/ideas',
    name: 'ideas',
    component() {
      return import('@/components/ideas.vue')
    },
  },
  {
    path: '/accounts',
    name: 'accounts',
    component() {
      return import('@/components/accounts.vue')
    },
  },
]

const router = new VueRouter({
  base: process.env.BASE_URL,
  mode: 'hash',
  routes,
})

export default router
