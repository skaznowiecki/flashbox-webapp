<template>
  <v-row align="center" justify="center">
    <v-col cols="auto" v-if="shouldShowAttachButton">
      <AppUploadButton
        size="small"
        :text="showAttachButtonText"
        color="blue"
        @attached="uploadFile"
        :disabled="disabled"
      />
    </v-col>
    <v-col cols="auto" v-if="shouldShowViewButton">
      <VBtn :href="payroll.bill.invoiceUrl" size="small" :disabled="disabled" target="_blank">
        Ver
      </VBtn>
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

const shouldShowAttachButton = computed(() => {
  return ['PENDIENTE', 'ADJUNTADA', 'ERROR', 'PROCESANDO'].includes(payroll.value.status)
})

const showAttachButtonText = computed(() => {
  return 'Adjuntar'
  // return payroll.value.status === 'PENDIENTE' && payroll.value.bill === null
  //   ? 'Adjuntar'
  //   : 'Re adjuntar'
})

const disabled = computed(() => {
  return payroll.value.status === 'PROCESANDO' || props.loading === true
})

const uploadFile = (file) => {
  emitter('uploadFile', {
    file,
    payroll: {
      ...payroll.value
    }
  })
}

const shouldShowViewButton = computed(() => {
  return payroll.value.bill !== null
})
</script>
