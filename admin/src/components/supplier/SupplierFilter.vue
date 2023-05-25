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
          v-model="filters.tags"
          :items="tags"
          label="Elegir tag"
          item-title="name"
          item-value="id"
          multiple
          persistent-hint
          variant="outlined"
          :disabled="filterByTag == 0"
        ></v-select>
      </v-col>
    </v-row>
  </v-col>
</template>

<script setup>
import { computed, watch, reactive } from 'vue'

const props = defineProps({
  tags: {
    type: Array,
    required: true
  },
  filterByTag: {
    type: Number,
    required: true
  }
})

const tags = computed(() => {
  return [...props.tags]
})

const filters = reactive({
  supplierName: '',
  supplierId: '',
  email: '',
  businessId: '',
  tags: []
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
