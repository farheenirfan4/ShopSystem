<template>
  <v-container class="d-flex justify-center align-center" style="min-height: 100vh;">
    <v-card width="400" elevation="6" class="pa-4">
      <v-card-title class="text-h5 text-center" style="font-weight: bold;">Sign Up.</v-card-title>
      <v-form @submit.prevent="onSubmit" ref="formRef" v-model="formValid">
        <!-- Username -->
          <p v-if="errors.username" class="text-red pb-2">{{ errors.username }}</p>
        <v-text-field
          v-model="form.username"
          label="Username"
          variant="outlined"
          density="comfortable"
          :rules="[rules.required]"
          required
          prepend-inner-icon="mdi-account"
          class="mb-4"
        />
       <p v-if="errors.email" class="text-red pb-2">{{ errors.email }}</p>
        <!-- Email -->
        <v-text-field
          v-model="form.email"
          label="Email"
          variant="outlined"
          density="comfortable"
          :rules="[rules.required, rules.email]"
          required
          prepend-inner-icon="mdi-email"
          class="mb-4"
        />

        <!-- Password -->
          <p v-if="errors.password" class="text-red pb-2">{{ errors.password }}</p>
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

        
        <v-btn type="submit" color="primary" block size="large" class="mt-2 mb-2">
          Create Account
        </v-btn>
        <v-alert v-if="message" type="success" class="mt-4">{{ message }}</v-alert>
        <v-alert v-if="error" type="error" class="mt-4">{{ error }}</v-alert>
         
      </v-form>
      <!-- Already have account -->
      <div class="d-flex justify-center align-center mt-4">
        <span class="me-1">Already have an account?</span>
        <v-btn variant="text" color="primary" @click="goToSignup" class="text-none px-0" height="auto">
          Sign In
        </v-btn>
      </div>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router'
import type { AuthResponse } from '../types/user'
import { signupSchema } from '../schemas/signupSchema'
import { useValidator } from '../composables/usevalidator'
//import { useValidator } from '../composables/useValidator';
import { signupRules } from '../composables/validationRules';
const { setUser } = useAuth()
const showPassword = ref(false)



//import setUser from '../composables/useAuth'
//import { useValidator } from '~/composables/usevalidator'
const form = ref({ username: '', email: '', password: '' })
const formRef = ref()
const formValid = ref(false)
const router = useRouter()
const rules = {
  required: (v: string) => !!v || 'Required',
  email: (v: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Invalid email',
}

const { post } = useApi()
const message = ref('')
const error = ref('')
const { errors, validateAll } = useValidator(signupRules);


//const validateSignup = useValidator<typeof form.value>(signupSchema)

const onSubmit = async () => {
  error.value = '';
  message.value = '';

  // Validate the entire form
  const isFormValid = validateAll(form.value);
  if (!isFormValid) {
    return
  }

  try {
    const payload = { ...form.value, role: 'moderator' }
    await post('/users', payload)

    const loginPayload = {
      strategy: 'local' as const,
      email: form.value.email,
      password: form.value.password
    }

    const response = await post('/authentication', loginPayload) as AuthResponse

    localStorage.setItem('accessToken', response.accessToken)
    setUser(response.user)
    router.push('/dashboard')
  } catch (err: any) {
    error.value = 'Signup or login failed'
    alert('Your user name or email is not unique')
  }
}


const goToSignup = () => {
  router.push('/signin') 
}
</script>
