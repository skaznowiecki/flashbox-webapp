<template>
  <div class="d-flex align-center justify-center mt-10">
    <v-card class="mx-auto" width="800" v-if="exists" :loading="loading">
      <v-card-title class="text-center text-h4"> Liquidacion </v-card-title>
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
  const year = new Date().getFullYear()
  const month = new Date().getMonth() + 1

  return payrolls.value.filter((item) => {
    return item.year === year && item.month === month
  })
})

const historyPayroll = computed(() => {
  const year = new Date().getFullYear()
  const month = new Date().getMonth() + 1

  return payrolls.value.filter((item) => {
    return item.year !== year || item.month !== month
  })
})

const uploadFile = async ({ file, payroll }) => {
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

  await API.post('api', '/invoices/', {
    body: {
      key,
      provider: 'SUPPLIER',
      metadata: {
        payrollId: payroll.id
      }
    }
  })

  const index = payrolls.value.findIndex((item) => item.id === payroll.id)

  payrolls.value[index].status = 'PROCESANDO'

  loading.value = false

  setTimeout(() => {
    fetchPayroll(route.params.id)
  }, 10000)
}

onMounted(() => {
  fetchPayroll(route.params.id)
})
</script>
