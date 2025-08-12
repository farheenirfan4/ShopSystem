<template>
  <v-app>
  
    <!-- Top App Bar -->
    <v-app-bar app dark style="background-color: #000000; color: white;">
      <v-app-bar-nav-icon @click="drawer = !drawer" />
      <v-toolbar-title>Shop Management System</v-toolbar-title>
    </v-app-bar>

    <!-- Navigation Drawer -->
    <v-navigation-drawer
      app
      v-model="drawer"
      width="320"
      class="pa-3 rounded-xl"
    >
      <v-list nav dense>
        <v-list-item
          v-for="item in menuItems"
          :key="item.title"
          :to="item.to"
          link
          exact
  active-class="active-link"
        >
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- Main Content -->
    <v-main class="pa-6">
      <slot />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">


import { ref } from 'vue'

const drawer = ref(true)

const menuItems = [
  { title: 'Dashboard', to: '/dashboard' },
  { title: 'See Offers', to: '/offers' },
  { title: 'Set Personas', to: '/create-level' },
  { title: 'Display Configs', to: '/create-leaderboard' },
]
</script>

<style scoped>

.active-link {
  background-color: #000000;
  color: white;
  border-radius: 8px;
}

.v-navigation-drawer {
  background-color: #f5f5f5;
}
</style>
