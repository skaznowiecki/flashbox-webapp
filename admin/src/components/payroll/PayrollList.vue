<template>
  <VCol cols="12">
    <VTable class="elevation-1 rounded-lg">
      <thead class="text-uppercase text-subtitle-2">
        <tr>
          <th class="text-center" style="width: 20%">Nombre</th>
          <th class="text-center">CUIT/CUIL</th>

          <th class="text-center">Tags</th>
          <th class="text-center">MES</th>
          <th class="text-center">AÑO</th>
          <th class="text-center">Detalle</th>
          <th class="text-center">Status</th>
          <th class="text-center" style="width: 10%">Link</th>
          <th class="text-center">Monto Liquidado</th>
          <th class="text-center">Monto Facturado</th>

          <th class="text-center">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in payrolls" :key="item.id">
          <td class="text-center">{{ item.supplier.name }}</td>
          <td class="text-center">{{ item.supplier.idNumber }}</td>

          <td class="text-center">
            <SupplierTag :tags="item.tags" />
          </td>
          <td class="text-center">{{ getMonth(item.month) }}</td>
          <td class="text-center">{{ item.year }}</td>
          <td class="text-center">{{ item.detail }}</td>
          <td class="text-center">
            <v-btn density="compact" block :disabled="true" :title="item.message">{{
              item.status
            }}</v-btn>
          </td>
          <td class="text-center">
            <VBtn
              :href="item.bill.invoiceUrl"
              target="_blank"
              variant="outlined"
              size="small"
              v-if="item.bill !== null"
              >PDF</VBtn
            >
          </td>

          <td class="text-center">${{ item.amount }}</td>
          <td class="text-center">
            <Amount :bill="item.bill" :payroll="item" type="bill" />
          </td>

          <td class="text-center">
            <v-row align="center" justify="center">
              <v-col cols="auto">
                <v-btn
                  size="small"
                  @click="emitter('delete', item)"
                  variant="outlined"
                  :loading="loading"
                  :disabled="!canAction('delete-payroll')"
                >
                  Eliminar
                </v-btn>
              </v-col>
            </v-row>
          </td>
        </tr>
      </tbody>
    </VTable>
  </VCol>
</template>

<script setup>
import { computed } from 'vue'
import SupplierTag from '@/components/shared/SupplierTag.vue'

import { months } from '@/data/constants.json'
import Amount from '@/components/shared/Amount.vue'

import { useAuthorizer } from '@/composables/authorizer'

const { canAction } = useAuthorizer()

const emitter = defineEmits(['delete'])

const props = defineProps({
  payrolls: {
    type: Array,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const payrolls = computed(() => {
  return props.payrolls
})

const getMonth = (month) => {
  return months.find((item) => item.value === month).key
}
</script>
