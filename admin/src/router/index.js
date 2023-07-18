import { createRouter, createWebHistory } from 'vue-router'

import SignInView from '@/views/SignInView.vue'
import ResetPasswordView from '@/views/ResetPasswordView.vue'

import UserListView from '@/views/UserListView.vue'
import SupplierListView from '@/views/SupplierListView.vue'

import PayrollListView from '@/views/PayrollListView.vue'

import InvoiceListView from '@/views/InvoiceListView.vue'
import CreditNoteListView from '@/views/CreditNoteListView.vue'

import SupplierEditView from '@/views/SupplierEditView.vue'
import MailboxListView from '../views/MailboxListView.vue'

import { useAuthStore } from '@/stores/AuthStore'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      redirect: () => {
        return { path: '/invoices' }
      },
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/invoices',
      name: 'InvoiceList',
      component: InvoiceListView,
      meta: {
        requiresAuth: true,
        title: 'Facturas',
        section: 'invoice'
      }
    },
    {
      path: '/mailbox',
      name: 'MailboxList',
      component: MailboxListView,
      meta: {
        requiresAuth: true,
        title: 'Buzon',
        section: 'mailbox'
      }
    },
    {
      path: '/credit-notes',
      name: 'CreditNoteList',
      component: CreditNoteListView,
      meta: {
        requiresAuth: true,
        title: 'Notas de crédito',
        section: 'credit-note'
      }
    },
    {
      path: '/payroll',
      name: 'PayrollList',
      component: PayrollListView,
      meta: {
        requiresAuth: true,
        title: 'Proveedores',
        section: 'payroll'
      }
    },
    {
      path: '/users',
      name: 'UserList',
      component: UserListView,
      meta: {
        requiresAuth: true,
        title: 'Usuarios',
        section: 'user'
      }
    },
    {
      path: '/suppliers',
      name: 'SupplierList',
      component: SupplierListView,
      meta: {
        requiresAuth: true,
        title: 'Proveedores',
        section: 'supplier'
      }
    },
    {
      path: '/suppliers/:id/:section?',
      name: 'SupplierEdit',
      component: SupplierEditView,
      meta: {
        requiresAuth: true,
        title: 'Proveedores',
        section: 'supplier'
      },
      props: true
    },
    {
      path: '/sign-in',
      name: 'SignIn',
      component: SignInView,
      meta: {
        requiresAuth: false,
        title: 'Iniciar sesión'
      }
    },
    {
      path: '/reset-password',
      name: 'ResetPassword',
      component: ResetPasswordView,
      meta: {
        requiresAuth: false,
        title: 'Restablecer contraseña'
      }
    }
  ]
})

const DEFAULT_TITLE = 'Facturas'

router.beforeEach((to) => {
  const store = useAuthStore()
  document.title = to.meta.title || DEFAULT_TITLE
  if (to.meta.requiresAuth === true && !store.isLoggedIn) return '/sign-in'
})

export default router
