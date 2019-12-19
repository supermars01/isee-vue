import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    },
    {
      path: '/module/industry',
      component: () => import('./views/Industry.vue')
    },
    {
      path: '/module/fushion',
      component: () => import('./views/Fushion.vue')
    },
    {
      path: '/module/paperMatrix',
      component: () => import('./views/PaperMatrix.vue')
    },
    {
      path: '/module/patentMatrix',
      component: () => import('./views/PatentMatrix.vue')
    },
    {
      path: '/module/worldMap',
      component: () => import('./views/WorldMap.vue')
    },
    {
      path: '/module/medicalWork',
      component: () => import('./views/MedicalWork.vue')
    },
    {
      path:'*',
      component: Home
    }
  ]
})
