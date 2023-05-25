<template>
  <div>
    <v-row justify="center" align="center" v-if="tags.length > 0">
      <v-col cols="auto" v-for="{ color, name } in tags">
        <v-btn density="compact" :color="getColor(color)" variant="outlined" :disabled="true">{{
          name
        }}</v-btn>
      </v-col>
    </v-row>
    <v-row justify="center" align="center" v-else>
      <v-col cols="auto">
        <v-btn density="compact" variant="outlined" :disabled="true">Sin Tags</v-btn>
      </v-col>
    </v-row>
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
