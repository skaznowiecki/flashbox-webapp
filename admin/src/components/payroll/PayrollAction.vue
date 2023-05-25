<template>
  <v-col cols="12" md="12">
    <v-row justify="end">
      <v-col cols="auto">
        <v-btn
          prepend-icon="mdi-file-import"
          variant="outlined"
          @click="emitter('openImport')"
          :loading="loading"
        >
          Importar
        </v-btn>
      </v-col>
      <v-col cols="auto">
        <v-btn
          prepend-icon="mdi-microsoft-excel"
          variant="outlined"
          @click="emitter('download')"
          :loading="loading"
        >
          Descargar
        </v-btn>
      </v-col>
    </v-row>
  </v-col>
</template>

<script setup>
const emitter = defineEmits(['openImport', 'download'])

defineProps({
  loading: {
    type: Boolean,
    default: false
  }
})
</script>
