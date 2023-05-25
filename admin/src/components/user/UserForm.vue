<template>
  <v-card>
    <v-card-title>
      <span class="text-h6">Nuevo usuario</span>
    </v-card-title>
    <v-card-text>
      <v-container>
        <v-form fast-fail ref="userForm">
          <VRow>
            <VCol cols="4">
              <v-text-field
                v-model="user.name"
                :rules="nameValidation"
                label="Nombre"
                variant="outlined"
              ></v-text-field>
            </VCol>
            <VCol cols="4">
              <v-text-field
                v-model="user.email"
                label="E-mail"
                :rules="emailValidation"
                variant="outlined"
              ></v-text-field>
            </VCol>
            <VCol cols="4">
              <v-select
                v-model="user.role"
                :items="items"
                label="Role"
                :rules="roleValidation"
                variant="outlined"
              ></v-select>
            </VCol>
            <VCol cols="4">
              <v-text-field
                v-model="user.password"
                type="password"
                label="Contraseña temporal"
                :rules="passwordValidation"
                variant="outlined"
              ></v-text-field>
            </VCol>
          </VRow>
        </v-form>
      </v-container>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn class="me-4" variant="outlined" type="button" @click="create" :loading="loading">
        Crear
      </v-btn>
      <v-btn
        class="me-4"
        variant="outlined"
        type="button"
        @click="emitter('updateUserForm', false)"
      >
        Cerrar</v-btn
      >
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { ref, reactive } from 'vue'
const emitter = defineEmits(['submit', 'updateUserForm'])

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const userForm = ref(null)

const nameValidation = [
  (value) => {
    if (value?.length >= 5) return true
    return 'Nombre debe tener al menos 5 caracteres.'
  }
]

const passwordValidation = [
  (value) => {
    if (value?.length >= 2) return true
    return 'Contraseña debe tener al menos 5 caracteres.'
  }
]

const emailValidation = [
  (value) => {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/i.test(value)) return true
    return 'Debe ser un email valido.'
  }
]

const roleValidation = [
  (value) => {
    if (value) return true

    return 'Debes seleccionar un role.'
  }
]

const items = ref(['admin', 'user'])

const user = reactive({})

const create = async () => {
  const { valid } = await userForm.value.validate()
  if (!valid) return

  emitter('submit', {
    role: user.role,
    name: user.name,
    email: user.email,
    tempPassword: user.password
  })
}
</script>
