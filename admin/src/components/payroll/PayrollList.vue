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
          <th class="text-center">Periodo</th>

          <th class="text-center">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in payrolls" :key="item.id" :class="{ 'bg-grey-lighten-2': index % 2 !== 0 }">
          <td class="text-center">{{ item.supplier.name }}</td>
          <td class="text-center">{{ item.supplier.idNumber }}</td>

          <td class="text-center">
            <SupplierTag :tags="item.tags" />
          </td>
          <td class="text-center">{{ getMonth(item.month) }}</td>
          <td class="text-center">{{ item.year }}</td>
          <td class="text-center">{{ item.detail }}</td>
          <td class="text-center">
            <v-btn class="text-white" size="small" :color="getColor(item.status)" @click="emitter('changeStatus', item)"
              flat>{{ item.status }}</v-btn>
          </td>
          <td class="text-center">
            <VBtn :href="item.bill.invoiceUrl" target="_blank" variant="outlined" size="small"
              v-if="item.bill !== null">PDF</VBtn>
          </td>

          <td class="text-center">${{ item.amount }}</td>
          <td class="text-center">
            <Amount :bill="item.bill" :payroll="item" type="bill" />
          </td>
          <td class="text-center">
            +{{ item.paymentPeriod || item.supplier.paymentPeriod || '-' }}
          </td>

          <td class="text-center align-middle">
            <v-row align="center" justify="center" no-gutters>
              <v-col cols="auto">
                <v-btn size="small" @click="emitter('showInfo', item)" variant="outlined"
                  v-if="item.information !== null || item.discount !== null">
                  Info
                </v-btn>
              </v-col>
              <v-col cols="auto">
                <v-menu>
                  <template v-slot:activator="{ props }">
                    <v-btn size="small" variant="outlined" v-bind="props" append-icon="mdi-chevron-down">
                      Acciones
                    </v-btn>
                  </template>
                  <v-list>
                    <v-list-item :disabled="item.bill == null || loading" @click="emitter('attach-retention', item)">
                      <v-list-item-title>Adjuntar Retención</v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="emitter('delete', item)" :disabled="!canAction('delete-payroll') || loading">
                      <v-list-item-title>Eliminar</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
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

import { months, payrollStatus } from '@/data/constants.json'
import Amount from '@/components/shared/Amount.vue'

import { useAuthorizer } from '@/composables/authorizer'

const { canAction } = useAuthorizer()

const emitter = defineEmits(['delete', 'showInfo', 'changeStatus', 'attach-retention'])

const getColor = (status) => {
  const { color } = payrollStatus.find((item) => item.value === status)
  return `#${color}`
}

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
  const monthObject = months.find((item) => item.value === month)

  if (!monthObject) {
    console.log(month)
    return ''
  }

  return monthObject.key
}
</script>
