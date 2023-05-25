<template>
  <VRow>
    <v-col cols="12">
      <v-table height="500px" fixed-header>
        <thead>
          <tr>
            <th class="text-left" width="20%">Fecha</th>
            <th class="text-left" width="10%">Monto</th>
            <th class="text-center" width="20%">Mensaje</th>
            <th class="text-center" width="40%">Accion</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in payrolls" :key="item.id" class="text-left">
            <td><PayrollListDate :payroll="item" /></td>
            <td>${{ item.amount }}</td>
            <td>{{ item.message ?? '' }}</td>
            <td>
              <PayrollListButton :payroll="item" @uploadFile="uploadFile" :loading="loading" />
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
const emitter = defineEmits(['uploadFile'])

const payrolls = computed(() => {
  return props.payrolls.sort((a, b) => {
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
