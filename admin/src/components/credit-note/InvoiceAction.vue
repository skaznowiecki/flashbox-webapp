<template>
  <v-col cols="12" md="12">
    <div align="end" justify="end">
      <v-btn
        prepend-icon="mdi-microsoft-excel"
        variant="outlined"
        @click="emitter('download')"
        :loading="loading"
      >
        Descargar
      </v-btn>
    </div>
  </v-col>
</template>

<script setup>
const emitter = defineEmits(['download'])

defineProps({
  loading: {
    type: Boolean,
    default: false
  }
})
</script>
