<template>
  <v-card>
    <v-card-title>
      <span class="text-h6">Asignar nota de credito</span>
    </v-card-title>
    <v-card-text>
      <v-container>
        <v-form fast-fail ref="form">
          <VRow v-if="error">
            <VCol cols="12">
              <v-alert :text="error" type="error" variant="outlined"></v-alert>
            </VCol>
          </VRow>
          <VRow>
            <VCol cols="12">
              <v-text-field
                label="ID de la nota de la factura"
                type="number"
                v-model="id"
                :rules="invoiceIdValidation"
              ></v-text-field>
            </VCol>
          </VRow>
        </v-form>
      </v-container>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn class="me-4" variant="outlined" type="button" @click="submit" :loading="loading">
        Asignar
      </v-btn>
      <v-btn class="me-4" variant="outlined" type="button" @click="emitter('close')"> Cerrar</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { ref } from 'vue'

const emitter = defineEmits(['submit', 'close'])

const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: false
  }
})

const form = ref(null)

const id = ref(null)

const invoiceIdValidation = [
  (value) => {
    if (value && !Number.isNaN(Number(value))) return true
    return 'El valor debe ser numerico.'
  }
]

const submit = async () => {
  const { valid } = await form.value.validate()
  if (!valid) return

  emitter('submit', { invoiceId: id.value })
}
</script>
