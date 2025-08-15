// composables/usePlayerService.ts
import { ref, computed } from 'vue'
import { useAuth } from './useAuth'
import type { Player, SortItem } from '../types/players'
import { useAuthFetch } from './useAuthFetch'
import debounce from 'lodash.debounce'
import type { ChangeLog } from '~/types/changeLog'

export function useChangeLogService() {
  const changeLogs = ref<ChangeLog[]>([])
  const total = ref(0)
  const loading = ref(true)
  const searchUsername = ref('')
  const debouncedFetchData = debounce(() => fetchChangeLogData(), 300)

  const config = useRuntimeConfig();

  const fetchChangeLogData = async () => {
   loading.value = true
    try {
      let url = `${config.public.apiUrl}/change-logs?$limit=100`
      
      const res: { total: number; data: ChangeLog[] } | ChangeLog[] = await useAuthFetch(url)
      changeLogs.value = (Array.isArray(res) ? res : res.data).map(changeLogs => ({
        ...changeLogs,
      }))
      total.value = Array.isArray(res) ? res.length : res.total
    } catch (e) {
      console.error('Failed to fetch change logs:', e)
    } finally {
      loading.value = false
    }
  }


  return {
    changeLogs,
    total,
    loading,
    searchUsername,
    fetchChangeLogData,
    debouncedFetchData
  }
}
