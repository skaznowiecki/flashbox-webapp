<template>
  <div class="d-flex align-center justify-center mt-10">
    <v-card class="mx-auto" width="800" v-if="exists" :loading="loading">
      <v-card-title class="text-center text-h4"> Liquidación </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <PayrollFilter @update:toggle="updateToggle" />
        <PayrollList :payrolls="payrollToDisplay" @uploadFile="uploadFile" :loading="loading" />
      </v-card-text>
    </v-card>
    <PayrollNotFound v-else />
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { onMounted, ref, computed } from 'vue'
import { API } from 'aws-amplify'
import PayrollList from '@/components/PayrollList.vue'
import PayrollFilter from '@/components/PayrollFilter.vue'
import PayrollNotFound from '@/components/PayrollNotFound.vue'

const NUMBER_OF_MONTHS = 2
const route = useRoute()

const payrolls = ref([])

let filter = ref('current')

const updateToggle = (value) => {
  filter.value = value
}

let exists = ref(true)
let loading = ref(true)

const fetchPayroll = async (id) => {
  try {
    payrolls.value = await API.get('api', `/payrolls/supplier/${id}`)
  } catch (error) {
    exists.value = false
  } finally {
    loading.value = false
  }
}

const payrollToDisplay = computed(() => {
  if (filter.value === 'current') {
    return currentPayroll.value
  } else {
    return historyPayroll.value
  }
})

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

const getCurrentAndPreviousMonths = (numberOfMonths) => {
  const today = new Date()
  const previousMonths = []

  for (let i = 0; i < numberOfMonths; i++) {
    const previousMonth = new Date(today.getFullYear(), today.getMonth() - i, 1)
    previousMonths.push([previousMonth.getFullYear(), previousMonth.getMonth() + 1])
  }
  return previousMonths
}

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

onMounted(() => {
  fetchPayroll(route.params.id)
})
</script>
