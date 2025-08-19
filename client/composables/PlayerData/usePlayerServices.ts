// composables/PlayerData/usePlayerServices.ts

import { ref } from 'vue';
import { usePersonaService } from '../../composables/Persona/usePersonaService';
import { useAuth } from '../../composables/Authentication/useAuth';
import type { Player } from '../../types/players';

// Access composables here at the top level
const { user, token } = useAuth();
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

// Reactive state
export const users = ref([]);
export const isLoading = ref(false);
export const error = ref<string | null>(null);
const players = ref<Player[]>([]);
const loading = ref(true);

/**
 * Fetches users based on persona filter criteria.
 * @param personaId The ID of the persona to filter by.
 */
export const fetchFilteredUsers = async (personaId: number) => {
  const config = useRuntimeConfig();
  
  // Ensure persona config and details are loaded
  await fetchPersonasConfig();
  await loadPersonaDetails(personaId);

  // Build the query parameters in a robust way
  const queryParams = [];

  // Condition for $isPaying
  if (forPayingUsers.value !== null) {
    queryParams.push(`$isPaying=${forPayingUsers.value.toString()}`);
  }

  // Condition for $levelRange
  if (minLevel.value !== null && maxLevel.value !== null && maxLevel.value !== 0) {
    queryParams.push(`$levelRange[min]=${minLevel.value.toString()}`);
    queryParams.push(`$levelRange[max]=${maxLevel.value.toString()}`);
  }

  // Condition for $totalDeposit
  if (minDeposits.value !== null && maxDeposits.value !== null && maxDeposits.value !== 0) {
    queryParams.push(`$totalDeposit[min]=${minDeposits.value.toString()}`);
    queryParams.push(`$totalDeposit[max]=${maxDeposits.value.toString()}`);
  }

  // Condition for $Mmr
  if (minMmr.value !== null && maxMmr.value !== null && maxMmr.value !== 0) {
    queryParams.push(`$Mmr[min]=${minMmr.value.toString()}`);
    queryParams.push(`$Mmr[max]=${maxMmr.value.toString()}`);
  }
  
  // Construct the final URL with joined parameters
  const queryString = queryParams.join('&');
  const fullUrl = `${config.public.apiUrl}/players-data?${queryString}`;

  console.log('Constructed URL:', fullUrl);

  try {
    const response = await fetch(fullUrl, {
      headers: {
        'Authorization': `Bearer ${token.value}`
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    users.value = data.data ?? [];
    console.log('Filtered user data:', data);
  } catch (err) {
    console.error('Failed to fetch filtered users:', err);
    error.value = 'Failed to fetch filtered users: ' + (err as Error).message;
  }
};

/**
 * Fetches all users with deposited cash data.
 */
export const fetchData = async () => {
  const config = useRuntimeConfig();

  loading.value = true;
  try {
    const url = `${config.public.apiUrl}/players-data?$includeCashDeposit=true`;
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token.value}`
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    players.value = data ?? [];
    console.log('Players data with deposited cash: ', data);
  } catch (err) {
    console.error('Failed to fetch users:', err);
  } finally {
    loading.value = false;
  }
};