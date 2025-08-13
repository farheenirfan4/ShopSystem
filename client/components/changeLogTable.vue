<template>
  <v-card class="pa-4 rounded-xl mt-16" elevation="2">
    <v-card-title class="d-flex justify-space-between align-center">
      <span class="text-h6 font-weight-bold">Change Log Table</span>
      <v-text-field
        v-model="search"
        prepend-inner-icon="mdi-magnify"
        label="Search"
        variant="outlined"
        dense
        hide-details
        class="ma-0"
        style="max-width: 250px"
      />
    </v-card-title>

    <v-data-table
      :headers="headers"
      :items="changeLogs"
      :search="search"
      class="elevation-1 rounded-xl"
      density="comfortable"
      item-value="action"
    >
       
     
    </v-data-table>

    <!-- Pagination -->
    <v-data-table-pagination v-slot="{ page, itemsPerPage, pageCount }" />
  </v-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { ChangeLog } from '~/types/changeLog'
import { useChangeLogService } from '../composables/changeLogService'

const search = ref('')

const headers = [
  { title: 'Change Log Id', key: 'id', sortable: false },
  { title: 'Timestamp', key: 'timestamp' },
  { title: 'Action', key: 'action' },
  { title: 'Field Name', key: 'field_name' },
  { title: 'Old Value', key: 'old_value' },
  { title: 'New Value', key: 'new_value' },
  { title: 'Player Id', key: 'player_id' },
  { title: 'User Id', key: 'user_id' }
]



function getWinColor(ratio: number) {
  if (ratio > 0.6) return 'green'
  if (ratio > 0.4) return 'orange'
  return 'red'
}


const {
  changeLogs, total, loading, searchUsername, 
  fetchChangeLogData,debouncedFetchData
} = useChangeLogService()

onMounted(fetchChangeLogData)
</script>

<style scoped>
.v-data-table {
  border-radius: 16px;
  overflow: hidden;
}
.v-data-table tbody tr:hover {
  background-color: rgba(0, 0, 0, 0.04);
}
</style>
