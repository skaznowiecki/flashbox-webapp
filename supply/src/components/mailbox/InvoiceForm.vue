<template>
  <v-col cols="auto">
    <v-form fast-fail ref="invoiceForm">
      <VRow>
        <VCol cols="12">
          <v-text-field type="number" v-model="invoice.businessId" label="CUIT / CUIL EMISOR" variant="outlined"
            :rules="bussinesIdValidation"></v-text-field>
        </VCol>

        <VCol cols="12">
          <v-text-field type="number" v-model="invoice.receiverBussinesId" label="CUIT / CUIL RECEPTOR"
            variant="outlined" :rules="receiverBussinesIdValidation"></v-text-field>
        </VCol>

        <VCol cols="12">
          <v-text-field type="number" v-model="invoice.total" label="Monto total" variant="outlined"
            :rules="amountValidation"></v-text-field>
        </VCol>

        <VCol cols="12">
          <VSelect :items="isCreditItems" v-model="invoice.isCreditNote" label="Es nota de credito ?" variant="outlined"
            :rules="isCreditValidation" />
        </VCol>

        <VCol cols="12">
          <v-textarea v-model="invoice.description" label="Descripción de la factura"
            :rules="descriptionValidation"></v-textarea>
        </VCol>
        <VCol cols="12">
          <v-btn variant="flat" color="blue" block :disabled="!submitEnable" :loading="loading" @click="submit">
            Enviar
          </v-btn>
        </VCol>
      </VRow>
    </v-form>
  </v-col>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'

const props = defineProps({
  invoice: {
    type: Object,
    required: true
  },
  loading: {
    type: Boolean,
    required: true
  }
})

const loading = computed(() => props.loading)

const emitter = defineEmits(['submit'])

const isCreditItems = [
  { title: 'Si', value: true },
  { title: 'No', value: false }
]

const isCreditValidation = [
  (value) => {
    if (value === '') {
      return 'Es requerido.'
    }

    return true
  }
]

const amountValidation = [
  (value) => {
    if (value !== '' && Number(value) > 0) return true
    return 'El monto debe ser mayor a 0.'
  }
]

const IDS = ['33714517029', '30716842238', '30718129113', '30718295706']

const receiverBussinesIdValidation = [
  (value) => {
    if (value === '') {
      return 'El CUIT es requerido.'
    }
    if (!IDS.includes(value)) {
      return 'El CUIT/CUIL no es valido.'
    }

    return true
  }
]

const bussinesIdValidation = [
  (value) => {
    if (value === '') {
      return 'El CUIT es requerido.'
    }

    if (value.length < 10) {
      return 'El CUIT debe tener 10 digitos como minimo'
    }

    return true
  }
]

const descriptionValidation = [
  (value) => {
    if (value === '') {
      return 'La descripción es requerida.'
    }

    if (value.length < 4) {
      return 'La descripción debe tener 4 caracteres como minimo'
    }

    return true
  }
]

const submitEnable = computed(() => {
  if (!invoice.businessId || invoice.length < 10) {
    return false
  }

  if (!invoice.receiverBussinesId || !IDS.includes(String(invoice.receiverBussinesId))) {
    return false
  }

  if (!invoice.total || Number(invoice.total) <= 0) {
    return false
  }

  if (!invoice.description || invoice.description.length < 4) {
    return false
  }

  return true
})

const invoiceForm = ref(null)
const invoice = reactive(props.invoice)

const submit = async () => {
  const { valid } = await invoiceForm.value.validate()
  if (!valid) {
    return
  }

  emitter('submit', { ...invoice })
}
</script>
