<template>
  <span>{{ date }}</span>
</template>

<script setup>
import { months } from '@/data/constants.json'
import { computed } from 'vue'

const props = defineProps(['payroll'])

const payroll = computed(() => {
  return props.payroll
})

const date = computed(() => {
  const month = months.find((m) => m.value === payroll.value.month)

  if (payroll.value.detail) {
    return `${payroll.value.year} - ${month.key} - ${payroll.value.detail}`
  }

  return `${payroll.value.year} - ${month.key}`
})
</script>
