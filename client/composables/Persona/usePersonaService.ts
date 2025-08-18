// composables/usePersonaService.ts
import { ref } from 'vue'
import { useAuth } from '../Authentication/useAuth' // <-- to get token

export interface PersonaConfig {
  id: number
  name: string
  forPayingUsers: boolean
  maxLevel: number
  minLevel: number
  maxMmr: number
  minMmr: number
  maxDeposits: number
  minDeposits: number
  createdAt: string
  updatedAt: string
}


const forPayingUsers = ref<boolean>(false)
const maxLevel = ref<number>(0)
const minLevel = ref<number>(0)
const maxMmr = ref<number>(0)
const minMmr = ref<number>(0)
const maxDeposits = ref<number>(0)
const minDeposits = ref<number>(0)

export function usePersonaService() {
  const config = useRuntimeConfig();
  const { token, user } = useAuth()
  const loading = ref(false)
  const error = ref<string | null>(null)
  const notAuthorized = ref(false)

  /**
   * Fetches the list of personas from the API.
   * This function is now stateless, it returns the data and does not
   * manage an internal `personasConfig` ref.
   */
  const fetchPersonasConfig = async () => {
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
      const res = await fetch(`${config.public.apiUrl}/personas-config`, {
        headers: {
          Authorization: `Bearer ${token.value}`
        }
      })
      if (!res.ok) {
        throw new Error(`Failed to fetch: ${res.statusText}`);
      }
      const json = await res.json()
      // Return the data directly to the caller (e.g., `useAsyncData`)
      return json.data
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch personas config'
      return null
    } finally {
      loading.value = false
    }
  }

  
  const createPersona = async (payload: Omit<PersonaConfig, 'id' | 'createdAt' | 'updatedAt'>) => {
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
      const res = await fetch(`${config.public.apiUrl}/personas-config`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.value}`
        },
        body: JSON.stringify(payload)
      })

      if (!res.ok) {
        throw new Error(`Failed to create persona: ${res.statusText}`);
      }
      const newPersona: PersonaConfig = await res.json()

      return newPersona
    } catch (err: any) {
      error.value = err.message || 'Failed to create persona'
      return null
    } finally {
      loading.value = false
    }
  }


  const updatePersona = async (
    personaId: number | string,
    payload: Partial<Omit<PersonaConfig, 'id' | 'createdAt' | 'updatedAt'>>
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
      const res = await fetch(`${config.public.apiUrl}/personas-config/${personaId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.value}`
        },
        body: JSON.stringify(payload)
      })

      if (!res.ok) {
        throw new Error(`Failed to update persona: ${res.statusText}`);
      }

      const updatedPersona: PersonaConfig = await res.json()
      return updatedPersona
    } catch (err: any) {
      error.value = err.message || 'Failed to update persona'
      return null
    } finally {
      loading.value = false
    }
  }

  
  const getPersonaIds = (personas: PersonaConfig[] | null) => {
    if (!personas) return [];
    return personas
      .map(p => p.id ?? (p as any)._id)
      .filter((id): id is number => id !== undefined && id !== null);
  };
  
  

  return {
    loading,
    error,
    notAuthorized,
    fetchPersonasConfig,
    createPersona,
    updatePersona,
    getPersonaIds
  }
}
