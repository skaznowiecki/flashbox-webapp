<template>
  <VCol cols="12">
    <VTable class="elevation-1 rounded-lg">
      <thead class="text-uppercase text-subtitle-2">
        <tr>
          <th class="text-center">Nombre</th>
          <th class="text-center">Email</th>
          <th class="text-center">Role</th>
          <th class="text-center">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in users" :key="item.pk">
          <td class="text-center">{{ item.name }}</td>
          <td class="text-center">{{ item.email }}</td>
          <td class="text-center">
            <v-row justify="center" align="center">
              <v-col cols="auto">
                <v-btn
                  density="compact"
                  :color="isAdmin(item) ? 'primary' : ''"
                  variant="outlined"
                  :active="isAdmin(item)"
                  :disabled="isAdmin(item)"
                  @click="changeRole(item, 'admin')"
                  >admin</v-btn
                >
              </v-col>
              <v-col cols="auto">
                <v-btn
                  density="compact"
                  :color="isUser(item) ? 'primary' : ''"
                  variant="outlined"
                  :active="isUser(item)"
                  :disabled="isUser(item)"
                  @click="changeRole(item, 'user')"
                  >user</v-btn
                >
              </v-col>
            </v-row>
          </td>
          <td class="text-center">
            <v-row align="center" justify="center">
              <v-col cols="auto">
                <v-btn size="small" @click="deleteUser(item)" variant="outlined"> Eliminar </v-btn>
              </v-col>
            </v-row>
          </td>
        </tr>
      </tbody>
    </VTable>
  </VCol>
</template>
<style scoped>
table thead {
  background-color: #eceff1;
}
</style>
<script setup>
defineProps({
  users: {
    type: Array,
    required: true
  }
})

const emitter = defineEmits(['changeRole', 'deleteUser'])

const isAdmin = (item) => item.role === 'admin'
const isUser = (item) => item.role === 'user'

const changeRole = (item, role) => {
  emitter('changeRole', { pk: item.pk, role })
}

const deleteUser = (item) => {
  emitter('deleteUser', { pk: item.pk })
}
</script>
