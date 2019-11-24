import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Sidechain from './views/Sidechain.vue'
import Scan from './views/Scan.vue'
import Transaction from './views/Transaction.vue'
import Transactions from './views/Transactions.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/sidechain/:sidechain/:address',
      name: 'sidechain',
      component: Transactions
    },
    {
      path: '/sidechain/:sidechain',
      name: 'sidechain',
      component: Sidechain
    },
    {
      path: '/scan/:address',
      name: 'scanaddrress',
      component: Scan
    },
    {
      path: '/sxid/:sidechain/:sxid',
      name: 'transaction',
      component: Transaction
    }
  ]
})
