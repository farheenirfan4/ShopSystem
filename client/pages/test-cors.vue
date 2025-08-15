<script setup lang="ts">
import { testCors } from '~/utils/testCors'
import { useRuntimeConfig } from '#app'

const config = useRuntimeConfig()

onMounted(() => {
  testCors(`${config.public.apiUrl}authentication`, window.location.origin)
})
</script>

<template>
  <div style="padding: 20px">
    <h1>Test CORS</h1>
    <p>Check the browser console for CORS header results.</p>
  </div>
</template>
