import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import SupplyShow from '@/views/SupplyShow.vue'
import MailboxView from '@/views/MailboxView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: HomeView
    },
    {
      path: '/:id/buzon',
      name: 'Mailbox',
      component: MailboxView
    },
    {
      path: '/:id',
      name: 'SupplyShow',
      component: SupplyShow
    }
  ]
})

export default router
