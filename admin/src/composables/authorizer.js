import { useAuthStore } from '@/stores/AuthStore'

import gates from '@/authorization/gates.json'

export function useAuthorizer() {
  const authStore = useAuthStore()

  const can = (type, permission) => {
    if (!gates[type]) {
      console.error(`Type ${type} doesn't exist`)
      return false
    }

    if (!gates[type][permission]) {
      console.error(`Permission ${permission} doesn't exist`)
      return false
    }
    return gates[type][permission].includes(authStore.role)
  }

  const canAction = (action) => {
    return can('actions', action)
  }

  const canSection = (section) => {
    return can('sections', section)
  }

  const canRoute = (route) => {
    return can('routes', route)
  }

  return {
    can,
    canAction,
    canSection,
    canRoute
  }
}
