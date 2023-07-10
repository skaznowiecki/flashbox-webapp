<template>
  <AppModernLayout>
    <VRow class="mt-1">
      <CreditNoteFilter @change="filter" :tags="tags" />
      <CreditNoteList
        :creditNotes="creditNotes"
        :pages="pages"
        :loading="loading"
        @assign="assignCreditNote"
      />
      <Pagination :pages="pages" @changePage="changePage" />

      <VDialog v-model="assignCreditNoteForm" persistent width="700">
        <CreditNoteAssignForm
          :loading="loading"
          @submit="submitAssignCreditNote"
          @close="closeAssignCreditNote"
          :error="errorMessage"
        />
      </VDialog>
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
import CreditNoteAssignForm from '@/components/credit-note/CreditNoteAssignForm.vue'

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
  currentPage = 1
  fetchCreditNotes(params)
}

const changePage = (page) => {
  currentPage = page
  fetchCreditNotes(listFilters)
}

// ASSIGN CREDIT NOTE

let assignCreditNoteForm = ref(false)
let creditNoteToAssign = null
let errorMessage = ref(null)

const assignCreditNote = (creditNote) => {
  creditNoteToAssign = creditNote
  assignCreditNoteForm.value = true
}

const closeAssignCreditNote = () => {
  assignCreditNoteForm.value = false
  creditNoteToAssign = null
}

const submitAssignCreditNote = async ({ invoiceId }) => {
  try {
    loading.value = true

    await API.put('api', `/invoices/${invoiceId}/credit-note`, {
      body: {
        creditNoteId: creditNoteToAssign.id
      }
    })

    closeAssignCreditNote()
    fetchCreditNotes()
  } catch (error) {
    errorMessage.value = `No se pudo encontrar la factura con el ID ${invoiceId}`
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  Promise.all([fetchTags(), fetchCreditNotes()])
})
</script>
