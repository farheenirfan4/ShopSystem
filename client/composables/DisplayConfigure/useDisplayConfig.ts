// composables/DisplayConfig/useDisplayConfigService.ts
import { ref } from 'vue'
import { useAuth } from '../../composables/Authentication/useAuth'

const API_URL = 'http://localhost:3030/display-config' // Feathers endpoint

export interface DisplayConfig {
 id: number,
  displaySection: string,
  height: string,
  width: string,
  priority: string
}

export const useDisplayConfigService = () => {
  const { user, token } = useAuth()

  const displayConfigs = ref<any[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const notAuthorized = ref(false)

  // Local detail refs
  const displaySection = ref<string | null>(null)
  const height = ref<string | null>(null)
  const width = ref<string | null>(null)
  const priority = ref<string | null>(null)

  const fetchDisplayConfig = async () => {
    loading.value = true
    error.value = null
    notAuthorized.value = false

    if (!token.value) {
      error.value = 'Not logged in'
      loading.value = false
      return null
    }

    if (!user.value?.roles?.includes('admin')) {
      notAuthorized.value = true
      loading.value = false
      return null
    }

    try {
      const res = await fetch(API_URL, {
        headers: { Authorization: `Bearer ${token.value}` }
      })
      if (!res.ok) throw new Error(`Failed to fetch: ${res.statusText}`)
      const json = await res.json()
      displayConfigs.value = json.data
      return json.data
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch display config'
      return null
    } finally {
      loading.value = false
    }
  }

  const createDisplayConfig = async (
    payload: Omit<any, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    loading.value = true
    error.value = null

    if (!token.value) {
      error.value = 'Not logged in'
      loading.value = false
      return null
    }

    if (!user.value?.roles?.includes('admin')) {
      notAuthorized.value = true
      loading.value = false
      return null
    }

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.value}`
        },
        body: JSON.stringify(payload)
      })

      if (!res.ok) throw new Error(`Failed to create display config: ${res.statusText}`)
      const newConfig = await res.json()
      displayConfigs.value.push(newConfig)
      return newConfig
    } catch (err: any) {
      error.value = err.message || 'Failed to create display config'
      return null
    } finally {
      loading.value = false
    }
  }

  const loadDisplayConfigDetails = (configId: string | number) => {
    const config = displayConfigs.value.find(
      c => c.id === configId || (c as any)._id === configId
    )

    if (!config) {
      error.value = `DisplayConfig with ID ${configId} not found`
      return null
    }

    displaySection.value = config.displaySection || null
    height.value = config.height || null
    width.value = config.width || null
    priority.value = config.priority || null

    return {
      displaySection: displaySection.value,
      height: height.value,
      width: width.value,
      priority: priority.value
    }
  }

  const updateDisplayConfig = async (
    configId: number | string,
    payload: Partial<Omit<any, 'id' | 'createdAt' | 'updatedAt'>>
  ) => {
    loading.value = true
    error.value = null

    if (!token.value) {
      error.value = 'Not logged in'
      loading.value = false
      return null
    }

    if (!user.value?.roles?.includes('admin')) {
      notAuthorized.value = true
      loading.value = false
      return null
    }

    try {
      const res = await fetch(`${API_URL}/${configId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.value}`
        },
        body: JSON.stringify(payload)
      })

      if (!res.ok) throw new Error(`Failed to update display config: ${res.statusText}`)
      const updatedConfig = await res.json()

      const index = displayConfigs.value.findIndex(c => c.id === updatedConfig.id)
      if (index !== -1) {
        displayConfigs.value[index] = updatedConfig
      }

      return updatedConfig
    } catch (err: any) {
      error.value = err.message || 'Failed to update display config'
      return null
    } finally {
      loading.value = false
    }
  }

    const getDisplayConfigIds = () => {
    return displayConfigs.value.map(cfg => cfg.id ?? (cfg as any)._id);
  }


  return {
    displayConfigs,
    loading,
    error,
    notAuthorized,
    displaySection,
    height,
    width,
    priority,
    fetchDisplayConfig,
    createDisplayConfig,
    loadDisplayConfigDetails,
    updateDisplayConfig,
    getDisplayConfigIds
  }
}
