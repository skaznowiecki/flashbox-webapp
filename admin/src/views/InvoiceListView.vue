<template>
  <AppModernLayout>
    <VRow class="mt-1">
      <InvoiceFilter @change="filter" :tags="tags" />
      <InvoiceAction @download="downloadExcel" :loading="downloadBtnLoading" />
      <InvoiceList :invoices="invoices" :pages="pages" />
      <Pagination :pages="pages" @changePage="changePage" />
    </VRow>
  </AppModernLayout>
</template>
<script setup>
import AppModernLayout from '@/layouts/AppModernLayout.vue'
import InvoiceList from '@/components/invoice/InvoiceList.vue'
import InvoiceFilter from '@/components/invoice/InvoiceFilter.vue'
import InvoiceAction from '@/components/invoice/InvoiceAction.vue'

import { API } from 'aws-amplify'
import { onMounted, ref } from 'vue'
import Pagination from '../components/shared/Pagination.vue'

let invoices = ref([])
let pages = ref(1)
let currentPage = 1
let listFilters = {}

let tags = ref([])

const fetchTags = async () => {
  tags.value = await API.get('api', '/suppliers/tags')
}

const fetchInvoices = async (filters) => {
  const params = {
    queryStringParameters: {
      ...filters,
      page: currentPage
    }
  }
  const response = await API.get('api', '/invoices/v2/search', params)
  invoices.value = response.data
  pages.value = Number(response.pages)
  currentPage = Number(response.currentPage)
}

const filter = async (params) => {
  listFilters = params
  fetchInvoices(params)
}

const changePage = (page) => {
  currentPage = page
  fetchInvoices(listFilters)
}

let downloadBtnLoading = ref(false)

const downloadExcel = async () => {
  downloadBtnLoading.value = true
  const params = {
    queryStringParameters: {
      ...listFilters
    }
  }
  const { url } = await API.get('api', '/invoices/download', params)
  downloadBtnLoading.value = false

  window.location.href = url
}

onMounted(() => {
  Promise.all([fetchTags(), fetchInvoices()])
})
</script>
