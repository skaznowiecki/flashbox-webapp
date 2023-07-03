<template>
  <AppModernLayout>
    <VRow class="mt-1">
      <CreditNoteFilter @change="filter" :tags="tags" />
      <CreditNoteList :creditNotes="creditNotes" :pages="pages" :loading="loading" />
      <Pagination :pages="pages" @changePage="changePage" />
    </VRow>
  </AppModernLayout>
</template>
<script setup>
import AppModernLayout from '@/layouts/AppModernLayout.vue'
import CreditNoteList from '@/components/credit-note/CreditNoteList.vue'
import CreditNoteFilter from '@/components/credit-note/CreditNoteFilter.vue'

import { API } from 'aws-amplify'
import { onMounted, ref } from 'vue'
import Pagination from '@/components/shared/Pagination.vue'

let creditNotes = ref([])
let pages = ref(1)
let currentPage = 1
let listFilters = {}

let loading = ref(false)

let tags = ref([])

const fetchTags = async () => {
  tags.value = await API.get('api', '/suppliers/tags')
}

const fetchCreditNotes = async (filters) => {
  const params = {
    queryStringParameters: {
      ...filters,
      page: currentPage
    }
  }
  const response = await API.get('api', '/invoices/credit-notes/search', params)
  creditNotes.value = response.data
  pages.value = Number(response.pages)
  currentPage = Number(response.currentPage)
}

const filter = async (params) => {
  listFilters = params
  fetchCreditNotes(params)
}

const changePage = (page) => {
  currentPage = page
  fetchCreditNotes(listFilters)
}

onMounted(() => {
  Promise.all([fetchTags(), fetchCreditNotes()])
})
</script>
