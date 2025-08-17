<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'

const result = ref<string>('')
const error = ref<string>('')

const testCors = async () => {
  result.value = ''
  error.value = ''
  try {
    console.log('[TestCors] Sending request to test-cors endpoint...')
    const response = await axios.get(
      'https://shop-system-5ow7.vercel.app/api/test-cors',
      { withCredentials: true }
    )
    console.log('[TestCors] Response received:', response.data)
    result.value = JSON.stringify(response.data)
  } catch (err: any) {
    console.error('[TestCors] Request failed ❌', err)
    error.value = err.message || 'Request failed'
  }
}
</script>

<template>
  <div style="padding: 2rem;">
    <h1>Test CORS Endpoint</h1>
    <button @click="testCors">Send Test Request</button>

    <div v-if="result" style="margin-top: 1rem; color: green;">
      ✅ Response: {{ result }}
    </div>

    <div v-if="error" style="margin-top: 1rem; color: red;">
      ❌ Error: {{ error }}
    </div>
  </div>
</template>
