<template>
  <div class="d-flex align-center justify-center" style="height: 100vh">
    <SupplierForm @checkSupplier="checkSupplier" />
  </div>
</template>
<script setup>
import SupplierForm from '@/components/SupplierForm.vue'
import { useRouter } from 'vue-router'
const router = useRouter()

const checkSupplier = (id) => {
  router.push({ name: 'SupplyShow', params: { id } })
}
</script>
