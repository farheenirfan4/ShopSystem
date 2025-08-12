// composables/usePlayerService.ts
import { ref, computed } from 'vue'
import { useAuth } from './useAuth'
import type { Player, SortItem } from '../types/players'
import { useAuthFetch } from './useAuthFetch'
import debounce from 'lodash.debounce'
import type { PersonaConfig } from '~/types/PersonaConfig'

export function usePlayerService() {
  const users = ref<Player[]>([])
  const total = ref(0)
  const loading = ref(true)
  const searchUsername = ref('')
  const selectedIsBotValue = ref('')
  const selectedLocationValue = ref('')
  const selectedDate = ref<string | null>(null) // ISO format (e.g. "2025-08-02")

  const sortBy = ref<SortItem[]>([
    { key: 'metadata.EarningData.CashEarned', order: 'desc' },
    { key: 'metadata.CareerProgressData.Level', order: 'asc' }
  ])

  const debouncedFetchData = debounce(() => fetchData(), 300)

  const fetchData = async () => {
   loading.value = true
    try {
      let url = 'http://localhost:3030/players-data?$limit=12078'

     /*if (searchUsername.value) {
       url += `&username[$iLike]=%25${searchUsername.value}%25`
      }*/
      
      const res: { total: number; data: Player[] } | Player[] = await useAuthFetch(url)
      users.value = (Array.isArray(res) ? res : res.data).map(user => ({
        ...user,
        metadata: {
          ...user.metadata,
          IsBotUser: String(user.metadata?.IsBotUser ?? '')
        }
      }))
      total.value = Array.isArray(res) ? res.length : res.total
      

     
    } catch (e) {
      console.error('Failed to fetch users:', e)
    } finally {
      loading.value = false
    }
  }

 const filteredUsers = computed(() =>
  users.value.filter(user => {
    const userDate = user.create_time
      ? new Date(user.create_time).toISOString().slice(0, 10)
      : ''

    const matchesSearch =
      !searchUsername.value ||
      user.username?.toLowerCase().includes(searchUsername.value.toLowerCase())

    const matchesIsBot =
      !selectedIsBotValue.value ||
      String(user.metadata?.IsBotUser) === selectedIsBotValue.value

    const matchesLocation =
      !selectedLocationValue.value ||
      user.location === selectedLocationValue.value

    const matchesDate =
      !selectedDate.value || userDate === selectedDate.value

    return matchesSearch && matchesIsBot && matchesLocation && matchesDate
  })
)


async function sort(newSort: SortItem[]) {
  sortBy.value = newSort

  const params = new URLSearchParams()
  params.append('$limit', '12078')

  newSort.forEach(sort => {
    const order = sort.order === 'desc' ? -1 : 1
    // this will add multiple `$sort[...]` fields
    params.append(`$sort[${sort.key}]`, String(order))
  })

  const url = `http://localhost:3030/players-data?${params.toString()}`

  loading.value = true
  try {
    const res: { total: number; data: Player[] } | Player[] = await useAuthFetch(url)
    users.value = (Array.isArray(res) ? res : res.data).map(user => ({
      ...user,
      metadata: {
        ...user.metadata,
        IsBotUser: String(user.metadata?.IsBotUser ?? '')
      }
    }))
    total.value = Array.isArray(res) ? res.length : res.total
    console.log('I am sort and I am working')
  } catch (e) {
    console.error('Failed to sort users:', e)
  } finally {
    loading.value = false
  }
}


let minLevel = ref(0)
let maxLevel = ref(90)
let isPaying = ref(false)


const fetchFilteredDataForOffer = async () => {
  loading.value = true
  await fetchDataWithConfig(1);
  console.log(`The value of maxLevel after calling fetchDataWithConfig is ${maxLevel.value} and isBotFilter is ${isPaying.value}`)
  try {
    let url = 'http://localhost:3030/players-data?$limit=12078'

    if (minLevel.value !== null && maxLevel.value !== null) {
      url = url + `&$levelRange[min]=${minLevel.value}&$levelRange[max]=${maxLevel.value}` + 
      `&$isPaying=${isPaying.value}`;
    }
    const res: { total: number; data: Player[] } | Player[] = await useAuthFetch(url)
    users.value = (Array.isArray(res) ? res : res.data).map(user => ({
      ...user,
      metadata: {
        ...user.metadata,
        IsBotUser: String(user.metadata?.IsBotUser ?? '')
      }
    }))
    total.value = Array.isArray(res) ? res.length : res.total
    console.log('I am fetching filterd data');
    console.log('Filtered users:', users.value);
    console.log(url)

  } catch (e) {
    console.error('Failed to fetch users:', e)
  } finally {
    loading.value = false
  }
}

const fetchDataWithConfig = async (personaConfigId: Number) => {
   
    try {
      // 1. Fetch the configuration data
      const configUrl = `http://localhost:3030/personas-config/${personaConfigId}`;
      const configRes: PersonaConfig = await useAuthFetch(configUrl);
      
      // 2. Extract values and update reactive variables
      // Assuming the config object has properties like minLevel, maxLevel, and isPayingUser
      if (configRes) {
        minLevel.value = configRes.minLevel || 0;
        maxLevel.value = configRes.maxLevel || 90;
        isPaying.value = configRes.isPayingUser || false;
      }

      console.log(`The value from persona-config response is ${configRes.maxLevel}` )

    } catch (e) {
      console.error('Failed to fetch data with config:', e);
    } finally {
      loading.value = false;
    }
  };

  interface CountResponse {
  count: number;
}

  const fetchCount = async () => {
  loading.value = true;
  await fetchDataWithConfig(3); // Ensure config is fetched first

  try {
    let url = 'http://localhost:3030/players-data?$count=1';
    url += `&$levelRange[min]=${minLevel.value}&$levelRange[max]=${maxLevel.value}`;
    url += `&$isPaying=${isPaying.value}`;

    const res:CountResponse = await useAuthFetch(url);

    if (res && res.count !== undefined) {
      console.log(`The number of users is: ${res.count}`);
      total.value = res.count; // Assuming 'total' is your reactive variable for count
    }

  } catch (e) {
    console.error('Failed to fetch user count:', e);
  } finally {
    loading.value = false;
  }
};

  return {
    users,
    total,
    loading,
    searchUsername,
    selectedIsBotValue,
    selectedLocationValue,
    selectedDate,
    sortBy,
    fetchData,
    filteredUsers,
    debouncedFetchData,
    sort,
    fetchFilteredDataForOffer,
    fetchCount
  }
}
