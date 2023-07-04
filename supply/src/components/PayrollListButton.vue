<template>
  <v-row align="center" justify="center">
    <v-col cols="auto" v-if="shouldShowAttachButton">
      <AppUploadButton
        size="small"
        :text="attachButtonText"
        :color="attachButtonColor"
        @attached="uploadFile"
        :disabled="disabled"
      />
    </v-col>
  </v-row>
</template>

<script setup>
import { computed } from 'vue'
import AppUploadButton from '@/components/AppUploadButton.vue'

const emitter = defineEmits(['uploadFile'])

const props = defineProps(['payroll', 'loading'])

const payroll = computed(() => {
  return props.payroll
})

const loading = computed(() => {
  return props.loading
})

const shouldShowAttachButton = computed(() => {
  return ['PENDIENTE', 'ADJUNTADA', 'ERROR', 'PROCESANDO'].includes(payroll.value.status)
})

const attachButtonText = computed(() => {
  if (payroll.value.status === 'ERROR') {
    return 'Adjuntar NC'
  }

  if (payroll.value.status === 'ADJUNTADA') {
    return 'Re adjuntar FC'
  }

  if (payroll.value.status === 'PROCESANDO') {
    return 'Procesando'
  }

  return 'Adjuntar FC'
})

const attachButtonColor = computed(() => {
  if (payroll.value.status === 'ERROR') {
    return 'warning'
  }

  return 'blue'
})

const disabled = computed(() => {
  return ['PROCESANDO', 'PAGADA'].includes(payroll.value.status) || loading === true
})

const uploadFile = (file) => {
  emitter('uploadFile', {
    file,
    payroll: {
      ...payroll.value
    },
    bill: {
      ...payroll.value.bill
    },
    isCreditNote: payroll.value.status === 'ERROR'
  })
}
</script>
