<script setup lang="ts">
// ✅ Import Nuxt auto-imported composables from #imports
import { ref, computed, onMounted } from '#imports'

// ✅ Import avatars (put them inside ~/assets/images/avatars or /public/images/avatars)
import avatar1 from '~/assets/images/avatars/avatar-1.png'
import avatar2 from '~/assets/images/avatars/avatar-2.png'
import avatar3 from '~/assets/images/avatars/avatar-3.png'
import avatar4 from '~/assets/images/avatars/avatar-4.png'
import avatar5 from '~/assets/images/avatars/avatar-5.png'
import avatar6 from '~/assets/images/avatars/avatar-6.png'
import avatar7 from '~/assets/images/avatars/avatar-7.png'
import avatar8 from '~/assets/images/avatars/avatar-8.png'

// ✅ Import your validator composable
import { useUserValidator } from '~/composables/validators/useUserValidator'

// ✅ Import everything from your user composable
import {
  userData,
  fetchUsers,
  createUser,
  updateUser,
  deleteUser
} from '~/composables/users/useUser'

// Type definition
interface User {
  id: string
  email: string
  roles: string[]
  username: string
}

const headers = [
  { title: 'User', key: 'username' },
  { title: 'Email', key: 'email' },
  { title: 'Role', key: 'roles' },
]

const { validateUserForm } = useUserValidator()

// Snackbar
const snackbar = ref({ show: false, text: '', color: 'error' })
const showMessage = (text: string, color: 'success' | 'error' = 'error') => {
  snackbar.value = { show: true, text, color }
}

// Dialogs
const isAddDialogOpen = ref(false)
const isEditDialogOpen = ref(false)

// New & Edit form state
const newUser = ref({ username: '', email: '', password: '', roles: [] as string[] })
const editUser = ref<User>({ id: '', email: '', roles: [], username: '' })

// Handlers
const handleAddUser = async () => {
  const { valid, errors } = validateUserForm({
    id: '',
    username: newUser.value.username,
    email: newUser.value.email,
    roles: newUser.value.roles
  })

  if (!valid) {
    showMessage(errors.map(e => e.message).join(', '))
    return
  }

  if (!newUser.value.username || !newUser.value.email || !newUser.value.password) {
    return showMessage('Please fill all required fields.')
  }

  await createUser(newUser.value)

  isAddDialogOpen.value = false
  newUser.value = { username: '', email: '', password: '', roles: [] }
}

const openEditDialog = (user: User) => {
  editUser.value = { ...user }
  isEditDialogOpen.value = true
}

const handleUpdateUser = async () => {
  const { valid, errors } = validateUserForm({
    id: editUser.value.id,
    username: editUser.value.username,
    email: editUser.value.email,
    roles: editUser.value.roles
  })

  if (!valid) {
    showMessage(errors.map(e => e.message).join(', '))
    return
  }

  const { id, username, email, roles } = editUser.value
  await updateUser(id, { username, email, roles })

  isEditDialogOpen.value = false
}

const handleDeleteUser = async (id: string) => {
  if (!confirm('Are you sure you want to delete this user?')) return
  await deleteUser(id)
}

// Avatars
const avatars = [avatar1, avatar2, avatar3, avatar4, avatar5, avatar6, avatar7, avatar8]
const mappedUserData = computed(() => {
  if (!Array.isArray(userData.value)) return []
  return userData.value.map(user => ({
    ...user,
    avatar: avatars[Math.floor(Math.random() * avatars.length)]
  }))
})

const headersWithActions = [
  { title: 'Avatar', key: 'avatar', sortable: false },
  ...headers,
  { title: 'Actions', key: 'actions', sortable: false }
]

// ✅ Fetch users when page loads (Nuxt auto-imported onMounted)
onMounted(async () => {
  await fetchUsers()
})
</script>

<template>
  <VCard class="mt-8">
    <VCardTitle class="text-h4 font-weight-bold mb-4">CMS User Management</VCardTitle>
    
    <VDataTable
      :headers="headersWithActions"
      :items="mappedUserData"
      item-value="id"
      class="text-no-wrap"
    >
      <!-- Avatar -->
      <template #item.avatar="{ item }">
        <VAvatar size="36" :variant="!item.avatar ? 'tonal' : undefined" :color="!item.avatar ? 'primary' : undefined">
          <VImg v-if="item.avatar" :src="item.avatar" />
        </VAvatar>
      </template>

      <!-- Actions -->
      <template #item.actions="{ item }">
        <VBtn icon="mdi-pencil" size="small" color="white" variant="flat" @click="openEditDialog(item)" />
        <VBtn icon="mdi-delete-outline" size="small" color="error" variant="flat" @click="handleDeleteUser(item.id)" />
      </template>
    </VDataTable>

    <!-- Add User Button -->
    <VCardActions>
      <VBtn style="background-color: #8C57FF;" color="white" class="ms-2 mb-2" @click="isAddDialogOpen = true">
        Add New User
      </VBtn>
    </VCardActions>

    <!-- Add User Dialog -->
    <VDialog v-model="isAddDialogOpen" max-width="500px">
      <VCard>
        <VCardTitle class="text-h4 font-weight-bold mb-4 ma-2">Add User</VCardTitle>
        <VCardText>
          <div class="d-flex flex-column gap-4">
            <VTextField v-model="newUser.username" label="Username" required />
            <VTextField v-model="newUser.email" label="Email" required />
            <VTextField v-model="newUser.password" label="Password" type="password" required />
            <VSelect v-model="newUser.roles" :items="['admin', 'editor', 'viewer']" label="Role" multiple />
          </div>
        </VCardText>
        <VCardActions>
          <VBtn @click="isAddDialogOpen = false">Cancel</VBtn>
          <VBtn style="background-color: #8C57FF;" color="white" @click="handleAddUser">Save</VBtn>
        </VCardActions>
      </VCard>
    </VDialog>

    <!-- Edit User Dialog -->
    <VDialog v-model="isEditDialogOpen" max-width="500px">
      <VCard>
        <VCardTitle class="text-h4 font-weight-bold mb-4 ma-2">Edit User</VCardTitle>
        <VCardText>
          <div class="d-flex flex-column gap-4">
            <VTextField v-model="editUser.username" label="Username" required />
            <VTextField v-model="editUser.email" label="Email" required />
            <VSelect v-model="editUser.roles" :items="['admin', 'editor', 'viewer']" label="Role" multiple />
          </div>
        </VCardText>
        <VCardActions>
          <VBtn @click="isEditDialogOpen = false">Cancel</VBtn>
          <VBtn style="background-color: #8C57FF;" color="white" @click="handleUpdateUser">Update</VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  </VCard>

  <!-- Snackbar -->
  <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="3000" location="top right">
    {{ snackbar.text }}
  </v-snackbar>
</template>
