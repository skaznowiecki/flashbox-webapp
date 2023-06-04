<template>
  <v-card width="800">
    <v-card-title class="text-center text-h4"> Liquidación </v-card-title>
    <v-divider></v-divider>
    <VRow align="center" justify="center">
      <VCol cols="auto">
        <v-alert
          density="compact"
          type="warning"
          text="El CUIL/CUIL ingresado no existe en nuestra base de datos. 
      Por favor, verifique los datos ingresados. 
      En caso de no estar registrado, por favor, comuniquese con el administrador."
        ></v-alert>
      </VCol>
    </VRow>
    <v-card-actions>
      <VRow align="center" justify="center">
        <VCol cols="auto">
          <v-btn color="primary" @click="goBack">Volver</v-btn>
        </VCol>
      </VRow>
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goBack = () => {
  router.push({ name: 'Home' })
}
</script>
