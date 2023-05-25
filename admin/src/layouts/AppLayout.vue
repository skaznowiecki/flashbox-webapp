<template>
  <v-card>
    <v-layout>
      <Sidebar />
      <v-main>
        <v-container class="py-8 px-6" fluid>
          <slot></slot>
        </v-container>
      </v-main>
    </v-layout>
  </v-card>
</template>

<script setup>
import Sidebar from '@/components/layout/Sidebar.vue'
</script>
