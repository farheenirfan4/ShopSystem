<!-- pages/cors-debug.vue -->
<template>
  <v-container class="mt-8">
    <v-card>
      <v-card-title>CORS Debug Tool</v-card-title>
      <v-card-text>
        <v-btn color="primary" @click="runTests" :loading="loading">Run CORS Test</v-btn>

        <div v-if="results.length" class="mt-4">
          <div v-for="res in results" :key="res.type" class="mb-6">
            <h3 class="text-h6">{{ res.type }} Response</h3>
            <p>Status: {{ res.status }}</p>
            <v-table density="compact">
              <thead>
                <tr>
                  <th>Header</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(val, key) in res.headers" :key="key">
                  <td>{{ key }}</td>
                  <td>{{ val }}</td>
                </tr>
              </tbody>
            </v-table>
          </div>
        </div>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const loading = ref(false)
const results = ref<any[]>([])

// Change to your deployed backend URL
const API_URL = process.env.API_URL || 'https://shop-system-5ow7.vercel.app'

async function runTests() {
  loading.value = true
  results.value = []

  try {
    // 1. OPTIONS preflight request
    const optionsRes = await fetch(`${API_URL}/authentication`, {
      method: 'OPTIONS',
      headers: {
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type, Authorization',
        Origin: window.location.origin
      }
    })
    results.value.push({
      type: 'OPTIONS Preflight',
      status: optionsRes.status,
      headers: Object.fromEntries(optionsRes.headers.entries())
    })

    // 2. Actual POST request with dummy body
    const postRes = await fetch(`${API_URL}/authentication`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Origin: window.location.origin
      },
      body: JSON.stringify({
        strategy: 'local',
        email: 'test@example.com',
        password: 'wrongpass'
      })
    })
    results.value.push({
      type: 'POST Request',
      status: postRes.status,
      headers: Object.fromEntries(postRes.headers.entries())
    })
  } catch (err) {
    console.error('CORS Test Error:', err)
  } finally {
    loading.value = false
  }
}
</script>
