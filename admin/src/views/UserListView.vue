<template>
  <AppModernLayout>
    <VRow class="mt-1">
      <UserAction @createUser="openCreateUserForm" />
      <UserList :users="users" @changeRole="changeRole" @deleteUser="deleteUser" />
      <DynamoPagination :nextToken="nextToken" @changePage="changePage" v-if="nextToken !== null" />
      <!-- <VDialog v-model="userForm" persistent width="1024">
        <UserForm
          :loading="userCreateLoading"
          @submit="createUser"
          @updateUserForm="updateUserForm"
        />
      </VDialog> -->
    </VRow>
  </AppModernLayout>
</template>

<script setup>
import { API } from 'aws-amplify'
import { ref, onMounted } from 'vue'

import AppModernLayout from '@/layouts/AppModernLayout.vue'

import UserAction from '@/components/user/UserAction.vue'
import DynamoPagination from '@/components/shared/DynamoPagination.vue'
import UserList from '@/components/user/UserList.vue'
// import UserForm from '@/components/user/UserForm.vue'

let userForm = ref(false)
let userCreateLoading = ref(false)

const openCreateUserForm = () => {
  userForm.value = true
}

const updateUserForm = (value) => {
  userForm.value = value
}

const createUser = async (user) => {
  userCreateLoading.value = true
  await API.post('api', '/users/', {
    body: user
  })
  userCreateLoading.value = false
  userForm.value = false
  fetchUsers()
}

const users = ref([])

let nextToken = ref(null)

const fetchUsers = async (token) => {
  const response = await API.get('api', '/users/', {
    queryStringParameters: {
      limit: 10,
      nextToken: token
    }
  })

  users.value = response.items
  nextToken.value = response.nextToken
}

const changePage = (token) => {
  console.log(token)
  fetchUsers(token)
}

const changeRole = async ({ pk, role }) => {
  await API.put('api', `/users/${pk}`, {
    body: {
      role
    }
  })

  const userIndex = users.value.findIndex((user) => user.pk === pk)
  users.value[userIndex].role = role
}

const deleteUser = async ({ pk }) => {
  await API.del('api', `/users/${pk}`)

  const userIndex = users.value.findIndex((user) => user.pk === pk)
  users.value.splice(userIndex, 1)
}

onMounted(() => {
  fetchUsers()
})
</script>
