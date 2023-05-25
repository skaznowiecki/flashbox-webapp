<template>
  <AppModernLayout>
    <VRow class="mt-1">
      <PayrollFilter :tags="tags" @change="filter" />
      <PayrollAction @openImport="openImport" @download="downloadExcel" :loading="loading" />
      <PayrollList :payrolls="payrolls" :pages="pages" @delete="deletePayroll" :loading="loading" />
      <Pagination :pages="pages" @changePage="changePage" />

      <VDialog v-model="importForm" persistent width="700">
        <PayrollImportForm
          :loading="loading"
          @download="downloadExample"
          @submit="submitImportFile"
          @close="closeImportForm"
        />
      </VDialog>
    </VRow>
  </AppModernLayout>
</template>

<script setup>
import { API } from 'aws-amplify'

import AppModernLayout from '@/layouts/AppModernLayout.vue'
import PayrollList from '@/components/payroll/PayrollList.vue'
import Pagination from '@/components/shared/Pagination.vue'
import PayrollFilter from '@/components/payroll/PayrollFilter.vue'
import PayrollAction from '@/components/payroll/PayrollAction.vue'
import PayrollImportForm from '@/components/payroll/PayrollImportForm.vue'

import { ref, onMounted } from 'vue'

let payrolls = ref([])
let pages = ref(1)
let currentPage = 1
let filters = {}
let loading = ref(false)
let tags = ref([])

const fetchTags = async () => {
  tags.value = await API.get('api', '/suppliers/tags')
}

const fetchPayrolls = async () => {
  const params = {
    queryStringParameters: {
      ...filters,
      page: currentPage
    }
  }
  const response = await API.get('api', '/payrolls/search', params)
  payrolls.value = response.data
  pages.value = Number(response.pages)
  currentPage = Number(response.currentPage)
}

const filter = async (params) => {
  filters = {
    ...params
  }
  fetchPayrolls()
}

const changePage = (page) => {
  currentPage = page
  fetchPayrolls()
}

const downloadExcel = async () => {
  loading.value = true
  const params = {
    queryStringParameters: {
      ...filters
    }
  }
  const { url } = await API.get('api', '/payrolls/download', params)
  loading.value = false

  window.location.href = url
}

// import form

let importForm = ref(false)

const closeImportForm = () => {
  importForm.value = false
}

const openImport = () => {
  importForm.value = true
}

const submitImportFile = async ({ file }) => {
  loading.value = true

  const { formData, uploadUrl } = await API.get('api', `/payrolls/upload`)

  const form = new FormData()

  Object.keys(formData).forEach((key) => {
    form.append(key, formData[key])
  })

  form.append('file', file)
  await fetch(uploadUrl, {
    method: 'POST',
    body: form
  })

  loading.value = false
  importForm.value = false

  setTimeout(() => {
    fetchPayrolls()
  }, 1000)
}

const deletePayroll = async ({ id }) => {
  loading.value = true
  await API.del('api', `/payrolls/${id}`)

  loading.value = false

  payrolls.value = payrolls.value.filter((item) => item.id !== id)
}

// DOWNLOAD EXAMPLE

const downloadExample = async () => {
  loading.value = true
  const { url } = await API.get('api', `/payrolls/download/example`)

  window.location.href = url
  loading.value = false
}

onMounted(() => {
  Promise.all([fetchTags(), fetchPayrolls()])
})
</script>
