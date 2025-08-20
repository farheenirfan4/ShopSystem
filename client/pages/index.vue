<script setup lang="ts">
import SignInForm from '~/components/SignInForm.vue';
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '~/composables/Authentication/useAuth'
definePageMeta({
  layout: 'empty' // No navbar for this page
})

const router = useRouter()
const { initAuth, isLoggedIn, user } = useAuth()

onMounted(() => {
  initAuth() // restore from localStorage if available
  if (isLoggedIn()) {
    //console.log("✅ User still logged in:", user.value)
    router.push('/dashboard')
  }
})

</script>

<template>
  <SignInForm></SignInForm>
</template>