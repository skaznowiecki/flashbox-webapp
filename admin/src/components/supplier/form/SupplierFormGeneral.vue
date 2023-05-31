<template>
  <div>
    <VRow>
      <VCol cols="12">
        <p class="text-h6">Datos generales</p>
        <br />
        <v-divider class="border-opacity-50"></v-divider>
      </VCol>
    </VRow>
    <VRow>
      <VCol cols="4">
        <v-text-field
          label="Razon social"
          v-model="supplier.name"
          variant="outlined"
        ></v-text-field>
      </VCol>
      <VCol cols="4">
        <v-text-field
          label="CUIT/CUIL"
          v-model="supplier.idNumber"
          variant="outlined"
        ></v-text-field>
      </VCol>
      <VCol cols="4">
        <v-text-field
          label="Condicion"
          v-model="supplier.condition"
          variant="outlined"
        ></v-text-field>
      </VCol>
      <VCol cols="4">
        <v-text-field label="Email" v-model="supplier.email" variant="outlined"></v-text-field>
      </VCol>
      <VCol cols="4">
        <v-text-field
          label="Direccion"
          v-model="supplier.address"
          variant="outlined"
        ></v-text-field>
      </VCol>
      <VCol cols="4">
        <v-text-field
          label="Comienzo actividades"
          v-model="supplier.startDate"
          variant="outlined"
        ></v-text-field>
      </VCol>
      <VCol cols="4">
        <v-select
          v-model="supplier.tagIds"
          :items="tags"
          label="Elegir tags"
          item-title="name"
          item-value="id"
          multiple
          persistent-hint
          variant="outlined"
        ></v-select>
      </VCol>
    </VRow>
    <VRow>
      <VCol cols="12">
        <p class="text-h6">Facturacion</p>
        <br />
        <v-divider class="border-opacity-50"></v-divider>
      </VCol>
    </VRow>
    <VRow>
      <VCol cols="4">
        <v-select
          :items="companies"
          v-model="supplier.businessId"
          label="Empresa"
          item-title="key"
          item-value="value"
          variant="outlined"
        ></v-select>
      </VCol>
      <VCol cols="4">
        <v-text-field
          label="Periodo pago"
          type="number"
          v-model="supplier.paymentPeriod"
          variant="outlined"
        ></v-text-field>
      </VCol>
    </VRow>
  </div>
</template>

<script setup>
import { companies } from '@/data/constants.json'

const props = defineProps({
  tags: {
    type: Array
  },
  supplier: {
    type: Object
  }
})
</script>
