import Vue from 'vue'
import Router from 'vue-router'
import Recommend from '@/components/Recommend'
import Singer from '@/components/Singer'
import Rank from '@/components/Rank'
import Search from '@/components/Search'
import SingerDetail from '@/components/detail'

Vue.use(Router)

export default new Router({

  routes: [
    {
      path: '/',
      redirect: '/recommend'
    },
    {
      path: '/recommend',
      name: 'recommend',
      component: Recommend
    },
    {
      path: '/singer',
      component: Singer,
      children: [{
        path: ':id',
        component: SingerDetail
      }]
    },
    {
      path: '/rank',
      name: 'rank',
      component: Rank
    },
    {
      path: '/search',
      name: 'search',
      component: Search
    }
  ]
})
