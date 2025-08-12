<template>
  <v-app>
    <v-app-bar app color="primary" dark class ="mb-8">
      

      <v-btn icon @click="logout">
        <v-icon>mdi-logout</v-icon>
      </v-btn>

      <v-toolbar-title class="text-center w-100">
        Content Management System
      </v-toolbar-title>
    </v-app-bar>
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