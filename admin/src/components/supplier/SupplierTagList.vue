<template>
  <v-card>
    <v-card-title>
      <span class="text-h6">Listado de Tags</span>
    </v-card-title>
    <v-card-text>
      <v-container>
        <v-table height="450px" fixed-header>
          <thead>
            <tr>
              <th class="text-center">Nombre</th>
              <th class="text-center">Color (Cantidad)</th>
              <th class="text-center">Acciones</th>
            </tr>
          </thead>
          <tbody class="text-center">
            <tr v-for="{ id, name, color, count } in tags" :key="id">
              <td>{{ name }}</td>
              <td>
                <v-row align="center" justify="center">
                  <v-col cols="auto">
                    <VBtn
                      :color="formatColor(color)"
                      variant="flat"
                      size="small"
                      :disabled="true"
                    ></VBtn>
                  </v-col>

                  <v-col cols="auto">
                    <VBtn variant="outlined" size="small" :disabled="true"
                      >Proveedores ({{ count }})</VBtn
                    >
                  </v-col>
                </v-row>
              </td>
              <td>
                <VBtn
                  variant="outlined"
                  :disabled="count > 0"
                  @click="emitter('delete', id)"
                  :loading="loading"
                  >ELIMINAR</VBtn
                >
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-container>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>

      <v-btn class="me-4" variant="outlined" type="button" @click="emitter('close')"> Cerrar</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
const emitter = defineEmits(['close', 'delete'])

const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  },
  tags: {
    type: Array,
    default: []
  }
})

const formatColor = (color) => {
  return `#${color}`
}
</script>
