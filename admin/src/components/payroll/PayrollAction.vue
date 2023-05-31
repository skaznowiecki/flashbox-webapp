<template>
  <v-col cols="12" md="12">
    <v-row justify="end">
      <v-col cols="auto">
        <v-btn
          prepend-icon="mdi-file-import"
          variant="outlined"
          @click="emitter('openImport')"
          :loading="loading"
          :disabled="!canAction('import-payroll')"
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

import { useAuthorizer } from '@/composables/authorizer'

const { canAction } = useAuthorizer()

defineProps({
  loading: {
    type: Boolean,
    default: false
  }
})
</script>
