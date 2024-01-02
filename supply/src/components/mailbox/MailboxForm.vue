<template>
  <div v-if="!success">
    <UploadForm
      :supplier-id="supplierId"
      @payrollSelected="payrollSelected"
      @documentUploaded="documentUploaded"
    />

    <div v-if="isDocumentUploaded">
      <InvoiceForm :invoice="invoice" :loading="loading" @submit="createInvoice" />
    </div>
  </div>

  <v-col cols="auto" v-if="success">
    <v-alert type="success" text="Factura enviada exitosamente." variant="tonal"></v-alert>
  </v-col>
</template>

<script setup>
import { ref, reactive } from 'vue'
import InvoiceForm from './InvoiceForm.vue'
import UploadForm from './UploadForm.vue'
import { useCreateInvoice } from '@/composables/invoice'
import { useCreateCreditNote } from '@/composables/credit-note'

const invoice = reactive({
  billNumber: null,
  billedFrom: null,
  billedTo: null,
  businessActivityStart: null,
  businessAddress: null,
  businessId: null,
  businessName: null,
  conditionAgainstVAT: null,
  dateOfIssue: null,
  dueDate: null,
  isCreditNote: null,
  isInvoice: null,
  paymentType: null,
  pointOfSale: null,
  receiverBussinesConditionAgainstVAT: null,
  receiverBussinesId: null,
  subtotal: null,
  total: null,
  type: null
})

let success = ref(false)
let loading = ref(false)
let payrollId = null
let internalId = null
let invoiceKey = null

let isDocumentUploaded = ref(false)

defineProps({
  supplierId: {
    type: String,
    required: true
  }
})

const createInvoice = async () => {
  loading.value = true
  if (invoice.isCreditNote) {
    await useCreateCreditNote(invoice, invoiceKey, internalId, payrollId)
  } else {
    await useCreateInvoice(invoice, invoiceKey, internalId, payrollId)
  }
  success.value = true
  loading.value = false
}

const payrollSelected = (id) => {
  payrollId = id
}

const documentUploaded = (document) => {
  Object.assign(invoice, document.invoice)
  invoiceKey = document.invoiceKey
  internalId = document.internalId
  isDocumentUploaded.value = true
}
</script>
