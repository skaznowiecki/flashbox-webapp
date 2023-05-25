<template>
  <AppModernLayout>
    <div>
      <SupplierForm :tags="tags" :supplier="supplier" @submit="submit" :loading="loading" />
    </div>
  </AppModernLayout>
</template>

<script setup>
import { API } from 'aws-amplify'
import { useRoute } from 'vue-router'
import AppModernLayout from '@/layouts/AppModernLayout.vue'

import { reactive, ref, onMounted } from 'vue'
import SupplierForm from '../components/supplier/SupplierForm.vue'

const router = useRoute()

let loading = ref(false)

const tags = ref([])

let supplier = reactive({
  name: '',
  email: '',
  businessId: '',
  address: '',
  idNumber: '',
  condition: '',
  startDate: '',
  tags: [],
  tagIds: [],
  accountBank: ''
})

const fetchSupplier = async () => {
  const { id } = router.params
  const data = await API.get('api', `/suppliers/${id}`)

  Object.keys(data).forEach((key) => {
    supplier[key] = data[key]
  })

  supplier.tagIds = data.tags.map((tag) => tag.id)
}

const fetchTags = async () => {
  tags.value = await API.get('api', '/suppliers/tags')
}

const submit = async (supplier) => {
  loading.value = true
  const { id } = router.params

  const params = {}

  Object.keys(supplier).forEach((key) => {
    if (
      supplier[key] !== '' &&
      supplier[key] !== null &&
      supplier[key] !== undefined &&
      key !== 'tags'
    ) {
      params[key] = supplier[key]
    }
  })
  await API.put('api', `/suppliers/${id}`, { body: params })
  loading.value = false
}

onMounted(() => {
  Promise.all([fetchTags(), fetchSupplier()])
})
</script>
