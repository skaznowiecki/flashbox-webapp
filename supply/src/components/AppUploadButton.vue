<template>
  <div>
    <v-file-input
      label="File input"
      ref="file"
      v-show="false"
      accept="application/pdf"
      @change="onFileChanged($event)"
    ></v-file-input>
    <v-btn :color="color" :size="size" @click="$refs.file.click()" :disabled="disabled">{{
      text
    }}</v-btn>
  </div>
</template>

<script setup>
defineProps(['text', 'size', 'color', 'disabled'])
const emitter = defineEmits(['attached'])

const onFileChanged = ($event) => {
  const target = $event.target
  if (target && target.files) {
    emitter('attached', target.files[0])
  }
}
</script>
