// composables/useAuth.ts
import { ref } from 'vue'

type AuthUser = {
  id: string
  username: string
  role: string
}

const user = ref<AuthUser | null>(null)

// Eagerly load from localStorage
if (process.client && !user.value) {
  const storedUser = localStorage.getItem('user')
  if (storedUser) {
    user.value = JSON.parse(storedUser)
  }
}

export const useAuth = () => {
  const setUser = (userData: AuthUser) => {
    user.value = userData
    localStorage.setItem('user', JSON.stringify(userData))
  }

  const clearUser = () => {
    user.value = null
    localStorage.removeItem('user')
  }

  return { user, setUser, clearUser }
}
