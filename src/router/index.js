import Vue from 'vue'
import Router from 'vue-router'
import BootstrapVue from 'bootstrap-vue'
import HelloWorld from '@/components/HelloWorld'
import Contract from '@/components/Contract'
import Arbiter from '@/components/Arbiter'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.use(BootstrapVue);
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/contract/:id',
      name: 'Contract',
      component: Contract
    },
    {
      path: '/arbiter',
      name: 'CreateArbiter',
      component: Arbiter
    },
    {
      path: '/arbiter/:id',
      name: 'ArbiterProfile',
      component: Arbiter
    }

  ]
})
