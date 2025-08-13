<template>
  <v-container style="height: 600px; width: 100%;" class="mt-16">
    <h2>User Signups Over Time</h2>
    <div v-if="chartData.labels?.length" style="position: relative; height:100%; width:100%">
      <Bar :data="chartData" :options="chartOptions" />
    </div>
    <div v-else>
      <p>Loading chart data...</p>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  type ChartOptions
} from 'chart.js'

import type { ChartData } from 'chart.js'

type AggregatedResult = { date: string; count: number }[]

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const chartData = ref<ChartData<'bar'>>({
  labels: [],
  datasets: [{
    label: 'Users Created',
    backgroundColor: '#93A8AC',
    data: []
  }]
})

// Define a minimal, yet explicit options object
const chartOptions = ref<ChartOptions<'bar'>>({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    },
    title: {
      display: true,
      text: 'User Registrations per Day'
    }
  },
  scales: {
    x: {
      title: {
        display: true,
        text: 'Date'
      }
    },
    y: {
      title: {
        display: true,
        text: 'Number of Users'
      },
      beginAtZero: true
    }
  }
})

onMounted(async () => {
  try {
    const res = await $fetch<AggregatedResult>('/api/players-data', {
      headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
      params: {
        $aggregateByDate: true
      }
    })

    //console.log('Aggregated user data:', res)

    chartData.value.labels = res.map(item =>
      new Date(item.date).toISOString().slice(0, 10)
    )
    chartData.value.datasets[0].data = res.map(item =>
      Number(item.count)
    )
  } catch (error) {
    console.error('Error fetching chart data:', error)
    alert('Error loading the data')
  }
})
</script>