<template>
  <v-tabs direction="vertical" v-model="tab">
    <v-tab value="general">
      <v-icon start> mdi-account-card </v-icon>
      General
    </v-tab>
    <v-tab value="bank">
      <v-icon start> mdi-bank </v-icon>
      Banco
    </v-tab>
    <v-tab value="invoice" :disabled="true">
      <v-icon start> mdi-receipt-text </v-icon>
      Facturas
    </v-tab>
  </v-tabs>
</template>

<script setup>
import { watch, ref } from 'vue'

const emitter = defineEmits(['changeTab'])

const props = defineProps({
  tab: {
    type: String,
    default: 'general'
  }
})

let tab = ref(props.tab)

watch(
  () => tab.value,
  (value) => {
    emitter('changeTab', value)
  }
)
</script>
