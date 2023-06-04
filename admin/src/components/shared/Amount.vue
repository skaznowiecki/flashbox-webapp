<template>
  <span v-if="isActive" :class="color" :title="title">${{ amount }}</span>
  <span v-else>{{ emptyMessage }}</span>
</template>

<script setup>
import { computed } from 'vue'
import { POSITIVE_PERCENTAGE_THRESHOLD, NEGATIVE_PERCENTAGE_THRESHOLD } from '@/data/constants.json'

const props = defineProps({
  type: {
    type: String,
    required: true
  },
  bill: {
    type: Object,
    required: false
  },
  payroll: {
    type: Object,
    required: false
  }
})

const isActive = computed(() => {
  return props.bill !== null && props.payroll !== null
})

const emptyMessage = computed(() => {
  if (props.bill === null) {
    return 'S/F'
  }
  return 'S/L'
})

const amount = computed(() => {
  if (props.type === 'bill') {
    return props.bill.total
  }
  return props.payroll.amount
})

const color = computed(() => {
  const [match] = check.value
  if (match) {
    return 'text-green'
  }
  return 'text-red'
})

const title = computed(() => {
  const [match, message] = check.value
  if (match) {
    return 'Coincide'
  }
  return message
})

const check = computed(() => {
  const payrollAmount = Number(props.payroll.amount)
  const payrollWithTax = payrollAmount * 1.21

  const billAmount = Number(props.bill.total)

  if (billAmount === payrollAmount) {
    return [true, null]
  }

  if (billAmount === payrollWithTax) {
    return [true, null]
  }

  const matchWithoutTax = checkThreshold(billAmount, payrollAmount)
  const matchWithTax = checkThreshold(billAmount, payrollAmount)

  if (matchWithoutTax || matchWithTax) {
    return [true, null]
  }

  return [false, 'El monto de la factura es diferente al de la liquidacion']
})

const checkThreshold = (value, expectedValue) => {
  const diff = value - expectedValue
  const percentage = diff / value

  if (percentage < 0) {
    if (Math.abs(percentage) <= NEGATIVE_PERCENTAGE_THRESHOLD) {
      return true
    } else {
      return false
    }
  } else {
    if (percentage <= POSITIVE_PERCENTAGE_THRESHOLD) {
      return true
    } else {
      return false
    }
  }
}
</script>
