<template>
  <v-col cols="12" md="12">
    <v-row>
      <v-col cols="4" md="42">
        <div align="start" justify="start">
          <v-btn-toggle v-model="tag" group @update:model-value="updateToggle($event)">
            <v-btn value="1"> Con tag </v-btn>
            <v-btn value="0"> Sin tag ({{ supplierWithOutTags }})</v-btn>
          </v-btn-toggle>
        </div>
      </v-col>
      <v-col cols="8" md="8">
        <v-row justify="end">
          <v-col cols="auto">
            <v-btn
              prepend-icon="mdi-file-import"
              variant="outlined"
              @click="emitter('openImport')"
              :disabled="!canAction('import-supplier')"
            >
              Importar
            </v-btn>
          </v-col>

          <v-col cols="auto">
            <v-btn
              prepend-icon="mdi-tag"
              variant="outlined"
              @click="emitter('openListTags')"
              :disabled="!canAction('list-tags')"
            >
              Ver tags
            </v-btn>
          </v-col>
          <v-col cols="auto">
            <v-btn
              prepend-icon="mdi-tag-plus"
              variant="outlined"
              @click="emitter('openAddTag')"
              :disabled="!canAction('create-tag')"
            >
              Agregar tag
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-col>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthorizer } from '@/composables/authorizer'

const { canAction } = useAuthorizer()

defineProps({
  supplierWithOutTags: {
    type: Number,
    required: true
  }
})

let tag = ref('1')

const emitter = defineEmits(['withTags', 'openListTags', 'openAddTag', 'openImport'])

const updateToggle = (value) => {
  if (value) {
    emitter('withTags', value)
  }

  if (!value) {
    tag.value = '1'
  }
}
</script>
