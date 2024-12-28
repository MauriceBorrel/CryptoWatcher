import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import TabsPage from '../views/TabsPage.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/tabs/coins'
  },
  {
    path: '/tabs/',
    component: TabsPage,
    children: [
      {
        path: '',
        redirect: '/tabs/coins'
      },
      {
        path: 'coins',
        name: 'CoinList',
        component: () => import('@/views/CoinList.vue')
      },
      {
        path: 'favourite',
        name: 'FavouritePage',
        component: () => import('@/views/FavouritePage.vue')
      },
      {
        path: 'coin/:id',
        name: 'CoinDetail',
        component: () => import('@/views/CoinDetail.vue')
      },
      {
        path: 'settings',
        name: 'SettingsPage',
        component: () => import('@/views/SettingsPage.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
