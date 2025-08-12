import { onMounted } from 'vue';
import { usePersonaService } from '../../composables/Persona/usePersonaService';
import { useRouter } from 'vue-router';
import { useAuth } from '../../composables/Authentication/useAuth';



const { user, token } = useAuth() 
// The base URL for your API endpoint
const API_URL = 'http://localhost:3030/players-data'; // Replace with your actual API endpoint

const {
  fetchPersonasConfig,
  loadPersonaDetails,
  forPayingUsers,
  maxLevel,
  minLevel,
  maxMmr,
  minMmr,
  maxDeposits,
  minDeposits
} = usePersonaService();

export const users = ref([]);
export const isLoading = ref(false);
export const error = ref<string | null>(null);

export const fetchFilteredUsers = async (personaId: number) => {
  await fetchPersonasConfig();

  
  await loadPersonaDetails(personaId);

  const queryParams = new URLSearchParams();

  // Condition for $isPaying
  if (forPayingUsers.value !== null) {
    queryParams.append('$isPaying', forPayingUsers.value.toString());
  }

  // Condition for $levelRange
  if (minLevel.value !== null && maxLevel.value !== null && maxLevel.value !== 0) {
    queryParams.append('$levelRange[min]', minLevel.value.toString());
    queryParams.append('$levelRange[max]', maxLevel.value.toString());
  }

  // Condition for $totalDeposit
  if (minDeposits.value !== null && maxDeposits.value !== null && maxDeposits.value !== 0) {
    queryParams.append('$totalDeposit[min]', minDeposits.value.toString());
    queryParams.append('$totalDeposit[max]', maxDeposits.value.toString());
  }

  // Condition for $Mmr
  if (minMmr.value !== null && maxMmr.value !== null && maxMmr.value !== 0) {
    queryParams.append('$Mmr[min]', minMmr.value.toString());
    queryParams.append('$Mmr[max]', maxMmr.value.toString());
  }
  
  // Construct the final URL
  const fullUrl = `${API_URL}?${queryParams.toString()}`;

  // This is the URL you would send to your backend, e.g., using a library like axios or fetch
  console.log('Constructed URL:', fullUrl);

  // Example of using fetch to get the data
  try {
    const response = await fetch(fullUrl, {
      headers: {
        'Authorization': `Bearer ${token.value}` // Use the passed token
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    users.value = data.data ?? [];
    console.log('Filtered user data:', data);
  } catch (error) {
    console.error('Failed to fetch filtered users:', error);
  }
};
