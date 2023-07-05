<template>
  <VCol cols="12">
    <v-row align="center" justify="center">
      <v-col cols="auto">
        <v-btn
          color="indigo"
          size="small"
          :disabled="prevToken.length === 0"
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
import { ref, computed } from 'vue'
const props = defineProps({
  nextToken: {
    type: String,
    required: false
  }
})

let currentToken = null
let prevToken = ref([])
let nextToken = computed(() => props.nextToken || null)

const emitter = defineEmits(['changePage'])

const clickPrevToken = () => {
  const token = prevToken.value.pop()
  currentToken = token

  emitter('changePage', { token })
}

const clickNextToken = () => {
  prevToken.value.push(currentToken)

  currentToken = nextToken.value

  emitter('changePage', { token: nextToken.value })
}
</script>
