<template>
  <v-sheet width="400" class="mx-auto">
    <v-card class="mx-auto" max-width="344" variant="outlined">
      <v-card-title class="align-centen py-5"> Página de inicio </v-card-title>

      <v-card-text>
        <v-text-field
          type="number"
          variant="outlined"
          label="Ingrese su número de CUIT"
          v-model="id"
          hide-details
        ></v-text-field>
      </v-card-text>

      <v-card-actions>
        <v-btn
          variant="flat"
          color="blue"
          block
          @click="emitter('checkSupplier', id)"
          :disabled="!isActive"
          :loading="loading"
        >
          Consultar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-sheet>
</template>

<script setup>
import { ref, computed } from 'vue'

let id = ref(null)

const props = defineProps(['loading'])

let loading = computed(() => props.loading)

const emitter = defineEmits(['checkSupplier'])

const isActive = computed(() => {
  return id.value !== null && id.value.length > 5 && !loading.value
})
</script>
