<template>
  <AppModernLayout>
    <VRow class="mt-1">
      <InvoiceFilter @change="filter" :tags="tags" />
      <InvoiceAction @download="downloadExcel" :loading="downloadBtnLoading" />
      <InvoiceList
        :invoices="invoices"
        :pages="pages"
        @delete="deleteInvoice"
        @show="showDescription"
        :loading="loading"
      />
      <Pagination :pages="pages" @changePage="changePage" />

      <VDialog v-model="showDescriptionForm" persistent width="700">
        <InvoiceShowDescription :description="description" @close="closeShowDescription" />
      </VDialog>
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
import InvoiceShowDescription from '../components/invoice/InvoiceShowDescription.vue'

let invoices = ref([])
let pages = ref(1)
let currentPage = 1
let listFilters = {}

let loading = ref(false)

let tags = ref([])

const fetchTags = async () => {
  tags.value = await API.get('api', '/suppliers/tags')

  tags.value.push({
    id: -1,
    name: 'SIN TAG',
    color: '3F51B5',
    count: 0
  })
}

const fetchInvoices = async (filters) => {
  const params = {
    queryStringParameters: {
      ...filters,
      mailbox: 1,
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
  currentPage = 1
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
      mailbox: 1,
      ...listFilters
    }
  }
  const { url } = await API.get('api', '/invoices/download', params)
  downloadBtnLoading.value = false

  window.location.href = url
}

const deleteInvoice = async ({ id }) => {
  loading.value = true

  await API.del('api', `/invoices/${id}`)
  fetchInvoices(listFilters)

  loading.value = false
}

let showDescriptionForm = ref(false)
let description = ref('')
const closeShowDescription = () => {
  showDescriptionForm.value = false
}

const showDescription = (item) => {
  description.value = item.description
  showDescriptionForm.value = true
}

onMounted(() => {
  Promise.all([fetchTags(), fetchInvoices()])
})
</script>
