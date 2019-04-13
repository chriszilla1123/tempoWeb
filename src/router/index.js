import Vue from 'vue'
import Router from 'vue-router'
import tempoWeb from '@/components/tempoWeb'
import artistBrowser from '@/components/artistBrowser'
import albumBrowser from '@/components/albumBrowser'
import songBrowser from '@/components/songBrowser'

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/artists',
      name: 'artistBrowser',
      component: artistBrowser,
      props: true,
    },
    {
      path: '/albums',
      name: 'albumBrowser',
      component: albumBrowser,
      props: true,
    },
    {
      path: '/songs',
      name: 'songBrowser',
      component: songBrowser,
      props: true,
    },
  ],
  mode: 'history',
})
