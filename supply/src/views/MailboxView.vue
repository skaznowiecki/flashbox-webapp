<template>
  <v-sheet width="400" class="mx-auto">
    <div class="d-flex align-center justify-center" style="height: 100vh">
      <v-card class="mx-auto" width="400" prepend-icon="mdi-receipt-text">
        <template v-slot:title> Registrar factura </template>

        <v-card-text>
          <MailboxForm :supplier-id="route.params.id" />
        </v-card-text>
      </v-card>
    </div>
  </v-sheet>
</template>
<script setup>
import { useRoute } from 'vue-router'

import MailboxForm from '@/components/mailbox/MailboxForm.vue'

const route = useRoute()
</script>
