<template>
  <v-navigation-drawer expand-on-hover rail>
    <v-list>
      <v-list-item :title="user.name" :subtitle="user.email"></v-list-item>
    </v-list>
    <v-divider></v-divider>
    <v-list density="compact" nav>
      <v-list-item
        v-for="{ title, icon, value } in sections"
        :key="value"
        :prepend-icon="icon"
        :title="title"
        :value="value"
        :active="section === value"
        @click="redirect(value)"
      ></v-list-item>
    </v-list>
    <template v-slot:append>
      <v-list density="compact" nav>
        <v-list-item
          prepend-icon="mdi-logout"
          title="Salir"
          value="1"
          @click="logout"
        ></v-list-item>
      </v-list>
    </template>
  </v-navigation-drawer>
</template>

<script setup>
import { computed, ref } from 'vue'

import { useAuthStore } from '@/stores/AuthStore'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const authStore = useAuthStore()

const { user } = authStore

let section = ref(route.name)

const allSections = [
  {
    title: 'Usuarios',
    icon: 'mdi-account',
    value: 'UserList',
    role: ['superadmin', 'admin']
  },
  {
    title: 'Facturas',
    icon: 'mdi-receipt-text',
    value: 'InvoiceList',
    role: ['superadmin', 'admin', 'user']
  },
  {
    title: 'Liquidacion',
    icon: 'mdi-cash-multiple',
    value: 'SupplyFileList',
    role: ['superadmin', 'admin']
  }
]

const sections = computed(() => {
  return allSections.filter((section) => section.role.includes(user.role))
})

const redirect = (value) => {
  router.push({ name: value })
}

const logout = () => {
  authStore.$reset()
  router.push({ name: 'SignIn' })
}
</script>
