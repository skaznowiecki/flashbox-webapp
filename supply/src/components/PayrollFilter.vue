<template>
  <VRow align="center" justify="center">
    <v-col cols="auto">
      <v-btn-toggle v-model="toggle" shaped mandatory>
        <v-btn value="current"> Actual </v-btn>
        <v-btn value="history"> Histórico </v-btn>
      </v-btn-toggle>
    </v-col>
  </VRow>
</template>

<script setup>
import { watch, ref } from 'vue'

let toggle = ref('current')

const emitter = defineEmits(['update:toggle'])

watch(toggle, (value) => {
  emitter('update:toggle', value)
})
</script>
