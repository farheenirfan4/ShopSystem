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
  const config = useRuntimeConfig()
  loading.value = true
  try {
    const res = await useAuthFetch<{ total: number; data: Player[] }>(
      `${config.public.apiUrl}/players-data?$limit=100&$includeCashDeposit=true`
    )

    users.value = res.data.map(user => ({
      ...user,
      metadata: {
        ...user.metadata,
        IsBotUser: String(user.metadata?.IsBotUser ?? '')
      }
    }))
    total.value = res.total
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
  }
}
