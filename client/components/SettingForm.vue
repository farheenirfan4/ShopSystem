<template>
  <div>
    

    <VWindow
      v-model="activeTab"
      class="mt-5 disable-tab-transition"
      :touch="false"
    >
      <!-- Account -->
      <VWindowItem value="account">
        <AccountSettingsAccount />
      </VWindowItem>

      <!-- Security -->
      <VWindowItem value="security">
        <AccountSettingsSecurity />
      </VWindowItem>

      <!-- Notification -->
      <VWindowItem value="notification">
        <AccountSettingsNotification />
      </VWindowItem>
    </VWindow>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '~/composables/useAuth'

import AccountSettingsAccount from '../views/pages/account-settings/AccountSettingsAccount.vue'
import AccountSettingsNotification from '../views/pages/account-settings/AccountSettingsNotification.vue'
import AccountSettingsSecurity from '../views/pages/account-settings/AccountSettingsSecurity.vue'

const route = useRoute()

const activeTab = ref(route.params.tab)

// tabs
const tabs = [
  { title: 'Account', icon: 'ri-group-line', tab: 'account' },
  { title: 'Security', icon: 'ri-lock-line', tab: 'security' },
  { title: 'Notifications', icon: 'ri-notification-3-line', tab: 'notification' },
]

const { user } = useAuth() as {
  user: Ref<{ id: string; username: string; role: string } | null>
}
const currentUserId = user.value?.id
const form = ref({
  username: '',
  role: '',
  password: ''
})


onMounted(async () => {
  try {
    const data = await useAuthFetch<{ username: string; role: string }>(
      `http://localhost:3030/users/${currentUserId}`
    )
    form.value.username = data.username
    form.value.role = data.role
  } catch (err) {
    console.error('Error fetching user data:', err)
  }
})
</script>
