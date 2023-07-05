<template>
  <v-card>
    <v-card-title>
      <span class="text-h6">Information de la liquidacion</span>
    </v-card-title>
    <v-card-text>
      <v-container>
        <v-row v-if="information">
          <v-textarea label="Informacion" :disabled="true" :model-value="information"></v-textarea>
        </v-row>

        <v-row v-if="discount">
          <v-textarea label="Descuento" :disabled="true" :model-value="discount"></v-textarea>
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
  information: {
    type: String,
    default: false
  },
  discount: {
    type: String,
    default: false
  }
})

const information = computed(() => {
  return props.information
})

const discount = computed(() => {
  return props.discount
})
</script>
