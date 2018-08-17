import Vue from 'vue'
import Router from 'vue-router'
import tempoWeb from '@/components/tempoWeb'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'tempoWeb',
      component: tempoWeb
    },
  ]
})
