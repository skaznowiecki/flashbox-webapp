<template>
  <v-card>
    <v-card-title>
      <span class="text-h6">Descripcion de la factura</span>
    </v-card-title>
    <v-card-text>
      <v-container>
        <v-row>
          <v-textarea label="Descripcion" :disabled="true" :model-value="description"></v-textarea>
        </v-row>
      </v-container>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>

      <v-btn class="me-4" variant="outlined" type="button" @click="emitter('close')"> Cerrar</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { computed } from 'vue'

const emitter = defineEmits(['close'])

const props = defineProps({
  description: {
    type: String,
    default: false
  }
})

const description = computed(() => {
  return props.description
})
</script>
