<template>
  <div>
    <v-col cols="auto">
      <v-select
        label="Seleccione una liquidacion"
        :items="payrollSelectItems"
        variant="outlined"
        v-model="payrollId"
        v-if="payrollStatus === 'payroll_required'"
      ></v-select>

      <PDFUploadButton @attached="uploadFile" :status="status" v-if="showPDFUploadButton" />

      <VBtn :loading="true" block size="x-large" v-if="payrollStatus === 'pending'" />
    </v-col>

    <v-col cols="auto" v-if="showPDFUploadButton">
      <PDFUploadInfo :status="status" />
    </v-col>
  </div>
</template>

<script setup>
import PDFUploadButton from './PDFUploadButton.vue'
import PDFUploadInfo from './PDFUploadInfo.vue'

import { useListSupplyPayrolls } from '@/composables/payroll'
import { useUploadInvoice, useSendInvoice } from '@/composables/invoice'
import { computed, ref } from 'vue'
import { onMounted, defineEmits } from 'vue'
import { getCurrentAndPreviousPayrolls } from '@/utils/payroll'
import { getMonthName } from '@/utils/date'
import { useGetDocument } from '@/composables/document'
import { watch } from 'vue'
const emmiter = defineEmits(['document-uploaded', 'payroll-selected'])
const status = ref('empty')

const props = defineProps({
  supplierId: {
    type: String,
    required: true
  }
})

const payrolls = ref([])

const payrollStatus = ref('pending')

let documentId = null
let invoiceKey = null
let internalId = null

let payrollId = ref(null)

const uploadFile = async (file) => {
  status.value = 'pending'

  const key = await useUploadInvoice(file)

  invoiceKey = key

  documentId = await useSendInvoice(key)

  checkDocumentData()
}

const checkDocumentData = async () => {
  setTimeout(async () => {
    const response = await useGetDocument(documentId)
    status.value = response.status

    internalId = response.pk

    if (response.status === 'completed') {
      emmiter('document-uploaded', {
        internalId: internalId,
        invoiceKey: invoiceKey,
        invoice: response.result
      })
    }

    if (response.status !== 'completed') {
      checkDocumentData()
    }
  }, 2500)
}

const payrollSelectItems = computed(() => {
  return payrolls.value.map((item) => {
    return {
      title: `${getMonthName(item.month)}/${item.year} ($${item.amount})`,
      value: item.id,
      props: { subtitle: item.message }
    }
  })
})

const showPDFUploadButton = computed(() => {
  return payrollStatus.value === 'payroll_not_required' || payrollId.value !== null
})

watch(
  () => payrollId.value,
  (newValue) => {
    if (newValue !== null) {
      emmiter('payroll-selected', newValue)
    }
  }
)

onMounted(async () => {
  const response = await useListSupplyPayrolls(props.supplierId)

  payrolls.value = getCurrentAndPreviousPayrolls(response, 3).filter(
    (item) => item.status !== 'PAGADO'
  )

  if (payrolls.value.length > 0) {
    payrollStatus.value = 'payroll_required'
  } else {
    payrollStatus.value = 'payroll_not_required'
  }
})
</script>
