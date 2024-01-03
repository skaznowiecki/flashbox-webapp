<template>
  <div>
    <div v-if="tags.length > 0">
      <v-chip
        class="ma-2"
        label
        v-for="{ color, name } in tags"
        :key="name"
        :color="getColor(color)"
        size="small"
      >
        {{ name }}
      </v-chip>
    </div>
    <div v-else>
      <v-chip class="ma-2" label size="small"> Sin Tags </v-chip>
    </div>
  </div>
</template>

<script setup>
defineProps({
  tags: {
    type: Array,
    required: true
  }
})

const getColor = (color) => `#${color}`
</script>
