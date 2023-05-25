<template>
  <v-card>
    <v-card-title>
      <span class="text-h6">Tags</span>
    </v-card-title>
    <v-card-text>
      <v-container>
        <v-form>
          <VRow>
            <VCol cols="12">
              <v-select
                v-model="selectedTags"
                :items="tags"
                label="Elegir tag"
                item-title="name"
                item-value="id"
                multiple
                variant="outlined"
              ></v-select>
            </VCol>
          </VRow>
        </v-form>
      </v-container>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn class="me-4" variant="outlined" type="button" @click="update" :loading="loading">
        Guardar
      </v-btn>
      <v-btn class="me-4" variant="outlined" type="button" @click="emitter('close')"> Cerrar</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { ref } from 'vue'
const emitter = defineEmits(['submit', 'close'])

const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  },
  tags: {
    type: Array,
    required: true
  },
  supplier: {
    type: Object,
    required: true
  }
})

const selectedTags = ref(props.supplier.tagIds)

const update = async () => {
  emitter('submit', {
    tags: selectedTags.value
  })
}
</script>
