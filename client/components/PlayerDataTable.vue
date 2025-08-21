<template>

  <v-card class="pa-4 mb-8 elevation-1 rounded-xl">
    <v-row class="py-4 px-2 mt-16" align="center" dense>
      <!-- Filter: IsBot -->
      <v-col cols="12" md="3">
        <v-select v-model="selectedIsBotValue" :items="isBotOptions" label="Is Bot" clearable density="comfortable"
          variant="outlined" class="rounded-xl" color="primary" prepend-inner-icon="mdi-robot"
          @update:modelValue="debouncedFetchData" />
      </v-col>

      <!-- Filter: Location -->
      <v-col cols="12" md="3">
        <v-select v-model="selectedLocationValue" :items="locationOptions" label="Location" clearable
          density="comfortable" variant="outlined" class="rounded-xl" color="primary"
          prepend-inner-icon="mdi-map-marker" @update:modelValue="debouncedFetchData" />
      </v-col>

      <!-- Filter: Created Date -->
      <v-col cols="12" md="3">
        <v-text-field v-model="selectedDate" label="Created Date" type="date" clearable density="comfortable"
          variant="outlined" class="rounded-xl" color="primary" prepend-inner-icon="mdi-calendar"
          @update:modelValue="fetchData" />
      </v-col>

      <!-- Search: Username -->
      <v-col cols="12" md="3">
        <v-text-field v-model="searchUsername" label="Search Username" clearable density="comfortable"
          variant="outlined" class="rounded-xl" color="primary" prepend-inner-icon="mdi-account-search"
          @update:modelValue="fetchData" />
      </v-col>
    </v-row>
  </v-card>
  <v-container class="pa-0">
    <v-card class="pa-4 rounded-xl" style="background-color: white;">
      <v-card-title>
        <v-row align="center" justify="space-between" class="ma-0">
          <span class="text-h5 font-weight-bold">Players List</span>
          <v-btn icon @click="refreshTable">
            <v-icon>mdi-refresh</v-icon>
          </v-btn>
        </v-row>
      </v-card-title>


      <v-data-table :headers="headers" :items="filteredUsers" :loading="loading" class="elevation-1" :sort-by="sortBy"
        :multi-sort="true" @update:sort-by="handleSort">
        <template #item.actions="{ item }">

          <v-icon small @click="showDetails(item)" class="cursor-pointer">
            mdi-eye
          </v-icon>
          <v-icon v-if="canEdit" small color="" class="cursor-pointer" @click="openEditDialog(item)">
            mdi-pencil
          </v-icon>
          <!---<pre>{{ JSON.stringify(item.metadata, null, 2) }}</pre>-->
        </template>


      </v-data-table>
      <!-- User Details Dialog -->
     <v-dialog v-model="dialog" max-width="700">
  <v-card>
    <v-card-title>User Details</v-card-title>
    <v-divider></v-divider>

    <v-card-text>
      <!-- Basic Info -->
      <v-row>
        <v-col cols="6">
          <strong>ID:</strong> {{ selectedUser?.id }}
        </v-col>
        <v-col cols="6">
          <strong>Username:</strong> {{ selectedUser?.username }}
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="6">
          <strong>Display Name:</strong> {{ selectedUser?.display_name }}
        </v-col>
        <v-col cols="6">
          <strong>Email:</strong> {{ selectedUser?.email }}
        </v-col>
      </v-row>

      <!-- Wallet -->
      <v-divider class="my-2"></v-divider>
      <h4>Wallet</h4>
      <v-row>
        <v-col cols="6"><strong>Cash:</strong> {{ selectedUser?.metadata.EarningData.CashEarned }}</v-col>
        <v-col cols="6"><strong>Coins:</strong> {{ selectedUser?.metadata.EarningData.Ranking }}</v-col>
      </v-row>
      <v-row>
        <v-col cols="6"><strong>Tickets:</strong> {{ selectedUser?.metadata.IsBotUser }}</v-col>
        <v-col cols="6"><strong>Bonus Cash:</strong> {{ selectedUser?.metadata.StataData?.WinRatio }}</v-col>
      </v-row>

      <!-- Deposit -->
      <v-divider class="my-2"></v-divider>
      <h4>Deposits</h4>
      <p><strong>Total Deposit:</strong> {{ selectedUser?.metadata.EarningData || "0" }}</p>

      <!-- Career Progress -->
      <v-divider class="my-2"></v-divider>
      <h4>Career Progress</h4>
      <v-row>
        <v-col cols="6"><strong>Level:</strong> {{ selectedUser?.metadata?.CareerProgressData?.Level }}</v-col>
        <v-col cols="6"><strong>XP:</strong> {{ selectedUser?.metadata?.CareerProgressData?.XP }}</v-col>
      </v-row>
    </v-card-text>

    <v-card-actions>
      <v-spacer />
      <v-btn @click="copyToClipboard" color="primary" variant="flat">Copy</v-btn>
      <v-btn @click="dialog = false" color="secondary" variant="tonal">Close</v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>

      <!-- Edit User Dialog -->
      <v-dialog v-model="editDialog" max-width="600">
        <v-card v-if="editUser && editUser.metadata?.CareerProgressData && editUser.metadata?.EarningData">
          <v-card-title>Edit User</v-card-title>
          <v-card-text>
            <v-form @submit.prevent="submitEdit">
              <v-text-field v-model="editUser.username" label="Username" required />
              <v-text-field v-model="editUser.email" label="Email" required />
              <v-text-field v-model="editUser.display_name" label="Display name" />
              <v-select v-model="editUser.location" :items="locationOptions" label="Location" required clearable />

              <v-text-field v-model.number="editUser.metadata.CareerProgressData.XP" label="XP" />
              <v-text-field v-model.number="editUser.metadata.CareerProgressData.Level" label="Level" />
              <v-text-field v-model.number="editUser.metadata.EarningData.Ranking" label="Ranking" />


            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn @click="editDialog = false">Cancel</v-btn>
            <v-btn color="primary" @click="submitEditWithValidation">Save</v-btn>
          </v-card-actions>
        </v-card>
        <v-alert v-if="validationErrors.length" type="error" density="compact" class="mt-2">
          {{ validationErrors[0] }}
        </v-alert>

      </v-dialog>


    </v-card>
  </v-container>
</template>


<script setup lang="ts">
import { onMounted } from 'vue'
import { usePlayerService } from '@/composables/usePlayerService'
import { usePlayerEditor } from '@/composables/usePlayerEditor'

//const router = useRouter()


import { ref } from 'vue'
import { useRouter } from 'vue-router'
import type { Player, SortItem } from '~/types/players'
import { editPlayerValidator } from '../schemas/editPlayerSchema'


const router = useRouter()
const { validate, validationErrors } = editPlayerValidator()

const props = defineProps<{
  canEdit?: boolean
}>()



// These are used in the template but missing from setup
const isBotOptions = ['true', 'false']
const locationOptions = ['USA', 'PK', 'CA', 'UK']

const headers = [
  { title: 'ID', value: 'id' },
  { title: 'Username', value: 'username' },
  { title: 'Display Name', value: 'display_name' },
  { title: 'Email', value: 'email' },
  { title: 'Location', value: 'location' },
  { title: 'XP', value: 'metadata.CareerProgressData.XP' },
  { title: 'Win Ratio', value: 'metadata.StataData.WinRatio' },
  { title: 'Total Tournaments', value: 'metadata.StatsData.TotalTournamentsPlayed' },
  { title: 'Ranking', value: 'metadata.EarningData.Ranking' },
  { title: 'Cash Earned', value: 'metadata.EarningData.CashEarned', sortable: true },
  { title: 'Level', value: 'metadata.CareerProgressData.Level', sortable: true },
  { title: 'Is Bot', value: 'metadata.IsBotUser' },
  { title: 'Create Time', value: 'create_time' },
  { title: 'Wallet Cash', value: 'wallet.Cash', sortable: true },
  { title: 'Wallet Coin', value: 'wallet.Coins', sortable: true },
  { title: 'Cash Deposit', value: 'deposit_amount', sortable: true },
  { title: 'Actions', value: 'actions', sortable: false }
]

// For viewing user details dialog
const dialog = ref(false)
const selectedUser = ref<Player | null>(null)

function submitEditWithValidation() {

  const isValid = validate(editUser.value)

  if (!isValid) {
    return
  }
  validationErrors.value = []
  //console.log('Validation passed, submitting...')
  submitEdit()

}

const copyToClipboard = () => {
  const json = JSON.stringify(selectedUser.value, null, 2)
  navigator.clipboard.writeText(json).then(() => {
    console.log('Copied to clipboard!')
  }).catch((err) => {
    console.error('Failed to copy:', err)
  })
}


const showDetails = (user: any) => {
  selectedUser.value = user
  dialog.value = true
}

// You are using this in the form
const editFormRef = ref()

const handleSort = (newSort: SortItem[]) => {
  sortBy.value = newSort
  //sort(newSort)
}

const {
  users, total, loading, searchUsername, selectedIsBotValue, selectedLocationValue, selectedDate,
  fetchData, filteredUsers, sortBy, debouncedFetchData, sort
} = usePlayerService()

const {
  editDialog, editUser, openEditDialog, submitEdit
} = usePlayerEditor(fetchData)

onMounted(fetchData)

function refreshTable() {
  fetchData()
}
</script>
