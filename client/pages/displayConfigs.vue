<template>
  <div v-if="isAdmin">
    <displayConfigTable />
  </div>
  <div v-else class="mt-16">
    <p>You do not have permission to view this page.</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import displayConfigTable from '~/components/displayConfigTable.vue'
import { useAuth } from '~/composables/Authentication/useAuth'

const { user } = useAuth()

// Computed property to check if the user has the "admin" role
const isAdmin = computed(() => {
  return user.value?.roles?.includes('admin')
})
</script>
