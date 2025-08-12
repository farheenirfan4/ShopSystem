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

const API_URL = 'http://localhost:3030/personas-config'

const forPayingUsers = ref<boolean>(false)
const maxLevel = ref<number>(0)
const minLevel = ref<number>(0)
const maxMmr = ref<number>(0)
const minMmr = ref<number>(0)
const maxDeposits = ref<number>(0)
const minDeposits = ref<number>(0)

export function usePersonaService() {
  const { token, user } = useAuth()
  const personasConfig = ref<PersonaConfig[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const notAuthorized = ref(false)

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
      const res = await fetch(API_URL, {
        headers: {
          Authorization: `Bearer ${token.value}`
        }
      })
      if (!res.ok) throw new Error(`Failed to fetch: ${res.statusText}`)
      const json = await res.json()
      personasConfig.value = json.data
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
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.value}`
        },
        body: JSON.stringify(payload)
      })

      if (!res.ok) throw new Error(`Failed to create persona: ${res.statusText}`)
      const newPersona: PersonaConfig = await res.json()

      // Update local state
      personasConfig.value.push(newPersona)
      return newPersona
    } catch (err: any) {
      error.value = err.message || 'Failed to create persona'
      return null
    } finally {
      loading.value = false
    }
  }

  const loadPersonaDetails = (personaId: string | number) => {
    const persona = personasConfig.value.find(p => p.id === personaId || (p as any)._id === personaId)

    if (!persona) {
      error.value = `Persona with ID ${personaId} not found`
      return null
    }

    forPayingUsers.value = Boolean(persona.forPayingUsers)
    maxLevel.value = Number(persona.maxLevel || 0)
    minLevel.value = Number(persona.minLevel || 0)
    maxMmr.value = Number(persona.maxMmr || 0)
    minMmr.value = Number(persona.minMmr || 0)
    maxDeposits.value = Number(persona.maxDeposits || 0)
    minDeposits.value = Number(persona.minDeposits || 0)

    return {
      forPayingUsers: forPayingUsers.value,
      maxLevel: maxLevel.value,
      minLevel: minLevel.value,
      maxMmr: maxMmr.value,
      minMmr: minMmr.value,
      maxDeposits: maxDeposits.value,
      minDeposits: minDeposits.value
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
    const res = await fetch(`${API_URL}/${personaId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token.value}`
      },
      body: JSON.stringify(payload)
    })

    if (!res.ok) throw new Error(`Failed to update persona: ${res.statusText}`)

    const updatedPersona: PersonaConfig = await res.json()

    // Update local state
    const index = personasConfig.value.findIndex(p => p.id === updatedPersona.id)
    if (index !== -1) {
      personasConfig.value[index] = updatedPersona
    }

    return updatedPersona
  } catch (err: any) {
    error.value = err.message || 'Failed to update persona'
    return null
  } finally {
    loading.value = false
  }
}

const getPersonaIds = () => {
  // Ensures we only return numbers/strings, no undefined/null
  return personasConfig.value
    .map(p => p.id ?? (p as any)._id) // Support both `id` and `_id`
    .filter((id): id is number => id !== undefined && id !== null);
};


  return {
    personasConfig,
    loading,
    error,
    notAuthorized,
    fetchPersonasConfig,
    createPersona,
    forPayingUsers,
    maxLevel,
    minLevel,
    maxMmr,
    minMmr,
    maxDeposits,
    minDeposits,
    loadPersonaDetails,
    updatePersona,
    getPersonaIds 
  }
}
