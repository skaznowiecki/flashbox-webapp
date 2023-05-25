<template>
  <div>
    <VRow>
      <VCol cols="12">
        <p class="text-h6">Datos bancarios</p>
        <br />
        <v-divider class="border-opacity-50"></v-divider>
      </VCol>
    </VRow>
    <VRow>
      <VCol cols="6">
        <v-text-field label="CBU" variant="outlined" v-model="supplier.accountBank"></v-text-field>
      </VCol>
    </VRow>
  </div>
</template>

<script setup>
import { reactive } from 'vue'

const props = defineProps({
  supplier: {
    type: Object,
    default: () => ({})
  }
})

let supplier = reactive(props.supplier)
</script>
