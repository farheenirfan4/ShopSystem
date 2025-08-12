<template>
  <v-container class="mt-8">
    <v-card>
      <v-card-title>
        Offers List
        <v-spacer />
        <!-- Add Offer Button -->
        <v-btn color="green" @click="openAddDialog">
          Add Offer
        </v-btn>
        <v-btn color="primary" @click="fetchOffers">
          Refresh
        </v-btn>
      </v-card-title>

      <v-data-table
        :headers="headers"
        :items="offersWithStatus"
        :loading="loading"
        item-value="id"
        class="elevation-1"
      >
        <template #item.title="{ item }">
          <a href="javascript:void(0)" @click="openUserDialog(item.personasId)">
            {{ item.title }}
          </a>
        </template>
        <!-- Status Chip with dynamic color -->
        <template #item.status="{ item }">
          <v-chip text-color="white" size="small" :color="getStatusColor(item.status)">
            {{ item.status }}
          </v-chip>
        </template>

        <!-- Actions -->
        <template #item.actions="{ item }">
          <v-btn icon color="primary" @click="editOffer(item)">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn icon color="red" @click="deleteOffer(item.id)">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>

    <!-- Add/Edit Offer Dialog -->
    <v-dialog v-model="isAddDialogOpen" max-width="600" persistent>
      <v-card>
        <!-- Title -->
        <v-card-title class="text-h4 font-weight-bold pa-4">
          {{ editModel ? "Edit Offer" : "Add an Offer" }}
        </v-card-title>

        <v-card-text>
          <!-- Row 1: Title + Price -->
          <v-row>
            <v-col cols="6">
              <v-text-field label="Title" v-model="newOffer.title" outlined></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field label="Price" type="number" v-model="newOffer.price" outlined></v-text-field>
            </v-col>
          </v-row>

          <!-- Row 2: Description -->
          <v-row>
            <v-col cols="12">
              <v-textarea label="Description" v-model="newOffer.description" outlined></v-textarea>
            </v-col>
          </v-row>

          <!-- Row 3: Discount + Promotional Tags -->
          <v-row>
            <v-col cols="6">
              <v-text-field label="Discount (%)" type="number" v-model="newOffer.discountPercentage" outlined></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                label="Promotional Tags (comma-separated)"
                v-model="newOffer.promotionalTags"
                outlined
              ></v-text-field>
            </v-col>
          </v-row>

          <!-- Row 4: Product -->
          <v-row>
            <v-col cols="12">
              <v-text-field label="Product" v-model="newOffer.product" outlined></v-text-field>
            </v-col>
          </v-row>

          <!-- Row 5: Repeat Patterns + Details -->
          <v-row>
            <v-col cols="6">
              <v-select
                label="Repeat Patterns"
                v-model="newOffer.repeatPatterns"
                :items="['none', 'daily', 'weekly', 'monthly']"
                outlined
              ></v-select>
            </v-col>
            <v-col cols="6" v-if="newOffer.repeatPatterns !== 'none'">
              <v-select
                label="Repeat Details"
                v-model="newOffer.repeatDetails"
                :items="repeatDetailsOptions"
                outlined
                multiple
              ></v-select>
            </v-col>
          </v-row>

          <!-- Row 6: Persona + Display Config -->
          <v-row>
            <v-col cols="6">
              <v-select
                :items="personaIds"
                v-model="newOffer.personasId"
                label="Select Persona"
                outlined
              />
            </v-col>
            <v-col cols="6">
              <v-select
                :items="displayConfigIds"
                v-model="newOffer.displayConfigureId"
                label="Select Display Config"
                outlined
              />
            </v-col>
          </v-row>

          <!-- Row 7: Dates -->
          <v-row>
            <v-col cols="6">
              <v-text-field
                label="Start Date UTC"
                type="datetime-local"
                :min="minDateTime"
                v-model="newOffer.startDateUTC"
                outlined
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                label="End Date UTC"
                type="datetime-local"
                v-model="newOffer.endDateUTC"
                :min="newOffer.startDateUTC || minDateTime"
                outlined
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>

        <v-divider></v-divider>

        <!-- Actions -->
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="isAddDialogOpen = false">Cancel</v-btn>
          <v-btn
            style="background-color: pink"
            color="white"
            class="ma-2 p-4"
            @click="saveOffer"
          >
            {{ editModel ? "Update" : "Save" }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Users Dialog -->
    <v-dialog v-model="isUserDialogOpen" max-width="800">
      <v-card>
        <v-card-title class="text-h4 font-weight-bold mb-2 ma-2">
          Users for Persona ID: {{ selectedPersonaId }}
        </v-card-title>
        <v-card-subtitle v-if="!userDialogLoading" class="ma-2 mb-2 font-weight-bold" style="color: black;">
          Total Users: {{ filteredUsers.length }}
        </v-card-subtitle>
        
        <v-card-text>
          <v-alert v-if="userDialogLoading" type="info" variant="tonal">
            Loading users...
          </v-alert>

          <v-alert v-if="!userDialogLoading && filteredUsers.length === 0" type="warning" variant="tonal">
            No users found for this persona.
          </v-alert>

          <v-data-table
            v-else
            :headers="[
              { title: 'User ID', key: 'id' },
              { title: 'Name', key: 'username' },
            ]"
            :items="filteredUsers"
            :items-per-page="5"
            class="elevation-1"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="isUserDialogOpen = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar for user feedback -->
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="snackbar.timeout"
    >
      {{ snackbar.text }}
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useOffers } from '../composables/Offers/useOffer';
import { useAuth } from '~/composables/Authentication/useAuth';
import { type Offer } from '~/schemas/offerSchema';
import { usePersonaService } from '~/composables/Persona/usePersonaService';
import { getOfferStatus, toUTCISOString, formatForDateTimeLocal, stringifyProductName, parseProductName } from '../utils/offerUtils';
import { useDisplayConfigService } from '~/composables/DisplayConfigure/useDisplayConfig';
import { fetchFilteredUsers, users as filteredUsers } from '../composables/PlayerData/usePlayerServices';

// Define composables
const { fetchDisplayConfig, getDisplayConfigIds } = useDisplayConfigService();
const { getPersonaIds, fetchPersonasConfig } = usePersonaService();
const { user } = useAuth();
const { offers, loading, fetchOffers, addOffer, updateOffer, deleteOffer } = useOffers();

// State management
const newOffer = ref<Partial<Offer>>({
  title: '',
  description: '',
  price: '',
  discountPercentage: '',
  promotionalTags: '',
  product: '',
  personasId: 0,
  displayConfigureId: 0,
  repeatPatterns: 'none',
  repeatDetails: [],
  startDateUTC: '',
  endDateUTC: '',
});
const isAddDialogOpen = ref(false);
const editModel = ref(false);
const editingOfferId = ref<string | null>(null);
const personaIds = ref<number[]>([]);
const displayConfigIds = ref<number[]>([]);
const isUserDialogOpen = ref(false);
const selectedPersonaId = ref<number | null>(null);
const userDialogLoading = ref(false);

const snackbar = ref({
  show: false,
  text: '',
  color: '',
  timeout: 3000,
});

const headers = [
  { title: "Title", key: "title" },
  { title: "Description", key: "description" },
  { title: "Price", key: "price" },
  { title: "Discount (%)", key: "discountPercentage" },
  { title: "Tags", key: "promotionalTags" },
  { title: "Product", key: "product" },
  { title: "Persona Id", key: "personasId" },
  { title: "Display Configure Id", key: "displayConfigureId" },
  { title: "Repeat Patterns", key: "repeatPatterns" },
  { title: "RepeatDetails", key: "repeatDetails" },
  { title: "Start Date", key: "startDateUTC" },
  { title: "End Date", key: "endDateUTC" },
  { title: "Is Active", key: "status" },
  { title: "Actions", key: "actions", sortable: false },
];

const minDateTime = computed(() => {
  const now = new Date();
  return new Date(now.getTime() - now.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);
});

// Computed properties
const offersWithStatus = computed(() => {
  return offers.value.map(offer => ({
    ...offer,
    status: getOfferStatus(offer),
    startDateUTC: new Date(offer.startDateUTC).toLocaleString(),
    endDateUTC: new Date(offer.endDateUTC).toLocaleString(),
  }));
});

const repeatDetailsOptions = computed(() => {
  const pattern = newOffer.value.repeatPatterns;
  if (pattern === 'weekly') {
    return ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  }
  if (pattern === 'monthly') {
    return [
      'january', 'february', 'march', 'april', 'may', 'june',
      'july', 'august', 'september', 'october', 'november', 'december'
    ];
  }
  return [];
});

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Active': return 'green';
    case 'Expired': return 'red';
    case 'Scheduled': return 'blue';
    default: return 'grey';
  }
};

// Dialog functions
const openAddDialog = () => {
  newOffer.value = {
    title: '',
    description: '',
    price: '',
    discountPercentage: '',
    promotionalTags: '',
    product: '',
    personasId: 0,
    displayConfigureId: 0,
    repeatPatterns: 'none',
    repeatDetails: [],
    startDateUTC: '',
    endDateUTC: '',
  };
  editModel.value = false;
  editingOfferId.value = null;
  isAddDialogOpen.value = true;
};

async function openUserDialog(personaId: number) {
  selectedPersonaId.value = personaId;
  isUserDialogOpen.value = true;
  userDialogLoading.value = true;
  try {
    await fetchFilteredUsers(personaId);
  } finally {
    userDialogLoading.value = false;
  }
}

function editOffer(item: Offer & { _id?: string }) {
  newOffer.value = {
    ...item,
    promotionalTags: Array.isArray(item.promotionalTags)
      ? item.promotionalTags.join(", ")
      : item.promotionalTags || '',
    product: parseProductName(item.product as string),
    startDateUTC: formatForDateTimeLocal(item.startDateUTC),
    endDateUTC: formatForDateTimeLocal(item.endDateUTC),
  };
  editingOfferId.value = item._id || item.id || null;
  editModel.value = true;
  isAddDialogOpen.value = true;
}

// API interactions
async function saveOffer() {
  try {
    if (newOffer.value.repeatPatterns === 'none') {
      newOffer.value.repeatDetails = [];
    }

    const offerToSave = {
      ...newOffer.value,
      createdBy: user.value?.username,
      updatedBy: user.value?.username,
      promotionalTags: typeof newOffer.value.promotionalTags === 'string'
        ? newOffer.value.promotionalTags.split(',').map(t => t.trim()).filter(Boolean)
        : newOffer.value.promotionalTags,
      personasId: +(newOffer.value.personasId || 0),
      displayConfigureId: +(newOffer.value.displayConfigureId || 0),
      startDateUTC: toUTCISOString(newOffer.value.startDateUTC),
      endDateUTC: toUTCISOString(newOffer.value.endDateUTC),
      product: stringifyProductName(newOffer.value.product as string)
    };

    if (editModel.value && editingOfferId.value) {
      const dataToUpdate = { ...offerToSave };
      delete (dataToUpdate as any).status;
      await updateOffer(editingOfferId.value, dataToUpdate as Offer);
      snackbar.value = { show: true, text: 'Offer updated successfully!', color: 'green', timeout: 3000 };
    } else {
      await addOffer(offerToSave as Offer);
      snackbar.value = { show: true, text: 'Offer added successfully!', color: 'green', timeout: 3000 };
    }

    isAddDialogOpen.value = false;
    editModel.value = false;
    editingOfferId.value = null;

  } catch (err: any) {
    console.error("Failed to save offer:", err);
    snackbar.value = { show: true, text: `Failed to save offer: ${err.message}`, color: 'red', timeout: 5000 };
  } finally {
    await fetchOffers();
  }
}

// Lifecycle hooks
onMounted(async () => {
  try {
    await Promise.all([
      fetchOffers(),
      fetchPersonasConfig(),
      fetchDisplayConfig()
    ]);
  } catch (err) {
    console.error("Error fetching initial data:", err);
    snackbar.value = { show: true, text: 'Error fetching initial data. Please check the console.', color: 'red', timeout: 5000 };
  }


  personaIds.value = getPersonaIds();
  displayConfigIds.value = getDisplayConfigIds();

  // Polling for offers
  let updateInterval = setInterval(fetchOffers, 60000); // Poll every 60 seconds
  onBeforeUnmount(() => clearInterval(updateInterval));
});
</script>
