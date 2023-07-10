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

          <th class="text-center">Links</th>
          <th class="text-center">Accion</th>
        </tr>
      </thead>
      <tbody class="text-body-2">
        <tr v-for="item in creditNotes" :key="item.pk">
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

          <td>
            <v-row align="center" justify="center">
              <v-col cols="auto">
                <VBtn :href="item.url" target="_blank" variant="outlined" size="small">NC</VBtn>
              </v-col>
              <v-col cols="auto">
                <VBtn
                  :href="item.bill ? item.bill.invoiceUrl : null"
                  target="_blank"
                  variant="outlined"
                  size="small"
                  :disabled="!item.bill"
                  >FC</VBtn
                >
              </v-col>
            </v-row>
          </td>
          <td class="text-center">
            <VBtn
              variant="outlined"
              size="small"
              :disabled="!canAssignCreditNote(item)"
              :loading="loading"
              @click="emitter('assign', item)"
              >Asignar</VBtn
            >
          </td>
        </tr>
      </tbody>
    </VTable>
  </VCol>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthorizer } from '@/composables/authorizer'

import SupplierTag from '@/components/shared/SupplierTag.vue'

const { canAction } = useAuthorizer()

const canAssignCreditNote = (item) => {
  return canAction('assign-credit-note')
}

const emitter = defineEmits(['assign'])

const props = defineProps({
  creditNotes: {
    type: Array,
    required: true
  },
  loading: {
    type: Boolean,
    required: true
  }
})
const creditNotes = computed(() => {
  return props.creditNotes
})
</script>
