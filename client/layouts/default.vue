<template>
  <v-app>
    <v-app-bar app dark style="background-color: #000000; color: white;">
      <v-app-bar-nav-icon @click="drawer = !drawer" />
      <v-toolbar-title class="d-flex align-center">
        <span class="text-h6">Shop Management System</span>
      </v-toolbar-title>
    </v-app-bar>

    <v-navigation-drawer
      app
      v-model="drawer"
      :permanent="drawer"
      width="300"
      class="pa-3"
      style="background-color: white !important;"
      transition="slide-x-transition"
    >
      <v-list nav dense>
        <v-list-item
          v-for="item in menuItems"
          :key="item.title"
          :to="item.to"
          link
          exact
          active-class="active-link"
          class="nav-link"
          @click="handleMenuClick(item)"
        >
          <v-list-item-content class="d-flex align-center">
            <v-icon class="mr-2">{{ item.icon }}</v-icon>
            <v-list-item-title class="text-body-1 font-weight-medium">{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main :style="mainContentStyle" class="pa-6">
      <slot />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useDisplay } from 'vuetify'
import { useAuth } from '~/composables/Authentication/useAuth'
import { useRouter } from 'vue-router'

const drawer = ref(true)
const { mdAndUp } = useDisplay()
const { logout } = useAuth()
const router = useRouter()

const menuItems = [
  { title: 'Dashboard', to: '/dashboard', icon: 'mdi-view-dashboard' },
  { title: 'See Offers', to: '/offers', icon: 'mdi-tag' },
  { title: 'Set Personas', to: '/persona', icon: 'mdi-account-group' },
  { title: 'Display Configs', to: '/displayConfigs', icon: 'mdi-monitor-screenshot' },
  { title: 'Players Data', to: '/admin', icon: 'mdi-list-box' },
  { title: 'Visualize data', to: '/visualizedata', icon: 'mdi-chart-bar' },
  //{ title: 'Settings', to: '/settings', icon: 'mdi-cog' },
  { title: 'Log out', to: '/signin', icon: 'mdi-login-variant',action: 'logout' },

]

// Handle menu item click
const handleMenuClick = async (item: typeof menuItems[number]) => {
  if (item.action === 'logout') {
    logout()          // Call the logout function
    await router.push('/signin')  // Navigate to signin
  } else {
    await router.push(item.to)
  }
}

// Dynamically compute the margin for the main content
const mainContentStyle = computed(() => {
  // Add a margin only on medium and larger screens where the drawer is permanent
  if (mdAndUp.value && drawer.value) {
    return { 'margin-left': '320px' };
  }
  return {};
});
</script>

<style scoped>
.active-link {
  background-color: #000000;
  color: white !important;
}

.nav-link {
  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
}

.v-navigation-drawer {
  background-color: #f5f5f5;
}

.v-list-item-content > .v-icon {
  color: #000000;
}

.v-list-item-content > .v-list-item-title {
  color: #000000;
}

.active-link .v-icon, .active-link .v-list-item-title {
  color: white !important;
}
</style>