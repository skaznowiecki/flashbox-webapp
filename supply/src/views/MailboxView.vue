<template>
  <v-sheet width="400" class="mx-auto">
    <div class="d-flex align-center justify-center" style="height: 100vh">
      <v-card class="mx-auto" width="400" prepend-icon="mdi-receipt-text">
        <template v-slot:title> Registrar factura </template>

        <v-card-text>
          <v-col cols="auto">
            <UploadButton @attached="uploadFile" :status="status" />
          </v-col>

          <v-col cols="auto">
            <Info :status="status" />
          </v-col>

          <v-col cols="auto" v-if="status === 'completed' && success === false">
            <InvoiceForm :invoice="invoice" :loading="loading" @submit="createInvoice" />
          </v-col>

          <v-col cols="auto" v-if="success === true">
            <Success />
          </v-col>
        </v-card-text>
      </v-card>
    </div>
  </v-sheet>
</template>
<script setup>
import { API } from 'aws-amplify'

import UploadButton from '@/components/mailbox/UploadButton.vue'
import Info from '@/components/mailbox/Info.vue'
import Success from '@/components/mailbox/Success.vue'

import InvoiceForm from '@/components/mailbox/InvoiceForm.vue'

import { reactive, ref } from 'vue'

let documentId = null
let invoiceKey = null
let internalId = null

let status = ref('empty')

let success = ref(false)
let loading = ref(false)

let invoice = reactive({
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
  total: null
})

const uploadFile = async (file) => {
  status.value = 'pending'

  const { formData, uploadUrl, key } = await API.get('api', `/invoices/upload`)
  const form = new FormData()

  invoiceKey = key

  Object.keys(formData).forEach((key) => {
    form.append(key, formData[key])
  })

  form.append('file', file)

  await fetch(uploadUrl, {
    method: 'POST',
    body: form
  })

  const response = await API.post('api', '/invoices/mailbox', {
    body: {
      key,
      provider: 'MAILBOX'
    }
  })

  documentId = response.id

  checkDocumentData()
}

const createInvoice = async (invoice) => {
  loading.value = true

  await API.post('api', '/invoices/mailbox/store', {
    body: {
      data: invoice,
      key: invoiceKey,
      internalId
    }
  })

  loading.value = false
  success.value = true
}

const checkDocumentData = async () => {
  setTimeout(async () => {
    const response = await API.get('api', `/documents/${documentId}`)
    status.value = response.status

    internalId = response.pk

    if (response.status === 'completed') {
      Object.assign(invoice, response.result)
    }

    if (response.status !== 'completed') {
      checkDocumentData()
    }
  }, 2500)
}
</script>
