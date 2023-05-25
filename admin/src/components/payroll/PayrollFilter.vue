<template>
  <v-col cols="12">
    <v-row>
      <v-col cols="12" md="3">
        <v-text-field v-model="filters.name" label="Razon social" variant="outlined"></v-text-field>
      </v-col>

      <v-col cols="12" md="3">
        <v-text-field
          v-model="filters.idNumber"
          label="CUIT/CUIL"
          variant="outlined"
        ></v-text-field>
      </v-col>

      <v-col cols="12" md="3">
        <v-select
          v-model="filters.businessId"
          :items="companies"
          label="Empresa"
          item-title="key"
          item-value="value"
          variant="outlined"
        ></v-select>
      </v-col>

      <v-col cols="12" md="3">
        <v-select
          v-model="filters.month"
          :items="months"
          label="Mes"
          item-title="key"
          item-value="value"
          variant="outlined"
        ></v-select>
      </v-col>

      <v-col cols="12" md="3">
        <v-text-field
          v-model="filters.year"
          label="Año"
          type="number"
          variant="outlined"
        ></v-text-field>
      </v-col>

      <v-col cols="12" md="3">
        <v-text-field
          v-model="filters.detail"
          label="Detalle"
          type="text"
          variant="outlined"
        ></v-text-field>
      </v-col>

      <v-col cols="12" md="3">
        <v-select
          v-model="filters.tags"
          :items="tags"
          label="Elegir tag"
          item-title="name"
          item-value="id"
          multiple
          persistent-hint
          variant="outlined"
        ></v-select>
      </v-col>

      <v-col cols="12" md="3">
        <v-select
          v-model="filters.status"
          :items="payrollStatus"
          label="Estado"
          item-title="key"
          item-value="value"
          variant="outlined"
        ></v-select>
      </v-col>
    </v-row>
  </v-col>
</template>

<script setup>
import { watch, reactive } from 'vue'

import { months, companies, payrollStatus } from '@/data/constants.json'

defineProps({
  tags: {
    type: Array,
    required: true
  }
})

const filters = reactive({
  month: '',
  year: '',
  detail: '',
  idNumber: '',
  tags: [],
  name: '',
  businessId: '',
  status: ''
})

const emitter = defineEmits(['change'])

watch(filters, (newFilters) => {
  const filters = {}
  Object.keys(newFilters).forEach((key) => {
    if (key === 'tags') {
      if (newFilters['tags'].length > 0) {
        filters[key] = newFilters[key].join(',')
      }
    } else if (newFilters[key] !== '') {
      filters[key] = newFilters[key]
    }
  })
  emitter('change', filters)
})
</script>
