<template>
  <div v-if="isAdmin" >
    <personaConfigTable />
  </div>
  <div v-else class="mt-16">
    <p>You do not have permission to view this page.</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import personaConfigTable from '../components/personaConfigTable.vue'
import { useAuth } from '~/composables/Authentication/useAuth'

const { user } = useAuth()

// Computed property to check if the user has the "admin" role
const isAdmin = computed(() => {
  return user.value?.roles?.includes('admin')
})
</script>
