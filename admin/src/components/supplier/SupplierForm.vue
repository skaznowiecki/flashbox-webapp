<template>
  <VRow class="mt-2 d-flex">
    <VCol cols="2">
      <SupplierFormSidebar @changeTab="changeTab" :tab="activeTab" />
    </VCol>
    <VCol cols="10" md="10">
      <SupplierFormGeneral v-if="activeTab === 'general'" :tags="tags" :supplier="supplier" />
      <SupplierFormBank v-if="activeTab === 'bank'" :supplier="supplier" />
      <SupplierFormAction @submit="submit" :loading="loading" />
    </VCol>
  </VRow>
</template>

<script setup>
import SupplierFormSidebar from '@/components/supplier/form/SupplierFormSidebar.vue'
import SupplierFormGeneral from '@/components/supplier/form/SupplierFormGeneral.vue'
import SupplierFormBank from '@/components/supplier/form/SupplierFormBank.vue'
import SupplierFormAction from '@/components/supplier/form/SupplierFormAction.vue'

import { ref } from 'vue'

const emitter = defineEmits(['submit'])

const props = defineProps({
  tags: {
    type: Array,
    default: () => []
  },
  supplier: {
    type: Object,
    default: () => ({})
  },
  tab: {
    type: String,
    default: 'general'
  },
  loading: {
    type: Boolean,
    default: false
  }
})

let activeTab = ref(props.tab)

const changeTab = (tab) => {
  activeTab.value = tab
}

const submit = () => {
  emitter('submit', { ...props.supplier })
}
</script>
