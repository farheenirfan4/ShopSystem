<template>
  <v-container style="height: 600px; width: 100%;">
    <h2>Active Offers Over Time</h2>
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

type AggregatedResult = { day: string; active_offers_count: number }[]

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const chartData = ref<ChartData<'bar'>>({
  labels: [],
  datasets: [{
    label: 'Active Offers',
    backgroundColor: '#93A8AC',
    data: []
  }]
})

const chartOptions = ref<ChartOptions<'bar'>>({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    },
    title: {
      display: true,
      text: 'Active Offers per Day'
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
        text: 'Number of Active Offers'
      },
      beginAtZero: true
    }
  }
})

onMounted(async () => {
  try {
    const res = await $fetch<AggregatedResult>('/api/offers', {
      headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
      params: {
        $offersPerDay: true
      }
    })

    //console.log('Aggregated offers data:', res)

    chartData.value.labels = res.map(item =>
      new Date(item.day).toISOString().slice(0, 10)
    )
    chartData.value.datasets[0].data = res.map(item =>
      Number(item.active_offers_count)
    )
  } catch (error) {
    console.error('Error fetching chart data:', error)
    alert('Error loading the data')
  }
})
</script>

<style scoped>
/* Add any specific styles here if needed */
</style>