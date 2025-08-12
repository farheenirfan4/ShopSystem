<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '~/composables/Authentication/useAuth'
import { useValidator } from '~/composables/validators/useValidator'
import type { ErrorObject } from 'ajv'

const email = ref('')
const password = ref('')
const errors = ref<ErrorObject[]>([])
const isPasswordVisible = ref(false)

const router = useRouter()
const { login, error } = useAuth()
const { validateLoginForm } = useValidator()

function formatError(err: ErrorObject) {
  if (err.keyword === 'minLength') return 'Password must be at least 6 characters'
  if (err.keyword === 'format' && err.params.format === 'email') return 'Please enter a valid email'
  if (err.keyword === 'required') return `${err.params.missingProperty} is required`
  return 'Invalid input'
}

const handleLogin = async () => {
  const { valid, errors: ajvErrors } = validateLoginForm({
    email: email.value,
    password: password.value
  })

  if (!valid) {
    errors.value = ajvErrors
    return
  }

  errors.value = []
  try {
    await login(email.value, password.value)
    router.push('/admin')
  } catch {
    // error is already set by useAuth
  }
}
</script>

<template>
  <v-container class="fill-height d-flex align-center justify-center">
    <v-card max-width="400" class="pa-6">
      <v-card-title class="text-h5 text-center">
        Welcome Back 👋
      </v-card-title>

      <v-card-text class="pt-4">
        <v-text-field
          v-model="email"
          label="Email"
          type="email"
          outlined
        />

        <v-text-field
          v-model="password"
          label="Password"
          :type="isPasswordVisible ? 'text' : 'password'"
          outlined
          :append-inner-icon="isPasswordVisible ? 'mdi-eye-closed' : 'mdi-eye-outline'"
          @click:append-inner="isPasswordVisible = !isPasswordVisible"
        />

        <ul v-if="errors.length" class="error-list mt-2">
          <li class="text-red" v-for="(err, index) in errors" :key="index">
            {{ formatError(err) }}
          </li>
        </ul>

        <v-alert
          v-if="error"
          type="error"
          variant="tonal"
          class="mt-4"
        >
          {{ error }}
        </v-alert>

        <v-btn
          block
          class="mt-4"
          color="primary"
          @click="handleLogin"
        >
          Sign In
        </v-btn>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<style scoped>
.error-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
.text-red {
  color: red;
}
</style>
