<template>
  <div>
    <v-btn
      size="x-large"
      prepend-icon="mdi-file-pdf-box"
      block
      @click="$refs.file.click()"
      :disabled="isDisabled"
      >{{ text }}</v-btn
    >
    <v-file-input
      label="File input"
      ref="file"
      v-show="false"
      accept="application/pdf"
      @change="onFileChanged($event)"
    ></v-file-input>
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

const isDisabled = computed(() => {
  return status.value !== 'empty'
})

const text = computed(() => {
  if (status.value === 'empty') {
    return 'Adjuntar PDF'
  } else if (['pending', 'processing'].includes(status.value)) {
    return 'Procesando...'
  } else if (status.value === 'completed') {
    return 'PDF adjuntado'
  }
})

const onFileChanged = ($event) => {
  const target = $event.target

  if (target && target.files) {
    if (target.files[0].type !== 'application/pdf') {
      alert('El archivo debe ser un PDF')
      return
    }

    emitter('attached', target.files[0])
  }
}
</script>
