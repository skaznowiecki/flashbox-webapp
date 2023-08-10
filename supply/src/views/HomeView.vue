<template>
  <div class="d-flex align-center justify-center" style="height: 100vh">
    <SupplierForm @checkSupplier="checkSupplier" :loading="loading"/>
  </div>
</template>
<script setup>

import { API } from 'aws-amplify'


import SupplierForm from '@/components/SupplierForm.vue'
import { useRouter } from 'vue-router'
import { ref } from 'vue'

let loading = ref(false)

const router = useRouter()

const checkSupplier = async (id) => {
  loading.value = true
  try {
    const { tags } = await API.get('api', `/suppliers/${id}/tags`);

    const tag = tags.find(tag => tag.name === 'FACTURA DE DISEÑO');

    if(tag){
      router.push({ name: 'Mailbox' })
    } else {
      router.push({ name: 'SupplyShow', params: { id } })
    }

  } catch (error) {
    router.push({ name: 'SupplyShow', params: { id } })
  } finally {
    loading.value = false
  }
  
}
</script>
