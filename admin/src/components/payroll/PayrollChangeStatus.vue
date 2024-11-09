<template>
  <v-card>
    <v-card-title>
      <span class="text-h6">Cambiar estado</span>
    </v-card-title>
    <v-card-text>
      <v-container>
        <VCol cols="12">
          <v-select
            v-model="status"
            :items="statuses"
            label="Status"
            item-title="name"
            item-value="id"
            variant="outlined"
            :rules="statusValidation"
          ></v-select>
        </VCol>
      </v-container>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn class="me-4" variant="outlined" type="button" @click="submit" :loading="loading">
        Guardar
      </v-btn>
      <v-btn class="me-4" variant="outlined" type="button" @click="emitter('close')"> Cerrar</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { ref } from 'vue'

const emitter = defineEmits(['close', 'submit'])

const props = defineProps(['status', 'loading'])

const status = ref(props.status)

const statuses = [
  { id: 'PENDIENTE', name: 'PENDIENTE' },
  { id: 'PROCESANDO', name: 'PROCESANDO' },
  { id: 'ADJUNTADA', name: 'ADJUNTADA' },
  { id: 'NO_PAGADO', name: 'NO PAGADO' },
  { id: 'ERROR', name: 'ERROR' }
]

const statusValidation = [
  (value) => {
    if (value) return true
    return 'El status es requerido.'
  }
]

const submit = () => {
  emitter('submit', status.value)
}
</script>
