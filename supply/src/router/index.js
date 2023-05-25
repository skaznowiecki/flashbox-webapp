import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import SupplyShow from '@/views/SupplyShow.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: HomeView
    },
    {
      path: '/:id',
      name: 'SupplyShow',
      component: SupplyShow
    }
  ]
})

export default router
