import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Sidechain from './views/Sidechain.vue'
import Scan from './views/Scan.vue'
import Transaction from './views/Transaction.vue'
import Transactions from './views/Transactions.vue'
import Create from './views/Create.vue'
import Login from './views/Login.vue'
import Explorer from './views/Explorer.vue'

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
      name: 'sidechain-transactions',
      component: Transactions
    },
    {
      path: '/sidechain/:sidechain',
      name: 'sidechain-single',
      component: Sidechain
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/create',
      name: 'create',
      component: Create
    },
    {
      path: '/explorer',
      name: 'explorer',
      component: Explorer
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
