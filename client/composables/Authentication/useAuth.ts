// composables/Authentication/useAuth.ts
import { ref } from 'vue'
import axios from 'axios'
import { useRuntimeConfig } from '#app';
//const config = useRuntimeConfig();


//const config = useRuntimeConfig()


//const API_URL = 'http://localhost:3030'

interface LoginResponse {
  accessToken: string
  authentication: { strategy: string }
  user: { id: string; username: string; email: string; roles?: string[] }
}

const user = ref<LoginResponse['user'] | null>(null)
const token = ref<string | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)

const loadUserFromStorage = () => {
  // Ensure we are in the browser
  if (typeof window === 'undefined') return

  const savedToken = localStorage.getItem('feathers-jwt')
  const savedUser = localStorage.getItem('user')

  if (savedToken && savedUser) {
    token.value = savedToken
    user.value = JSON.parse(savedUser)
  }
}

export function useAuth() {
  const config = useRuntimeConfig();
  // Only try to load in browser
  if (process.client && (!token.value || !user.value)) {
    loadUserFromStorage()
  }

  const login = async (email: string, password: string) => {
    loading.value = true
    error.value = null
    try {
      const response = await axios.post<LoginResponse>(`${config.public.apiUrl}/authentication`, {
        strategy: 'local',
        email,
        password
      })

      token.value = response.data.accessToken
      user.value = response.data.user

      if (process.client) {
        localStorage.setItem('feathers-jwt', token.value)
        localStorage.setItem('user', JSON.stringify(user.value))
      }

      return user.value
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Login failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  const logout = () => {
    token.value = null
    user.value = null
    if (process.client) {
      localStorage.removeItem('feathers-jwt')
      localStorage.removeItem('user')
    }
  }

  return {
    user,
    token,
    loading,
    error,
    login,
    logout
  }
}
