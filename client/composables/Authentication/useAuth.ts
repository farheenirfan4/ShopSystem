// composables/Authentication/useAuth.ts
import { ref } from 'vue'
import axios from 'axios'
import { useRuntimeConfig } from '#app'

const apiUrl = 'https://shop-system-5ow7.vercel.app' // ✅ Use deployed API

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
  if (typeof window === 'undefined') return
  console.log('[useAuth] Loading user/token from localStorage...')

  const savedToken = localStorage.getItem('feathers-jwt')
  const savedUser = localStorage.getItem('user')

  if (savedToken && savedUser) {
    console.log('[useAuth] Found saved user and token ✅')
    token.value = savedToken
    user.value = JSON.parse(savedUser)
  } else {
    console.log('[useAuth] No saved user/token found ❌')
  }
}

export function useAuth() {
  const config = useRuntimeConfig()

  if (process.client && (!token.value || !user.value)) {
    console.log('[useAuth] Running loadUserFromStorage on client side')
    loadUserFromStorage()
  }

  const login = async (email: string, password: string) => {
    console.log('[useAuth] login() called with email:', email)
    loading.value = true
    error.value = null

    try {
      const response = await axios.post<LoginResponse>(
        `${apiUrl}/authentication`,
        {
          strategy: 'local',
          email,
          password
        },
        { withCredentials: true }
      )

      console.log('[useAuth] Login success ✅ Response:', response.data)

      token.value = response.data.accessToken
      user.value = response.data.user

      if (process.client) {
        localStorage.setItem('feathers-jwt', token.value)
        localStorage.setItem('user', JSON.stringify(user.value))
        console.log('[useAuth] Saved user + token in localStorage')
      }

      return user.value
    } catch (err: any) {
      console.error('[useAuth] Login failed ❌', err.response?.data || err)
      error.value = err.response?.data?.message || 'Login failed'
      throw err
    } finally {
      loading.value = false
      console.log('[useAuth] login() finished, loading = false')
    }
  }

  const logout = () => {
    console.log('[useAuth] logout() called')
    token.value = null
    user.value = null
    if (process.client) {
      localStorage.removeItem('feathers-jwt')
      localStorage.removeItem('user')
      console.log('[useAuth] Cleared localStorage')
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
