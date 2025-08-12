<template>
  <v-app>
     <PlayerDataTable :can-edit="false"  />
  </v-app>
   
 
</template>

<script setup lang="ts">
import {useAuth} from '../composables/useAuth'
const router = useRouter()

const clearUser = useAuth

function goToSettings() {
  router.push('/settings')
}

function logout() {
  clearUser()
  router.push('/signin')
}
</script>