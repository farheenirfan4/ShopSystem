<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '~/composables/Authentication/useAuth'
import { useValidator } from '~/composables/validators/useValidator'
import type { ErrorObject } from 'ajv'
import backgroundImage from '../assets/images/misc/signinScreenImage.jpg';

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
    router.push('/dashboard')
  } catch {
    // error is already set by useAuth
  }
}
</script>

<template>
  <v-app>
    <v-main class="d-flex fill-height">
      <v-col
        cols="12"
        md="7"
        class="pa-0 h-100 d-none d-md-block image-panel"
      ></v-col>

      <v-col
        cols="12"
        md="5"
        class="d-flex align-center justify-center h-100 pa-0"
        style="background-color: #f5f5f5;"
      >
        <v-card max-width="500" class="pa-8">
          <v-card-title class="text-h4 font-weight-bold text-center mb-2">
            Welcome Back 👋
          </v-card-title>

          <v-card-subtitle class="text-center text-subtitle-1 mb-8">
            Login to continue
          </v-card-subtitle>

          <v-card-text class="pt-4">
            <v-text-field
              v-model="email"
              label="Email"
              type="email"
              outlined
              dense
              class="mb-2"
              variant="outlined"
            />

            <v-text-field
              v-model="password"
              label="Password"
              :type="isPasswordVisible ? 'text' : 'password'"
              outlined
              variant="outlined"
              dense
              :append-inner-icon="isPasswordVisible ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
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
              class="mt-6"
              color="primary"
              @click="handleLogin"
            >
              Sign In
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-main>
  </v-app>
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

.image-panel {
  /* Use the imported image as the background */
  background-image: url("../assets/images/misc/signInScreenImage1.jpg");
  background-size: cover;
  background-position: center;
}
</style>
