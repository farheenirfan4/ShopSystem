<template>
  <v-container fluid class="pa-6">
    <v-row>
      <v-col cols="12" md="9">
        <userTable v-if="isAdmin" />
      </v-col>

      <v-col cols="12" md="3">
        <v-card class="pa-4 mt-16" style="background-color: white;">
          <h3 class="text-h6 mb-4">Summary</h3>
          
          <v-card class="pa-4 mb-4 text-center" style="background-color: black; color: white;">
            <v-card-text>
              <div class="text-h4 font-weight-bold">12097</div>
              <div class="text-caption text-uppercase mt-1">Total Users</div>
            </v-card-text>
          </v-card>

          <v-card class="pa-4 mb-4 text-center" style="background-color: black; color: white;">
            <v-card-text>
              <div class="text-h4 font-weight-bold">16</div>
              <div class="text-caption text-uppercase mt-1">Total Offers</div>
            </v-card-text>
          </v-card>

          <v-card class="pa-4 text-center" style="background-color: black; color: white;">
            <v-card-text>
              <div class="text-h4 font-weight-bold">30,000</div>
              <div class="text-caption text-uppercase mt-1">Total Deposits</div>
            </v-card-text>
          </v-card>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">

import { useAuth } from '~/composables/Authentication/useAuth'
import userTable from '~/components/userTable.vue';

const { user } = useAuth()

// Computed property to check if the user is an admin
const isAdmin = computed(() => user.value?.roles?.includes('admin'))
</script>

<style scoped>
/* You can add any specific styles here */
</style>