<template>
  <VCol cols="12">
    <VTable class="elevation-1 rounded-lg">
      <thead class="text-uppercase text-subtitle-2">
        <tr>
          <th class="text-center">ID</th>
          <th class="text-center" style="width: 10%">Razon social</th>
          <th class="text-center" style="width: 10%">Tags</th>
          <th class="text-center">CUIL/CUIT</th>
          <th class="text-center">Empresa</th>

          <th class="text-center">Total</th>
          <th class="text-center">Tipo</th>

          <th class="text-center">Liquidacion</th>
          <th class="text-center">Mes</th>

          <th class="text-center">Emision</th>
          <th class="text-center">Recepcion</th>
          <th class="text-center">Fecha pago</th>

          <th class="text-center">Links</th>
          <th class="text-center">Accion</th>
        </tr>
      </thead>
      <tbody class="text-body-2">
        <tr
          v-for="(item, index) in invoices"
          :key="item.pk"
          :class="[
            { 'credit-note-item': hasCreditNote(item) },
            { 'bg-grey-lighten-2': index % 2 !== 0 }
          ]"
        >
          <td class="text-center">{{ item.id }}</td>
          <td class="text-center">{{ item.supplier.name || 'SIN NOMBRE' }}</td>
          <td class="text-center">
            <SupplierTag :tags="item.tags" />
          </td>
          <td class="text-center">{{ item.supplier.idNumber }}</td>
          <td class="text-center">{{ item.business.name }}</td>

          <td class="text-center">
            <!-- ${{ Number(item.total) }} -->
            <Amount :bill="item" :payroll="item.payroll" type="bill" />
          </td>
          <td class="text-center">{{ item.type || '-' }}</td>

          <td class="text-center">
            <span v-if="item.payroll === null">S/L</span>
            <span v-else> ${{ Number(item.payroll.amount) }} </span>
          </td>

          <td class="text-center">
            <span v-if="item.payroll === null">S/L</span>
            <span v-else>{{ getMonth(item.payroll.month) }}</span>
          </td>

          <td class="text-center">{{ item.dateOfIssue }}</td>
          <td class="text-center">
            <AppDate :datetime="item.createdAt" />
          </td>

          <td class="text-center">
            <AppDate :datetime="item.paymentDate" v-if="item.paymentDate !== null" />
            <span v-else>-</span>
          </td>

          <td class="text-center">
            <v-row align="center" justify="center">
              <v-col cols="auto">
                <VBtn :href="item.invoiceUrl" target="_blank" variant="outlined" size="small"
                  >FC</VBtn
                >
              </v-col>
              <v-col cols="auto">
                <VBtn
                  :href="hasCreditNote(item) ? item.creditNote.url : null"
                  target="_blank"
                  variant="outlined"
                  size="small"
                  :disabled="!hasCreditNote(item)"
                  >NC</VBtn
                >
              </v-col>
            </v-row>
          </td>

          <td class="text-center">
            <v-row align="center" justify="center">
              <v-col cols="auto" v-if="item.description">
                <VBtn
                  variant="outlined"
                  size="small"
                  :loading="loading"
                  @click="emitter('show', item)"
                  >Ver</VBtn
                >
              </v-col>
              <v-col cols="auto">
                <VBtn
                  variant="outlined"
                  size="small"
                  color="error"
                  :disabled="!canAction('delete-invoice')"
                  :loading="loading"
                  @click="emitter('delete', item)"
                >
                  X</VBtn
                >
              </v-col>
            </v-row>
          </td>
        </tr>
      </tbody>
    </VTable>
  </VCol>
</template>

<style scoped>
.credit-note-item {
  background-color: #d6eeee;
}
</style>

<script setup>
import { computed } from 'vue'

import { useAuthorizer } from '@/composables/authorizer'
import { months } from '@/data/constants.json'

const { canAction } = useAuthorizer()

import SupplierTag from '@/components/shared/SupplierTag.vue'
import Amount from '@/components/shared/Amount.vue'

const emitter = defineEmits(['delete', 'show'])

const hasCreditNote = (item) => {
  return item.creditNote !== null
}

const props = defineProps({
  invoices: {
    type: Array,
    required: true
  },
  loading: {
    type: Boolean,
    required: true
  }
})
const invoices = computed(() => {
  return props.invoices
})

const getMonth = (month) => {
  return months.find((item) => item.value === month).key
}
</script>
