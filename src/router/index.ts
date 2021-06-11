import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Idea from '../components/Idea.vue'
import Influencer from '../components/Influencer.vue'
import Place from '../components/Place.vue'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Influencer',
    component: Influencer
  },
  {
    path: '/Idea',
    name: 'idea',
    component: Idea
  },
  {
    path: '/Place',
    name: 'place',
    component: Place
  },

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
