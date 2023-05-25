<template>
  <VRow justify="end">
    <v-col cols="auto">
      <v-btn variant="outlined" @click="emitter('submit')" :loading="loading"> Guardar </v-btn>
    </v-col>
  </VRow>
</template>

<script setup>
defineProps({
  loading: {
    type: Boolean,
    default: false
  }
})

const emitter = defineEmits(['submit'])
</script>
