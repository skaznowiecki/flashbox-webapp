<template>
  <div class="d-flex align-center justify-center mt-10">
    <v-card class="mx-auto" width="800" v-if="exists" :loading="loading">
      <v-card-title class="text-center justify-center py-6">
        <h2 class="font-weight-bold text-h3 text-basil">Recepción de facturas</h2>
      </v-card-title>
      <v-divider class="mb-5 mt-5"></v-divider>

      <v-tabs v-model="tab" color="basil" grow>
        <v-tab value="current" text="Facturas actuales"> </v-tab>
        <v-tab value="historical" text="Historial de facturas"></v-tab>
      </v-tabs>

      <v-tabs-window v-model="tab">
        <v-tabs-window-item value="current" key="current">
          <v-card color="basil" flat>
            <v-card-text>
              <PayrollList :payrolls="currentPayroll" @uploadFile="uploadFile" @showInfo="showInfo"
                :loading="loading" />
            </v-card-text>
          </v-card>
        </v-tabs-window-item>

        <v-tabs-window-item value="historical" key="current">
          <v-card color="basil" flat>
            <v-card-text>
              <PayrollList :payrolls="historyPayroll" @uploadFile="uploadFile" @showInfo="showInfo"
                :loading="loading" />
            </v-card-text>
          </v-card>
        </v-tabs-window-item>
      </v-tabs-window>
    </v-card>
    <PayrollNotFound v-else />

    <VDialog v-model="showInfoForm" persistent width="700">
      <PayrollShowInfo :loading="loading" :information="information" :discount="discount" @close="closeShowInfo" />
    </VDialog>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { onMounted, ref, computed } from 'vue'
import { API } from 'aws-amplify'
import PayrollList from '@/components/PayrollList.vue'
import PayrollNotFound from '@/components/PayrollNotFound.vue'
import PayrollShowInfo from '@/components/PayrollShowInfo.vue'
import { getCurrentAndPreviousMonths } from '@/utils/payroll'
import { useListSupplyPayrolls } from "@/composables/payroll"

const NUMBER_OF_MONTHS = 2
const route = useRoute()

const payrolls = ref([])

const tab = ref('current')

let exists = ref(true)
let loading = ref(true)

const fetchPayroll = async (id) => {
  try {

    payrolls.value = await useListSupplyPayrolls(id)
  } catch (error) {
    exists.value = false
  } finally {
    loading.value = false
  }
}

const currentPayroll = computed(() => {
  const dates = getCurrentAndPreviousMonths(NUMBER_OF_MONTHS)

  return payrolls.value.filter((item) => {
    return dates.some((date) => {
      return item.year === date[0] && item.month === date[1]
    })
  })
})

const historyPayroll = computed(() => {
  const dates = getCurrentAndPreviousMonths(NUMBER_OF_MONTHS)

  return payrolls.value.filter((item) => {
    return !dates.some((date) => {
      return item.year === date[0] && item.month === date[1]
    })
  })
})

const uploadFile = async ({ file, payroll, bill, isCreditNote }) => {
  if (!file) return

  if (file.type !== 'application/pdf') {
    alert('El archivo debe ser un PDF')
    return
  }

  loading.value = true

  const { formData, uploadUrl, key } = await API.get('api', `/invoices/upload`)
  const form = new FormData()

  Object.keys(formData).forEach((key) => {
    form.append(key, formData[key])
  })

  form.append('file', file)

  await fetch(uploadUrl, {
    method: 'POST',
    body: form
  })

  if (isCreditNote) {
    await uploadCreditNote(key, payroll, bill)
  } else {
    await uploadInvoice(payroll, key)
  }

  const index = payrolls.value.findIndex((item) => item.id === payroll.id)

  payrolls.value[index].status = 'PROCESANDO'

  loading.value = false

  setTimeout(() => {
    fetchPayroll(route.params.id)
  }, 10000)
}

const uploadInvoice = async (payroll, key) => {
  await API.post('api', '/invoices/', {
    body: {
      key,
      provider: 'SUPPLIER',
      metadata: {
        documentType: 'INVOICE',
        payrollId: payroll.id
      }
    }
  })
}

const uploadCreditNote = async (key, payroll, bill) => {
  await API.post('api', '/invoices/credit-notes', {
    body: {
      key,
      provider: 'SUPPLIER',
      metadata: {
        documentType: 'CREDIT_NOTE',
        payrollId: payroll.id,
        billId: bill.id
      }
    }
  })
}

// show info

let showInfoForm = ref(false)
let information = ref(null)
let discount = ref(null)

const showInfo = (payroll) => {
  showInfoForm.value = true
  information.value = payroll.information
  discount.value = payroll.discount
}

const closeShowInfo = () => {
  showInfoForm.value = false
}

onMounted(() => {
  fetchPayroll(route.params.id)
})
</script>
