<template>
  <div style="padding: 20px; font-family: sans-serif;">
    <h1>CORS Debug Tool</h1>
    <p>This will test the deployed backend’s /authentication CORS headers.</p>

    <v-btn color="primary" @click="runTest">Run CORS Test</v-btn>

    <div v-if="loading">Testing...</div>

    <div v-if="error" style="color: red; margin-top: 20px;">
      <strong>Error:</strong> {{ error }}
    </div>

    <div v-if="result" style="margin-top: 20px;">
      <h2>Response Headers</h2>
      <pre>{{ JSON.stringify(result.headers, null, 2) }}</pre>

      <h3>Status</h3>
      <p>{{ result.status }} {{ result.statusText }}</p>

      <h3>CORS Allowed?</h3>
      <p :style="{ color: corsAllowed ? 'green' : 'red' }">
        {{ corsAllowed ? '✅ Yes' : '❌ No' }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// Set your deployed backend URL here:
const BACKEND_URL = 'https://shop-system-5ow7.vercel.app/authentication'

const loading = ref(false)
const error = ref('')
const result = ref<any>(null)
const corsAllowed = ref(false)

const runTest = async () => {
  loading.value = true
  error.value = ''
  result.value = null
  corsAllowed.value = false

  try {
    const res = await fetch(BACKEND_URL, {
      method: 'OPTIONS',
      mode: 'cors',
    })

    const headers: Record<string, string> = {}
    res.headers.forEach((val, key) => {
      headers[key] = val
    })

    result.value = {
      status: res.status,
      statusText: res.statusText,
      headers,
    }

    corsAllowed.value = !!headers['access-control-allow-origin']
  } catch (err: any) {
    error.value = err.message || 'Unknown error'
  } finally {
    loading.value = false
  }
}
</script>
