<script setup lang="ts">
import { ref, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '~/composables/Authentication/useAuth'
import { usePersonaService, type PersonaConfig } from '~/composables/Persona/usePersonaService'
import { usePersonaValidator } from '~/composables/validators/usePersonaValidator'

const router = useRouter()
const { personasConfig, loading, error, notAuthorized, fetchPersonasConfig, createPersona, updatePersona } = usePersonaService()
const { user, token } = useAuth()
const { validatePersonaForm } = usePersonaValidator()

// Dialog + form state
const dialogVisible = ref(false)
const isEditing = ref(false)
const editingId = ref<number | null>(null)

const formPersona = ref<Omit<PersonaConfig, 'id' | 'createdAt' | 'updatedAt'>>({
  name: '',
  forPayingUsers: false,
  maxLevel: 0,
  minLevel: 0,
  maxMmr: 0,
  minMmr: 0,
  maxDeposits: 0,
  minDeposits: 0
})

const validationErrors = ref<string[]>([])
const snackbar = ref({ show: false, text: '', color: 'error' })

function showSnackbar(message: string) {
  snackbar.value = { show: true, text: message, color: 'error' }
}

const openCreateDialog = () => {
  resetForm()
  isEditing.value = false
  editingId.value = null
  dialogVisible.value = true
}

const openEditDialog = (persona: PersonaConfig) => {
  isEditing.value = true
  editingId.value = persona.id
  formPersona.value = {
    name: persona.name,
    forPayingUsers: persona.forPayingUsers,
    maxLevel: persona.maxLevel,
    minLevel: persona.minLevel,
    maxMmr: persona.maxMmr,
    minMmr: persona.minMmr,
    maxDeposits: persona.maxDeposits,
    minDeposits: persona.minDeposits
  }
  dialogVisible.value = true
}

const resetForm = () => {
  formPersona.value = {
    name: '',
    forPayingUsers: false,
    maxLevel: 0,
    minLevel: 0,
    maxMmr: 0,
    minMmr: 0,
    maxDeposits: 0,
    minDeposits: 0
  }
}

const submitForm = async () => {
  validationErrors.value = []

  // Validate form data before submit
  const { valid, errors } = validatePersonaForm(formPersona.value)
  if (!valid) {
    const errorMessages = (errors || []).map(e => e.message || "Invalid field").join(", ")
    showSnackbar(errorMessages)
    return
  }

  let persona: PersonaConfig | null = null

  if (isEditing.value && editingId.value !== null) {
    persona = await updatePersona(editingId.value, formPersona.value)
  } else {
    persona = await createPersona(formPersona.value)
  }

  if (persona) {
    await fetchPersonasConfig()
    dialogVisible.value = false
    resetForm()
  }
}

// ✅ Fetch data with SSR support
await useAsyncData('personas', async () => {
  await fetchPersonasConfig()
  if (error.value === 'Not logged in') {
    router.push('/login')
  }
  return personasConfig.value
})
</script>

<template>
  <VContainer class="mt-8">
    <VCard>
      <VCardTitle class="d-flex justify-space-between align-center">
        <span class="text-h5 font-weight-bold mb-4 ma-2">Personas Configuration</span>
        <VBtn
          color="black"
          style="letter-spacing: normal; padding: 8px 20px; min-width: 140px; font-weight: 500;"
          class="ms-2 mb-2"
          @click="openCreateDialog"
       >
  Add Persona
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
              <th>Name</th>
              <th>Paying Users</th>
              <th>Level Range</th>
              <th>MMR Range</th>
              <th>Deposit Range</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in personasConfig" :key="item.id">
              <td>{{ item.id }}</td>
              <td>{{ item.name }}</td>
              <td>{{ item.forPayingUsers ? 'Yes' : 'No' }}</td>
              <td>{{ item.minLevel }} - {{ item.maxLevel }}</td>
              <td>{{ item.minMmr }} - {{ item.maxMmr }}</td>
              <td>{{ item.minDeposits }} - {{ item.maxDeposits }}</td>
              <td>{{ new Date(item.createdAt).toLocaleString() }}</td>
              <td>
                <VBtn icon="mdi-pencil" size="small" color="white" variant="flat" @click="openEditDialog(item)" />
              </td>
            </tr>
          </tbody>
        </VTable>
      </VCardText>
    </VCard>

    <!-- Create/Edit Persona Dialog -->
    <VDialog v-model="dialogVisible" max-width="600px">
  <VCard>
    <VCardTitle class="text-h5 font-weight-bold mb-2 ma-2">
      {{ isEditing ? 'Edit Persona' : 'Create New Persona' }}
    </VCardTitle>
    <VCardText>
      <VTextField label="Name" v-model="formPersona.name" outlined dense />
      <VSwitch label="For Paying Users"
  v-model="formPersona.forPayingUsers"
  :color="formPersona.forPayingUsers ? 'black' : undefined"
  dense />
      <VRow dense>
        <VCol cols="6" class="pa-1">
          <VTextField label="Min Level" type="number" v-model.number="formPersona.minLevel" outlined dense />
        </VCol>
        <VCol cols="6" class="pa-1">
          <VTextField label="Max Level" type="number" v-model.number="formPersona.maxLevel" outlined dense />
        </VCol>
      </VRow>
      <VRow dense>
        <VCol cols="6" class="pa-1">
          <VTextField label="Min MMR" type="number" v-model.number="formPersona.minMmr" outlined dense />
        </VCol>
        <VCol cols="6" class="pa-1">
          <VTextField label="Max MMR" type="number" v-model.number="formPersona.maxMmr" outlined dense />
        </VCol>
      </VRow>
      <VRow dense>
        <VCol cols="6" class="pa-1">
          <VTextField label="Min Deposits" type="number" v-model.number="formPersona.minDeposits" outlined dense />
        </VCol>
        <VCol cols="6" class="pa-1">
          <VTextField label="Max Deposits" type="number" v-model.number="formPersona.maxDeposits" outlined dense />
        </VCol>
      </VRow>
    </VCardText>
    <VCardActions>
      <VSpacer />
      <VBtn style="letter-spacing: normal" variant="flat" color="white" @click="dialogVisible = false">Cancel</VBtn>
      <VBtn style="letter-spacing: normal" color="white" @click="submitForm">
        {{ isEditing ? 'Update' : 'Save' }}
      </VBtn>
    </VCardActions>
  </VCard>
</VDialog>


    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      timeout="4000"
      location="top right"
    >
      {{ snackbar.text }}
    </v-snackbar>
  </VContainer>
</template>

<style scoped>
.square-btn {
  border-radius: 8px;
  width: 48px;
  height: 48px;
  min-width: 36px;
  min-height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px;
}
</style>
