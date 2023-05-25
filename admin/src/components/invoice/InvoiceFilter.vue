<template>
  <v-col cols="12">
    <v-row>
      <v-col cols="12" md="3">
        <v-text-field
          v-model="filters.supplierName"
          label="Razon social"
          variant="outlined"
        ></v-text-field>
      </v-col>

      <v-col cols="12" md="3">
        <v-text-field
          v-model="filters.supplierId"
          label="CUIT/CUIL"
          variant="outlined"
        ></v-text-field>
      </v-col>

      <v-col cols="12" md="3">
        <v-text-field v-model="filters.email" label="Email" variant="outlined"></v-text-field>
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
        <v-text-field
          v-model="filters.from"
          label="Fecha desde"
          type="date"
          variant="outlined"
        ></v-text-field>
      </v-col>

      <v-col cols="12" md="3">
        <v-text-field
          v-model="filters.to"
          label="Fecha hasta"
          type="date"
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
    </v-row>
  </v-col>
</template>

<script setup>
import { watch } from 'vue'
import { reactive } from 'vue'

const companies = [
  { key: 'TODOS', value: '' },
  { key: 'INTERMEDIO S.R.L.', value: '33714517029' },
  { key: 'FLASHBOX', value: '30716842238' }
]

defineProps({
  tags: {
    type: Array,
    required: true
  }
})

const filters = reactive({
  supplierName: '',
  supplierId: '',
  email: '',
  businessId: '',
  from: '',
  to: ''
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
