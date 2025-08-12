// composables/Authentication/useAuth.ts
import { ref } from 'vue'
import axios from 'axios'

const API_URL = 'http://localhost:3030'



interface LoginResponse {
  accessToken: string
  authentication: { strategy: string }
  user: { id: string;username: string; email: string; roles?: string[] }
}

const user = ref<LoginResponse['user'] | null>(null)
const token = ref<string | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)

export function useAuth() {
  const login = async (email: string, password: string) => {
    loading.value = true
    error.value = null
    try {
      const response = await axios.post<LoginResponse>(`${API_URL}/authentication`, {
        strategy: 'local',
        email,
        password
      })

      token.value = response.data.accessToken
      user.value = response.data.user

      console.log(`Logged in as:`, user.value.roles)
      //alert('Sign in')

      // Save both token and user
      localStorage.setItem('feathers-jwt', token.value)
      localStorage.setItem('user', JSON.stringify(user.value))

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
    localStorage.removeItem('feathers-jwt')
    localStorage.removeItem('user')
  }

  const loadUserFromStorage = () => {
    const savedToken = localStorage.getItem('feathers-jwt')
    const savedUser = localStorage.getItem('user')

    if (savedToken && savedUser) {
      token.value = savedToken
      user.value = JSON.parse(savedUser)
    }
  }

  return {
    user,
    token,
    loading,
    error,
    login,
    logout,
    loadUserFromStorage
  }
}
