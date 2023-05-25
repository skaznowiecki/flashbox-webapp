<template>
  <VCol cols="12">
    <VTable class="elevation-1 rounded-lg">
      <thead class="text-uppercase text-subtitle-2">
        <tr>
          <th class="text-center" style="width: 20%">Razon social</th>
          <th class="text-center">Tags</th>
          <th class="text-center">CUIL/CUIT</th>
          <th class="text-center">Empresa</th>
          <th class="text-center">Total</th>
          <th class="text-center">Emision</th>
          <th class="text-center">Recepcion</th>
          <!-- <th class="text-center">Estado</th> -->
          <th class="text-center">Link</th>
        </tr>
      </thead>
      <tbody class="text-body-2">
        <tr v-for="item in invoices" :key="item.pk">
          <td class="text-center">{{ item.supplier.name || 'SIN NOMBRE' }}</td>
          <td class="text-center">
            <SupplierTag :tags="item.tags" />
          </td>
          <td class="text-center">{{ item.supplier.idNumber }}</td>
          <td class="text-center">{{ item.business.name }}</td>

          <td class="text-center">${{ Number(item.total) }}</td>
          <td class="text-center">{{ item.dateOfIssue }}</td>
          <td class="text-center">
            <AppDate :datetime="item.createdAt" />
          </td>

          <td class="text-center">
            <VBtn :href="item.invoiceUrl" target="_blank" variant="outlined" size="small">PDF</VBtn>
          </td>
        </tr>
      </tbody>
    </VTable>
  </VCol>
</template>

<style scoped>
table thead {
  background-color: #eceff1;
}
</style>

<script setup>
import { computed } from 'vue'
import SupplierTag from '@/components/shared/SupplierTag.vue'

const props = defineProps({
  invoices: {
    type: Array,
    required: true
  }
})
const invoices = computed(() => {
  return props.invoices
})
</script>
