<template>
  <div>
    <v-alert type="info" :text="text" variant="tonal" v-if="isVisible"></v-alert>
  </div>
</template>
<script setup>
import { computed } from 'vue'

const emitter = defineEmits(['attached'])

const props = defineProps({
  status: {
    type: String,
    required: true
  }
})

const status = computed(() => {
  return props.status
})

const isVisible = computed(() => {
  return status.value !== 'completed'
})

const text = computed(() => {
  if (status.value === 'empty') {
    return 'El archivo debe ser un PDF'
  } else if (['pending', 'processing'].includes(status.value)) {
    return `
    Puede demorar entre 40 y 60 segundos en procesarse.
    No cierre esta ventana, porque el proceso se cancelará.`
  }
})
</script>
