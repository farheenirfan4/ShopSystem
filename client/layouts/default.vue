<template>
  <v-app>
    <!-- Top App Bar -->
    <v-app-bar app dark style="background-color: #000000; color: white;">
      <v-app-bar-nav-icon @click="drawer = !drawer" />
      <v-toolbar-title>Content Management System</v-toolbar-title>
    </v-app-bar>

    <!-- Sidebar Navigation Drawer -->
    <v-navigation-drawer
      app
      v-model="drawer"
      width="260"
      class="d-flex flex-column justify-space-between"
    >
      <!-- Top Section: CMS -->
      <div class="pa-4 d-flex align-center">
        <v-icon class="mr-2">mdi-store</v-icon>
        <span class="text-h6 font-weight-bold">CMS</span>
      </div>

      <!-- Middle Section: Navigation Items -->
      <v-list nav dense class="pa-0">
        <v-list-item
          v-for="item in menuItems"
          :key="item.title"
          :to="item.to"
          link
          exact
          active-class="active-link"
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>

        <!-- Submenu Group -->
        <v-list-group
          v-model="submenuOpen"
          prepend-icon="mdi-chevron-down"
          value=""
          no-action
        >
          <template #activator>
            <v-list-item>
              <v-list-item-icon>
                <v-icon>mdi-dots-horizontal</v-icon>
              </v-list-item-icon>
              <v-list-item-title>More Options</v-list-item-title>
            </v-list-item>
          </template>

          <v-list-item
            v-for="subItem in subMenuItems"
            :key="subItem.title"
            :to="subItem.to"
            link
            exact
            active-class="active-link"
          >
            <v-list-item-icon>
              <v-icon>{{ subItem.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-title>{{ subItem.title }}</v-list-item-title>
          </v-list-item>
        </v-list-group>
      </v-list>

      <!-- Bottom Section: Info Card -->
      <v-card class="ma-4 pa-3" elevation="2" rounded>
        <div class="text-subtitle-2 font-weight-medium">
          Welcome to the CMS Dashboard
        </div>
        <div class="text-caption text-grey-darken-1 mt-1">
          Manage your users, levels, and leaderboards efficiently.
        </div>
      </v-card>
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
const submenuOpen = ref(false)

const menuItems = [
  { title: 'Home', to: '/', icon: 'mdi-home' },
  { title: 'Create User', to: '/create-user', icon: 'mdi-account-plus' },
  { title: 'Create Level', to: '/create-level', icon: 'mdi-ladder' },
  { title: 'Create Leaderboard', to: '/create-leaderboard', icon: 'mdi-trophy' },
]

const subMenuItems = [
  { title: 'Reports', to: '/reports', icon: 'mdi-file-chart' },
  { title: 'Settings', to: '/settings', icon: 'mdi-cog' },
  { title: 'Logs', to: '/logs', icon: 'mdi-book' },
]
</script>

<style scoped>
.active-link {
  background-color: #000000;
  color: white !important;
  border-radius: 8px;
}

.v-navigation-drawer {
  background-color: #f5f5f5;
  color: black;
}

.v-list-item-title {
  font-weight: 500;
}

.v-list-item-icon {
  margin-right: 10px;
}
</style>
