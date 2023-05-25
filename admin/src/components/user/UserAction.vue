<template>
  <v-col cols="12" md="12">
    <div align="end" justify="end">
      <v-btn
        prepend-icon="mdi-account-plus"
        variant="outlined"
        size="small"
        @click="emitter('createUser')"
      >
        Nuevo usuario
      </v-btn>
    </div>
  </v-col>
</template>

<script setup>
import { useRouter } from 'vue-router'

const emitter = defineEmits(['createUser'])
</script>
