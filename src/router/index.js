import Vue from 'vue'
import Router from 'vue-router'
import tempoWeb from '@/components/tempoWeb'
import artistBrowser from '@/components/artistBrowser'
import albumBrowser from '@/components/albumBrowser'
import songBrowser from '@/components/songBrowser'
import searchBrowser from '@/components/searchBrowser'

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
    {
      path: '/search',
      name: 'searchBrowser',
      component: searchBrowser,
      props: true,
    },
  ],
  mode: 'history',
})
