<template>
  <AppModernLayout>
    <VRow class="mt-1">
      <PayrollFilter :tags="tags" @change="filter" />
      <PayrollAction @openImport="openImport" @download="downloadExcel" :loading="loading" />
      <PayrollList :payrolls="payrolls" :pages="pages" @changeStatus="changeStatus" @delete="deletePayroll"
        @showInfo="showInfo" @attach-retention="attachRetention" :loading="loading" />
      <Pagination :pages="pages" @changePage="changePage" />

      <VDialog v-model="importForm" persistent width="700">
        <PayrollImportForm :loading="loading" @download="downloadExample" @submit="submitImportFile"
          @close="closeImportForm" />
      </VDialog>

      <VDialog v-model="showInfoForm" persistent width="700">
        <PayrollShowInfo :loading="loading" :information="information" :discount="discount" @close="closeShowInfo" />
      </VDialog>

      <VDialog v-model="changeStatusForm" persistent width="700">
        <PayrollChangeStatus :loading="loading" :status="status" @close="closeChangeStatus"
          @submit="submitChangeStatus" />
      </VDialog>

      <VDialog v-model="attachRetentionForm" persistent width="700">
        <PayrollAttachRetention v-if="selectedPayroll" :loading="loading" :payroll="selectedPayroll"
          @close="closeAttachRetention" @submit="submitAttachRetention" />
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
import PayrollShowInfo from '@/components/payroll/PayrollShowInfo.vue'
import PayrollChangeStatus from '../components/payroll/PayrollChangeStatus.vue'
import PayrollAttachRetention from '@/components/payroll/PayrollAttachRetention.vue'
import { useApiV2 } from '@/composables/useApiV2'
import { useFeatureFlags } from '@/composables/feature-flags'

const { get, post } = useApiV2()
const { isFeatureFlagEnabled } = useFeatureFlags()

let payrolls = ref([])
let pages = ref(1)
let currentPage = 1
let filters = {}
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

const fetchPayrolls = async () => {
  const params = {
    queryStringParameters: {
      ...filters,
      page: currentPage
    }
  }
  let response = null;

  if (isFeatureFlagEnabled('PAYROLL', 'SEARCH')) {
    console.log('fetching payrolls v2')
    response = await get('/payrolls', { params: { ...params.queryStringParameters } })
  } else {
    console.log('fetching payrolls v1')
    response = await API.get('api', '/payrolls/search', params)
  }

  payrolls.value = response.data
  pages.value = Number(response.pages)
  currentPage = Number(response.currentPage)
}

const filter = async (params) => {
  filters = {
    ...params
  }
  currentPage = 1
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

// change status

let changeStatusForm = ref(false)
let status = ref(null)
let payrollId = null

const changeStatus = (payroll) => {
  payrollId = payroll.id
  changeStatusForm.value = true
  status.value = payroll.status
}

const closeChangeStatus = () => {
  changeStatusForm.value = false
}

const submitChangeStatus = async (status) => {
  loading.value = true
  await API.put('api', `/payrolls/${payrollId}`, { body: { status } })
  loading.value = false

  changeStatusForm.value = false
  fetchPayrolls()
}

// attach retention

let attachRetentionForm = ref(false)
let selectedPayroll = ref(null)

const attachRetention = (payroll) => {
  selectedPayroll.value = payroll
  attachRetentionForm.value = true
}

const closeAttachRetention = () => {
  attachRetentionForm.value = false
  selectedPayroll.value = null
}

const submitAttachRetention = async ({ file, payrollId }) => {
  loading.value = true

  try {
    // Get upload URL for tax withholding
    const { fileKey, uploadUrl } = await post(`/payrolls/${payrollId}/tax-retentions/upload`, {
      filename: file.name,
      contentType: file.type
    })

    // Upload the file directly using PUT (required for presigned URLs from PutObjectCommand)
    const uploadResponse = await fetch(uploadUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type
      }
    })

    // Only proceed if upload was successful
    if (uploadResponse.ok) {
      await post(`/payrolls/${payrollId}/tax-retentions`, {
        fileKey: fileKey
      })
    } else {
      throw new Error(`File upload failed with status: ${uploadResponse.status}`)
    }

    loading.value = false
    attachRetentionForm.value = false
    selectedPayroll.value = null

    // Refresh the payrolls list to show updated data
    setTimeout(() => {
      fetchPayrolls()
    }, 1000)
  } catch (error) {
    console.error('Error uploading tax withholding:', error)
    loading.value = false
  }
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
