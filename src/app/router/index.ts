import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Idea from '@/components/idea.vue'
import Influencer from '@/components/influencer.vue'
import Place from '@/components/place.vue'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'place',
    component: Place,
  },
  {
    path: '/Idea',
    name: 'idea',
    component: Idea,
  },
  {
    path: '/account',
    name: 'account',
    component: Influencer,
  },
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes,
})

export default router
