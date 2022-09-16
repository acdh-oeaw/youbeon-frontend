import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'places',
    component() {
      return import('@/components/places.view.vue')
    },
  },
  {
    path: '/ideas',
    name: 'ideas',
    component() {
      return import('@/components/ideas.view.vue')
    },
  },
  {
    path: '/accounts',
    name: 'accounts',
    component() {
      return import('@/components/accounts.view.vue')
    },
  },
  {
    path: '/imprint',
    name: 'imprint',
    component() {
      return import('@/components/imprint.view.vue')
    },
  },
]

const router = new VueRouter({
  base: process.env['BASE_URL'],
  mode: 'history',
  routes,
})

export default router
