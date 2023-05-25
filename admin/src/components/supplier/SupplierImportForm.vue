<template>
  <v-card>
    <v-card-title>
      <span class="text-h6">Importar una actualizacion de proveedores</span>
    </v-card-title>
    <v-card-text>
      <v-container>
        <v-form fast-fail ref="supplierImportForm">
          <VRow>
            <VCol cols="12">
              <v-btn
                block
                prepend-icon="mdi-microsoft-excel"
                variant="outlined"
                @click="emitter('download')"
                :loading="loading"
                >Descargar ejemplo</v-btn
              >
            </VCol>
          </VRow>
          <VRow>
            <VCol cols="12">
              <v-text-field
                label="Archivo"
                type="file"
                @change="onFileChanged($event)"
                :rules="fileValidation"
              ></v-text-field>
            </VCol>
          </VRow>
        </v-form>
      </v-container>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn class="me-4" variant="outlined" type="button" @click="create" :loading="loading">
        Importar
      </v-btn>
      <v-btn class="me-4" variant="outlined" type="button" @click="emitter('close')"> Cerrar</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { ref } from 'vue'

const emitter = defineEmits(['submit', 'close', 'download'])

const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  }
})

const supplierImportForm = ref(null)
const file = ref(null)

const onFileChanged = ($event) => {
  const target = $event.target
  if (target && target.files) {
    file.value = target.files[0]
  }
}

const fileValidation = [
  (value) => {
    if (value) return true
    return 'Archivo con las liquidaciones es requerido.'
  }
]

const create = async () => {
  const { valid } = await supplierImportForm.value.validate()
  if (!valid) return

  emitter('submit', { file: file.value })

  file.value = null
}
</script>
