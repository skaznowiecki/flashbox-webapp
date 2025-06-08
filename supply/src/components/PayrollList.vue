<template>
  <VRow>
    <v-col cols="12">
      <v-table height="500px" fixed-header>
        <thead>
          <tr>
            <th class="text-center" width="20%">Fecha</th>
            <th class="text-center" width="10%">Monto Neto</th>
            <th class="text-center" width="20%">Mensaje</th>
            <th class="text-center" width="10%">Detalle</th>
            <th class="text-center" width="20%">Accion</th>
            <th class="text-center" width="10%">Ver</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in payrolls" :key="item.id" class="text-left">
            <td>
              <PayrollListDate :payroll="item" />
            </td>
            <td>${{ item.amount }}</td>
            <td class="text-center">{{ renderMessage(item) }}</td>
            <td class="text-center">
              <v-btn size="small" @click="emitter('showInfo', item)" variant="outlined"
                v-if="item.information !== null || item.discount !== null">
                Info
              </v-btn>
              <span v-else>---</span>
            </td>
            <td>
              <PayrollListButton :payroll="item" @uploadFile="uploadFile" :loading="loading" />
            </td>
            <td>
              <v-menu v-if="item.bill !== null || item.taxWithholding !== null">
                <template v-slot:activator="{ props }">
                  <v-btn size="small" variant="outlined" v-bind="props">
                    Ver
                    <v-icon right>mdi-chevron-down</v-icon>
                  </v-btn>
                </template>
                <v-list>
                  <v-list-item v-if="item.bill !== null" :href="item.bill.invoiceUrl" target="_blank">
                    <v-list-item-title>Ver Factura</v-list-item-title>
                  </v-list-item>
                  <v-list-item v-if="item.taxWithholding !== null"
                    :href="`${cdnBaseUrl}/${item.taxWithholding.bucketKey}`" target="_blank">
                    <v-list-item-title>Ver Retenciones</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
              <span v-else>---</span>
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-col>
  </VRow>
</template>

<script setup>
import { computed } from 'vue'
import PayrollListDate from '@/components/PayrollListDate.vue'
import PayrollListButton from '@/components/PayrollListButton.vue'

const props = defineProps(['payrolls', 'loading'])
const emitter = defineEmits(['uploadFile', 'showInfo'])

const cdnBaseUrl = import.meta.env.VITE_CDN_BASE_URL

const renderMessage = (item) => {
  if (item.status === 'PAGADO') {
    return 'Pagado'
  }
  if (item.message) {
    return item.message
  }
  return '---'
}

const payrolls = computed(() => {
  return [...props.payrolls].sort((a, b) => {
    const year = b.year - a.year
    const month = b.month - a.month
    const detail = b.detail - a.detail

    if (year !== 0) {
      return year
    }

    if (month !== 0) {
      return month
    }

    return detail
  })
})

const uploadFile = (payload) => {
  emitter('uploadFile', payload)
}
</script>
