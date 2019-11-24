import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Sidechain from './views/Sidechain.vue'
import Transaction from './views/Transaction.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/sidechain/:sidechain',
      name: 'sidechain',
      component: Sidechain
    },
    {
      path: '/sxid/:sidechain/:sxid',
      name: 'transaction',
      component: Transaction
    }
  ]
})
