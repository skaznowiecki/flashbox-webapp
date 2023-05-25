<template>
  <AppModernLayout>
    <VRow class="mt-1">
      <SupplierFilter @change="filter" :tags="tags" :filterByTag="filters.withTag" />
      <SupplierAction
        :supplierWithOutTags="supplierWithOutTags"
        @withTags="withTags"
        @openListTags="openListTags"
        @openAddTag="openAddTag"
        @openImport="openImport"
      />
      <SupplierList :suppliers="suppliers" @editTags="editSupplierTags" :tags="tags" />
      <Pagination :pages="pages" @changePage="changePage" />

      <VDialog v-model="supplierTagForm" persistent width="1024">
        <SupplierTagForm :loading="loading" @submit="createSupplierTag" @close="closeSupplierTag" />
      </VDialog>

      <VDialog v-model="supplierTagList" persistent width="1024">
        <SupplierTagList
          :loading="loading"
          :tags="tags"
          @close="closeSupplierTagList"
          @delete="deleteSupplierTag"
        />
      </VDialog>
      <VDialog v-model="supplierTagAssignForm" persistent width="1024">
        <SupplierTagAssignForm
          :loading="loading"
          :tags="tags"
          :supplier="supplierSelected"
          @submit="updateSupplierTags"
          @close="closeSupplierTagAssignForm"
          height="300"
        />
      </VDialog>

      <VDialog v-model="supplierImportForm" persistent width="700">
        <SupplierImportForm
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
import { ref, onMounted, reactive, watch } from 'vue'

import AppModernLayout from '@/layouts/AppModernLayout.vue'
import SupplierList from '@/components/supplier/SupplierList.vue'
import SupplierFilter from '@/components/supplier/SupplierFilter.vue'
import SupplierAction from '@/components/supplier/SupplierAction.vue'
import Pagination from '@/components/shared/Pagination.vue'
import SupplierTagForm from '../components/supplier/SupplierTagForm.vue'
import SupplierTagList from '../components/supplier/SupplierTagList.vue'
import SupplierTagAssignForm from '../components/supplier/SupplierTagAssignForm.vue'
import SupplierImportForm from '../components/supplier/SupplierImportForm.vue'

let loading = ref(false)

let suppliers = ref([])
let pages = ref(1)
let filters = reactive({
  page: 1,
  withTag: 1
})

const fetchSuppliers = async () => {
  const params = {
    queryStringParameters: {
      ...filters
    }
  }
  const response = await API.get('api', '/suppliers/search', params)
  suppliers.value = response.data.map((supplier) => ({
    ...supplier,
    tagIds: (supplier.tags || []).map((tag) => tag.id)
  }))
  pages.value = response.pages
}

const changePage = (page) => {
  filters.page = page
  fetchSuppliers()
}

const filter = async (params) => {
  filters = {
    ...params,
    withTag: filters.withTag,
    page: 1
  }
  fetchSuppliers()
}

let tags = ref([])
let supplierWithOutTags = ref(0)

const fetchSupplierTagCount = async () => {
  const { withoutTags } = await API.get('api', '/suppliers/tags/count')
  supplierWithOutTags.value = withoutTags
}

const withTags = (value) => {
  filters.withTag = Number(value)
  fetchSuppliers()
}

const fetchTags = async () => {
  tags.value = await API.get('api', '/suppliers/tags')
}

// SUPPLIER TAG

let supplierTagForm = ref(false)

const openAddTag = () => {
  supplierTagForm.value = true
}

const closeSupplierTag = (value) => {
  supplierTagForm.value = false
}

const createSupplierTag = async (attrs) => {
  loading.value = true
  const tag = await API.post('api', '/suppliers/tags', {
    body: attrs
  })
  tags.value.push({ ...tag, count: 0 })
  supplierTagForm.value = false
  loading.value = false
}

// SUPPLIER TAG LIST

let supplierTagList = ref(false)

const openListTags = () => {
  supplierTagList.value = true
}

const closeSupplierTagList = () => {
  supplierTagList.value = false
}

const deleteSupplierTag = async (id) => {
  try {
    loading.value = true
    await API.del('api', `/suppliers/tags/${id}`)
    tags.value = tags.value.filter((tag) => tag.id !== id)
  } catch (error) {
    alert(error.message)
  } finally {
    loading.value = false
  }
}

// SUPPLIER TAG ASSIGN

let supplierTagAssignForm = ref(false)
let supplierSelected = reactive({})

const closeSupplierTagAssignForm = () => {
  supplierTagAssignForm.value = false
}

const editSupplierTags = (supplier) => {
  supplierSelected = supplier
  supplierTagAssignForm.value = true
}

const updateSupplierTags = async ({ tags }) => {
  loading.value = true

  await API.put('api', `/suppliers/${supplierSelected.id}`, {
    body: {
      tagIds: tags
    }
  })

  loading.value = false
  supplierTagAssignForm.value = false

  Promise.all([fetchSuppliers(), fetchSupplierTagCount()])
}

// IMPORT SUPPLIER
let supplierImportForm = ref(false)

const openImport = () => {
  supplierImportForm.value = true
}

const submitImportFile = async ({ file }) => {
  loading.value = true

  const { formData, uploadUrl } = await API.get('api', `/suppliers/upload`)

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
  supplierImportForm.value = false

  setTimeout(() => {
    fetchSuppliers()
  }, 2500)
}

const closeImportForm = () => {
  supplierImportForm.value = false
}

// DOWNLOAD EXAMPLE

const downloadExample = async () => {
  loading.value = true
  const { url } = await API.get('api', `/suppliers/download/example`)

  window.location.href = url
  loading.value = false
}

onMounted(() => {
  Promise.all([fetchSuppliers(), fetchTags(), fetchSupplierTagCount()])
})
</script>
