<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted  } from "vue";
import { useOffers } from "../composables/Offers/useOffer";
import type { Offer } from "../schemas/offerSchema";
import { fetchFilteredUsers, users as filteredUsers } from "../composables/PlayerData/usePlayerServices"; 
import { formatForDateTimeLocal, toUTCISOString } from "../utils/offerUtils";
import { parseProductName, stringifyProductName } from "../utils/offerUtils";
import { useAuth } from '../composables/Authentication/useAuth';
import { usePersonaService } from '../composables/Persona/usePersonaService'
import { useDisplayConfigService } from '../composables/DisplayConfigure/useDisplayConfig'
import { getOfferStatus } from '../utils/offerUtils';
import { useOfferValidator } from '../composables/validators/useOfferValidator';
import { VContainer } from "vuetify/components";
//import { RecycleScroller } from 'vue-virtual-scroller';

const { validateOfferForm } = useOfferValidator();

const { fetchDisplayConfig, getDisplayConfigIds } = useDisplayConfigService()
// assuming fetchFilteredUsers is exported from your Persona composable

const isUserDialogOpen = ref(false);
const selectedPersonaId = ref<number | null>(null);
const userDialogLoading = ref(false);

const { user } = useAuth();


const { offers, loading, error, fetchOffers, deleteOffer: removeOffer,addOffer,updateOffer } = useOffers();
const newOffer= ref<Partial<Offer>>({
  id:'',
  title: '',
  description: '',
  price: '',
  discountPercentage: '',
  promotionalTags: '' as unknown as string[] | string,
  product: '',
  personasId : 0,
  displayConfigureId : 0,
  repeatPatterns : 'none',
  repeatDetails : [],
  startDateUTC : '',
  endDateUTC : '',
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

const isAddDialogOpen = ref(false);
const editModel = ref(false)
const editingOfferId = ref<string | null>(null)
const { getPersonaIds, fetchPersonasConfig } = usePersonaService()
const personaIds = ref<string[] | number[]>([])

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


const now = new Date();
const minDateTime = ref(
  new Date(now.getTime() - now.getTimezoneOffset() * 60000) // adjust to local time
    .toISOString()
    .slice(0, 16) // "YYYY-MM-DDTHH:mm"
);

// Delete offer action
async function deleteOffer(item: any) {
  if (confirm(`Are you sure you want to delete "${item.title}"?`)) {
    await removeOffer(item._id || item.id);
    await fetchOffers(); // <-- add this to refresh the list from the backend
  }
}

const displayConfigIds = ref<number[]>([])

const offersWithStatus = computed(() => {
  // Use the offers ref to get the current list of offers
  return offers.value.map(offer => {
    return {
      ...offer,
      // Use the imported function to get the correct status
      status: getOfferStatus(offer)
    };
  });
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

onMounted(() => {
  fetchOffers();
});


async function saveOffer() {
  try {
    if (newOffer.value.repeatPatterns === 'none' ) {
      newOffer.value.repeatDetails = []
    }

   const offerToSave = {
      ...newOffer.value,
      createdBy: user.value?.username ,
      updatedBy: user.value?.username ,
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
      // 🔹 Create a new object for the update payload
      const dataToUpdate = { ...offerToSave };

      // ❗ Remove the id and status fields from the payload
      delete dataToUpdate.id;
      delete (dataToUpdate as any).status;

      await updateOffer(editingOfferId.value, dataToUpdate as Offer);
      
      alert("Offer updated successfully!");
    } else {
      // 🔹 Add offer
      await addOffer(offerToSave)
      alert("Offer added successfully!");
    }

    await fetchOffers();

    // Reset form
    isAddDialogOpen.value = false
    editModel.value = false
    editingOfferId.value = null

  } catch (err) {
    console.error("Failed to save offer:", err)
  }
}

function editOffer(item: Offer & { _id?: string }) {
  newOffer.value = {
    ...item,
    promotionalTags: Array.isArray(item.promotionalTags)
      ? item.promotionalTags.join(", ")
      : item.promotionalTags || '',
    product: parseProductName(item.product), // ✅ Always just the name
    startDateUTC: formatForDateTimeLocal(item.startDateUTC),
    endDateUTC: formatForDateTimeLocal(item.endDateUTC),
  };
  editingOfferId.value = item._id || item.id || null;
  editModel.value = true;
  isAddDialogOpen.value = true;
}

onMounted(async () => {
  await fetchPersonasConfig()
  personaIds.value = getPersonaIds()
  await fetchDisplayConfig()
  displayConfigIds.value = getDisplayConfigIds()
})

let updateInterval: number | NodeJS.Timeout | undefined;

onMounted(async () => {
  // Fetch initial offers
  await fetchOffers();

  // Set up a timer to update the offers' status every minute
  updateInterval = setInterval(() => {
    // A simple way to trigger reactivity is to re-assign the offers list
    offers.value = [...offers.value];
  }, 50000); // 60000 milliseconds = 1 minute
});

onUnmounted(() => {
  // Clear the timer to prevent memory leaks when the component is destroyed
  if (updateInterval) {
    clearInterval(updateInterval);
  }
});

</script>


<template>
  <div class="pa-4">
    <!-- Heading -->
    

    <!-- Loading / Error Alerts -->
    <v-alert v-if="loading" type="info" variant="tonal" class="mb-3">
      Loading offers...
    </v-alert>
    <v-alert v-if="error" type="error" variant="tonal" class="mb-3">
      {{ error }}
    </v-alert>


    <VContainer style="background-color: white; border-radius: 10px;" >
      <div class="d-flex justify-space-between align-center mb-4">
      <h1 class="font-weight-bold mb-2">Offers</h1>
      <v-btn
  color="primary"
  density="compact"
  class="square-btn"
  @click="
    newOffer = {
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
    editModel = false;
    editingOfferId = null;
    isAddDialogOpen = true;
  "
>
  <v-icon>ri-add-large-fill</v-icon>
</v-btn>
    </div>

    <!-- Offers Table -->
    <v-data-table
      v-if="offersWithStatus.length"
      :headers="headers"
      :items="offersWithStatus"
      :items-per-page="5"
      class="elevation-1 custom-header"
      
    >

    <template #item.title="{ item }">
  <a href="javascript:void(0)" @click="openUserDialog(item.personasId)">
    {{ item.title }}
  </a>
</template>
      <!-- Custom cell for promotionalTags -->
      <template #item.promotionalTags="{ item }">
        <v-chip-group column>
          <v-chip
            v-for="(tag, index) in item.promotionalTags"
            :key="index"
            size="small"
            color="primary"
            class="ma-1"
          >
            {{ tag }}
          </v-chip>
        </v-chip-group>
      </template>

      <!-- Actions column -->
      <template #item.actions="{ item }">
        <v-btn
          size="small"
          color="black"
          icon="ri-edit-line"
          variant="text"
          @click="editOffer(item)"
        ></v-btn>
        <v-btn
          size="small"
          color="error"
          icon="ri-delete-bin-5-line"
          variant="text"
          @click="deleteOffer(item)"
        ></v-btn>
      </template>

      <template #item.startDateUTC="{ item }">
  <v-chip  size="small">
    {{ new Date(item.startDateUTC).toLocaleString() }}
  </v-chip>
</template>

<template #item.endDateUTC="{ item }">
  <v-chip  size="small">
    {{ new Date(item.endDateUTC).toLocaleString() }}
  </v-chip>
</template>
    </v-data-table>

    <!-- Empty State -->
    <v-alert
      v-else-if="!loading"
      type="warning"
      variant="tonal"
      class="mt-3"
    >
      No offers found.
    </v-alert>

    </VContainer>
    <!-- Header with Add Button -->
    

    <v-dialog v-model="isAddDialogOpen" max-width="600" persistent>
  <v-card>
    <!-- Title -->
    <v-card-title class="text-h4 font-weight-bold pa-4">
  {{ editModel ? "Edit Offer" : "Add an Offer" }}
</v-card-title>

    <v-card-text>
      <!-- Row 1: Title + Price -->
      <v-row >
        <v-col cols="6">
          <v-text-field label="Title" v-model="newOffer.title" outlined></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field label="Price" type="number" v-model="newOffer.price" outlined></v-text-field>
        </v-col>
      </v-row>

      <!-- Row 2: Description -->
      <v-row >
        <v-col cols="12">
          <v-textarea label="Description" v-model="newOffer.description" outlined ></v-textarea>
        </v-col>
      </v-row>


      <!-- Row 3: Discount + Promotional Tags -->
      <v-row >
        <v-col cols="6">
          <v-text-field label="Discount (%)" type="number" v-model="newOffer.discountPercentage" outlined ></v-text-field>
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
      <v-row >
        <v-col cols="12">
          <v-text-field label="Product" v-model="newOffer.product" outlined></v-text-field>
        </v-col>
      </v-row>
      <v-row >
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

      <v-row >
        <v-col cols="6">
          <v-select
  :items="personaIds"
  v-model="newOffer.personasId"
  label="Select Persona"
  outlined
  :return-object="false" 
  
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


  </div>
</template>

<style scoped>
.custom-header th {
  background-color: #1976d2 !important;
  color: white !important;
}

.square-btn {
  min-width: 40px;
  height: 40px;
  border-radius: 20;
  padding: 12px;
}
</style>



