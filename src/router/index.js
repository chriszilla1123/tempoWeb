import Vue from 'vue'
import Router from 'vue-router'
import tempoWeb from '@/components/tempoWeb'
import about from '@/components/about'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'tempoWeb',
      component: tempoWeb
    },
    /*{
      path: '/about',
      name: 'about',
      component: about
    }*/
  ]
})
