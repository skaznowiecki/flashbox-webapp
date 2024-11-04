<template>
  <VCol cols="12">
    <v-row align="center" justify="center">
      <v-col cols="auto">
        <v-btn
          color="indigo"
          size="small"
          :disabled="prevToken.length <= 0"
          @click="clickPrevToken"
        >
          Anterior
        </v-btn>
      </v-col>
      <v-col cols="auto">
        <v-btn color="indigo" size="small" :disabled="nextToken === null" @click="clickNextToken">
          Siguiente</v-btn
        >
      </v-col>
    </v-row>
  </VCol>
</template>

<script setup>
import { computed, ref } from 'vue'
const props = defineProps(['nextToken'])
let prevToken = ref([])
let currentToken = ref(null)
let nextToken = computed(() => props.nextToken || null)

const emitter = defineEmits(['changePage'])

const clickPrevToken = () => {
  currentToken.value = prevToken.value.pop()

  emitter('changePage', { token: currentToken.value })
}

const clickNextToken = () => {
  prevToken.value.push(currentToken.value)
  currentToken.value = nextToken.value

  emitter('changePage', { token: nextToken.value })
}
</script>
