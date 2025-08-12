<template>
  <v-container class="d-flex justify-center align-center" style="min-height: 100vh;">
    <v-card width="400" class="pa-4" elevation="4">
      <v-card-title class="text-h5 text-center " style="font-weight: bold;">Sign In.</v-card-title>
      <v-form @submit.prevent="onSubmit" v-model="formValid">
        <!-- Email Input -->
        <v-text-field
          v-model="form.email"
          label="Email"
          variant="outlined"
          density="comfortable"
          :rules="[rules.required]"
          prepend-inner-icon="mdi-email"
          class="mb-4"
        />

        <!-- Password Input -->
        <v-text-field
  v-model="form.password"
  :type="showPassword ? 'text' : 'password'"
  label="Password"
  variant="outlined"
  density="comfortable"
  :rules="[rules.required]"
  prepend-inner-icon="mdi-lock"
  :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
  @click:append-inner="showPassword = !showPassword"
  class="mb-4"
/>

        <!-- Submit Button -->
        <v-btn type="submit" block color="primary" size="large" class="mt-2 mb-2">
          Sign In
        </v-btn>
        
      </v-form>
      <div class="d-flex justify-center align-center">
        <span class="me-1">Don't have an account?</span>
        <v-btn variant="text" color="primary" @click="goToSignup" class="text-none px-0" height="auto">
          Sign Up
        </v-btn>
      </div>

      <v-alert v-if="error" type="error" class="mt-4">{{ error }}</v-alert>
    </v-card>
  </v-container>
</template>




<script setup lang="ts">

import { useTheme } from 'vuetify'
import authV1MaskDark from '../assets/images/pages/auth-v1-mask-dark.png'
import authV1MaskLight from '../assets/images/pages/auth-v1-mask-light.png'


import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useApi } from '~/composables/useApi'
const { setUser } = useAuth()

const form = ref({ email: '', password: '' })
const formValid = ref(false)
const error = ref('')
const router = useRouter()
const { post } = useApi()
const showPassword = ref(false)

const vuetifyTheme = useTheme()

const authThemeMask = computed(() => {
  return vuetifyTheme.global.name.value === 'light'
    ? authV1MaskLight
    : authV1MaskDark
})


const rules = {
  required: (v: string) => !!v || 'Required',
}

const onSubmit = async () => {
  error.value = ''
  if (!formValid.value) return

  try {
   type AuthResponse = {
  accessToken: string
  user: {
    id: string
    email: string
    username: string
    role: string
  }
}

const response = await post('/authentication', {
  strategy: 'local',
  email: form.value.email,
  password: form.value.password
}) as AuthResponse

localStorage.setItem('accessToken', response.accessToken)
setUser(response.user)

const user = response.user
    //console.log('Logged in:', user)

    // ✅ Redirect based on role
    if (user.role === 'admin') {
      router.push('/admin')
    } else {
      router.push('/dashboard')
    }
  } catch (err: any) {
    error.value = err.message || 'Login failed'
    alert('Error logging in')
  }
}

const goToSignup = () => {
  router.push('/signup') // or your actual sign-up route
}

</script>
