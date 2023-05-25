import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'

export const useAuthStore = defineStore('AuthStore', {
  state: () => {
    return {
      user: useStorage('user', {})
    }
  },
  getters: {
    isLoggedIn: (state) => {
      return state.user.sub !== undefined
    }
  },
  actions: {
    login(user) {
      this.user = user
    }
  }
})
