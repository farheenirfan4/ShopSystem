import { onMounted } from 'vue';
import { usePersonaService } from '../../composables/Persona/usePersonaService';
import { useRouter } from 'vue-router';
import { useAuth } from '../../composables/Authentication/useAuth';
import type { Player, SortItem } from '../../types/players'





const { user, token } = useAuth() 
const loading = ref(true)
// The base URL for your API endpoint
//const API_URL = 'http://localhost:3030/players-data'; // Replace with your actual API endpoint

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
const players = ref<Player[]>([])
const total = ref(0)

export const fetchFilteredUsers = async (personaId: number) => {
  const config = useRuntimeConfig();
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
  const fullUrl = `${config.public.apiUrl}/players-data?${queryParams.toString()}`;

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

export const fetchData = async () => {
  const config = useRuntimeConfig();

  loading.value = true
      try {
        let url = `${config.public.apiUrl}/players-data?$includeCashDeposit=true`
        const response = await fetch(url, {
          headers: {
        'Authorization': `Bearer ${token.value}` // Use the passed token
      }

        })
        const data = await response.json();
        players.value = data ?? []
        console.log('Players data with deposited cash: ', data)
        //total.value = Array.isArray(response) ? response.length : response.total
        
  
       
      } catch (e) {
        console.error('Failed to fetch users:', e)
      } finally {
        loading.value = false
      }
}


