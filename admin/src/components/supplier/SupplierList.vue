<template>
  <VCol cols="12">
    <VTable class="elevation-1 rounded-lg">
      <thead class="text-uppercase text-subtitle-2">
        <tr>
          <th class="text-center" style="width: 25%">Nombre</th>
          <th class="text-center">CUIT/CUIL</th>
          <th class="text-center">Condicion</th>
          <th class="text-center">Periodo pago</th>

          <th class="text-center">Tags</th>
          <th class="text-center">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in suppliers" :key="item.id">
          <td class="text-center">{{ item.name }}</td>
          <td class="text-center">{{ item.idNumber }}</td>
          <td class="text-center">{{ item.condition }}</td>
          <td class="text-center">
            <span v-if="item.paymentPeriod"> +{{ item.paymentPeriod }} dias </span>
            <span v-else> - </span>
          </td>
          <td class="text-center">
            <SupplierTag :tags="item.tags" />
          </td>
          <td class="text-center">
            <v-row align="center" justify="center">
              <v-col cols="auto">
                <v-btn
                  size="small"
                  variant="outlined"
                  :to="{ name: 'SupplierEdit', params: { id: item.id } }"
                  :disabled="!canAction('edit-supplier')"
                >
                  Editar
                </v-btn>
              </v-col>
              <v-col cols="auto">
                <v-btn
                  size="small"
                  @click="emitter('editTags', item)"
                  variant="outlined"
                  :disabled="!canAction('edit-supplier-tags')"
                >
                  Tags
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
import { useAuthorizer } from '@/composables/authorizer'

const { canAction } = useAuthorizer()

const emitter = defineEmits(['editTags'])

const props = defineProps({
  suppliers: {
    type: Array,
    required: true
  },
  tags: {
    type: Array,
    required: true
  }
})

const suppliers = computed(() => {
  return props.suppliers
})
</script>
