<script setup lang="ts">
import { useTheme } from 'vuetify'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useApi } from '../composables/useApi'
//const { setUser } = useAuth()

const form = ref({ email: '', password: '' })
const formValid = ref(false)
const error = ref('')
const router = useRouter()
const { post } = useApi()
const showPassword = ref(false)

const vuetifyTheme = useTheme()




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
//setUser(response.user)

const user = response.user
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
</script>

<template>
  
</template>


<style scoped>
.auth-container {
  min-height: 100vh;
  background-color: #f5f5f5;
  
}

.auth-box {
  background-color: rgb(246, 242, 242);
  max-width: 900px;
  width: 100%;
 
}

.auth-side-img {
  max-height: 100%;
  max-width: 100%;
  object-fit: contain; /* Shows the full image without cropping */
  border-left: 1px solid #eee;
}
</style>

