<template>
  <v-card>
    <v-card-title>
      <span class="text-h6">Nuevo tag</span>
    </v-card-title>
    <v-card-text>
      <v-container>
        <v-form fast-fail ref="supplierTagForm">
          <VRow>
            <VCol cols="6">
              <v-text-field
                v-model="tag.name"
                :rules="nameValidation"
                label="Nombre"
                variant="outlined"
              ></v-text-field>
            </VCol>
            <VCol cols="6">
              <v-select
                v-model="tag.color"
                :items="colors"
                label="Color"
                item-title="name"
                item-value="id"
                variant="outlined"
                :rules="colorValidation"
              ></v-select>
            </VCol>
          </VRow>
        </v-form>
      </v-container>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn class="me-4" variant="outlined" type="button" @click="create" :loading="loading">
        Crear
      </v-btn>
      <v-btn class="me-4" variant="outlined" type="button" @click="emitter('close')"> Cerrar</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { colors } from '@/data/constants.json'
const emitter = defineEmits(['submit', 'close'])

const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  }
})

const supplierTagForm = ref(null)

const nameValidation = [
  (value) => {
    if (value?.length >= 5) return true
    return 'Nombre debe tener al menos 5 caracteres.'
  }
]

const colorValidation = [
  (value) => {
    if (value) return true
    return 'El color es requerido.'
  }
]

const tag = reactive({})

const create = async () => {
  const { valid } = await supplierTagForm.value.validate()
  if (!valid) return

  emitter('submit', {
    color: tag.color,
    name: tag.name
  })
}
</script>
