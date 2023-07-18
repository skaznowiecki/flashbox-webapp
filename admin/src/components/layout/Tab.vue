<template>
  <v-tabs color="mb-10" align-tabs="left" v-model:model-value="section">
    <v-tab
      v-for="{ title, value, active, name } in sections"
      :key="value"
      :value="name"
      :to="{ name: value }"
      :disabled="!active"
      >{{ title }}</v-tab
    >
  </v-tabs>
</template>

<script setup>
import { computed, ref } from 'vue'

import { useAuthStore } from '@/stores/AuthStore'
import { useRoute } from 'vue-router'

const route = useRoute()

const authStore = useAuthStore()

const { user } = authStore

let section = ref(route.meta.section)

const allSections = [
  {
    title: 'Usuarios',
    value: 'UserList',
    name: 'user',
    role: ['superadmin', 'admin'],
    active: true
  },
  {
    title: 'Facturas',
    value: 'InvoiceList',
    name: 'invoice',
    role: ['superadmin', 'admin', 'user'],
    active: true
  },
  {
    title: 'Buzon',
    value: 'MailboxList',
    name: 'mailbox',
    role: ['superadmin', 'admin', 'user'],
    active: true
  },
  {
    title: 'Notas de credito',
    value: 'CreditNoteList',
    name: 'credit-note',
    role: ['superadmin', 'admin', 'user'],
    active: true
  },
  {
    title: 'Proveedores',
    value: 'SupplierList',
    name: 'supplier',
    role: ['superadmin', 'admin', 'user'],
    active: true
  },

  {
    title: 'Liquidacion',
    value: 'PayrollList',
    name: 'payroll',
    role: ['superadmin', 'admin', 'user'],
    active: true
  }
]

const sections = computed(() => {
  return allSections.filter((section) => section.role.includes(user.role))
})
</script>
