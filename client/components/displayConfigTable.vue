<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '~/composables/Authentication/useAuth'
import { useDisplayConfigService, type DisplayConfig } from '~/composables/DisplayConfigure/useDisplayConfig'
import { useDisplayConfigureValidator } from '~/composables/validators/useDisplayConfigureValidator'

// ✅ Nuxt router
const router = useRouter()

// ✅ Services & composables
const { displayConfigs, loading, error, notAuthorized, fetchDisplayConfig, createDisplayConfig, updateDisplayConfig } = useDisplayConfigService()
const { user, token } = useAuth()
const { validateDisplayConfigureForm } = useDisplayConfigureValidator()

// Snackbar state
const snackbar = ref({
  show: false,
  message: '',
  color: 'error',
  timeout: 4000
})

// Dialog + form state
const dialogVisible = ref(false)
const isEditing = ref(false)
const editingId = ref<number | null>(null)

const formDisplayConfig = ref<Omit<DisplayConfig, 'id' | 'createdAt' | 'updatedAt'>>({
  displaySection: '',
  height: '',
  width: '',
  priority: 0
})

// Open new config dialog
const openCreateDialog = () => {
  resetForm()
  isEditing.value = false
  editingId.value = null
  dialogVisible.value = true
}

// Open edit dialog with existing data
const openEditDialog = (config: DisplayConfig) => {
  isEditing.value = true
  editingId.value = config.id
  formDisplayConfig.value = {
    displaySection: config.displaySection,
    height: config.height,
    width: config.width,
    priority: config.priority
  }
  dialogVisible.value = true
}

// Reset form to defaults
const resetForm = () => {
  formDisplayConfig.value = {
    displaySection: '',
    height: '',
    width: '',
    priority: 0
  }
}

// Handle submit
const submitForm = async () => {

  formDisplayConfig.value.priority = Number(formDisplayConfig.value.priority)
  const { valid, errors } = validateDisplayConfigureForm(formDisplayConfig.value)
  

  const isDuplicatePriority = displayConfigs.value.some(config => {
  
    return config.priority === formDisplayConfig.value.priority && config.id !== editingId.value;
  });

  if (isDuplicatePriority) {
    snackbar.value = {
      show: true,
      message: 'Priority value must be unique.',
      color: 'error',
      timeout: 3000
    };
    return;
  }

  if (!valid) {
    const message = errors
      .map(err => {
        if (err.message) return err.message
        if (err.instancePath && err.message)
          return `${err.instancePath.replace('/', '')} ${err.message}`
        return 'Validation error'
      })
      .join(', ')

    snackbar.value = {
      show: true,
      message: message || 'Invalid form data',
      color: 'error',
      timeout: 6000
    }
    return
  }

  let config: DisplayConfig | null = null

  

  if (isEditing.value && editingId.value !== null) {
    config = await updateDisplayConfig(editingId.value, formDisplayConfig.value)
  } else {
    config = await createDisplayConfig(formDisplayConfig.value)
  }

  if (config) {
    await fetchDisplayConfig()
    dialogVisible.value = false
    resetForm()
  }
}

// ✅ Use Nuxt's client-side mounted hook
onMounted(async () => {
  await fetchDisplayConfig()

  if (error.value === 'Not logged in') {
    router.push('/login')
  }
})
</script>

<template>
  <VContainer class="mt-16">
    <VCard>
      <VCardTitle class="d-flex justify-space-between align-center mb-4 ms-2">
        <span class="text-h5 font-weight-bold">Display Configuration</span>
        <VBtn
  color="black"
  style="letter-spacing: normal; padding: 8px 20px; min-width: 140px; font-weight: 500;"
  class="ms-2 mb-2"
  @click="openCreateDialog"
>
  Add Display Config
</VBtn>
      </VCardTitle>

      <VCardText>
        <VProgressLinear indeterminate v-if="loading" />
        <VAlert type="error" v-if="error">{{ error }}</VAlert>
        <VAlert type="error" v-if="notAuthorized">
          You are not authorized to view this page.
        </VAlert>

        <VTable v-if="!loading && !error && !notAuthorized">
          <thead>
            <tr>
              <th>ID</th>
              <th>Display Section</th>
              <th>Height</th>
              <th>Width</th>
              <th>Priority</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in displayConfigs" :key="item.id">
              <td>{{ item.id }}</td>
              <td>{{ item.displaySection }}</td>
              <td>{{ item.height }}</td>
              <td>{{ item.width }}</td>
              <td>{{ item.priority }}</td>
              <td>{{ new Date(item.created_at).toLocaleString() }}</td>
              <td>
                <VBtn icon="mdi-pencil" size="small" color="white" variant="flat" @click="openEditDialog(item)" />
              </td>
            </tr>
          </tbody>
        </VTable>
      </VCardText>
    </VCard>

    <!-- Create/Edit Dialog -->
    <VDialog v-model="dialogVisible" max-width="600px">
      <VCard>
        <VCardTitle class="text-h5 font-weight-bold mb-2 ma-2">
          {{ isEditing ? 'Edit Display Config' : 'Create New Display Config' }}
        </VCardTitle>
        <VCardText>
          <div class="d-flex flex-column gap-4">
            <VTextField label="Display Section" v-model="formDisplayConfig.displaySection" outlined />
            <VTextField label="Height" v-model="formDisplayConfig.height" outlined />
            <VTextField label="Width" v-model="formDisplayConfig.width" outlined />
            <VTextField label="Priority" v-model="formDisplayConfig.priority" outlined type="number" />
          </div>
        </VCardText>

        <VCardActions>
          <VSpacer />
          <VBtn style="letter-spacing: normal" variant="flat" color="white" @click="dialogVisible = false">Cancel</VBtn>
          <VBtn style="background-color: #8C57FF;" color="white" @click="submitForm">
            {{ isEditing ? 'Update' : 'Save' }}
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>

    <!-- Snackbar -->
    <VSnackbar
      v-model="snackbar.show"
      :timeout="snackbar.timeout"
      :color="snackbar.color"
      location="top"
      elevation="6"
    >
      {{ snackbar.message }}
      <template #actions>
        <VBtn style="letter-spacing: normal" variant="flat" color="white"  icon="mdi-window-close" @click="snackbar.show = false"></VBtn>
      </template>
    </VSnackbar>
  </VContainer>
</template>
