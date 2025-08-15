// composables/usePlayerEditor.ts
import { ref } from 'vue'
import { useAuthFetch } from './useAuthFetch'
import type { Player } from '../types/players'
import { useAuth } from './useAuth'
const config = useRuntimeConfig();

export function usePlayerEditor(fetchData: () => Promise<void>) {
  const editDialog = ref(false)
  const editUser = ref<Player | null>(null)
  const originalUser = ref<Player | null>(null)

  const openEditDialog = (user: Player) => {
    editUser.value = {
      ...user,
      metadata: {
        CareerProgressData: {
          XP: user.metadata?.CareerProgressData?.XP ?? 0,
          Level: user.metadata?.CareerProgressData?.Level ?? 0,
        },
        StatsData: {
          TotalTournamentsPlayed: user.metadata?.StatsData?.TotalTournamentsPlayed ?? 0
        },
        StataData: {
          WinRatio: user.metadata?.StataData?.WinRatio ?? 0
        },
        EarningData: {
          Ranking: user.metadata?.EarningData?.Ranking ?? 0,
          CashEarned: user.metadata?.EarningData?.CashEarned ?? 0
        },
        IsBotUser: user.metadata?.IsBotUser ?? false
      }
    }
    originalUser.value = JSON.parse(JSON.stringify(user))
    editUser.value = JSON.parse(JSON.stringify(user))
    editDialog.value = true
  }

  const getValueByPath = (obj: any, path: string[]) =>
    path.reduce((acc, key) => acc?.[key], obj)

  const collectChangedFields = (original: Player, updated: Player, userId: string | undefined) => {
    const now = new Date().toISOString()
    const playerId = updated.id
    const changes: any[] = []

    const fieldsToCheck = ['username', 'display_name', 'email', 'location', 'XP', 'Level', 'Ranking']
    for (const field of fieldsToCheck) {
      const oldVal = original[field as keyof Player]
      const newVal = updated[field as keyof Player]
      if (oldVal !== newVal) {
        changes.push({
          player_id: playerId,
          user_id: userId,
          timestamp: now,
          action: 'UPDATE',
          field_name: field,
          old_value: String(oldVal ?? ''),
          new_value: String(newVal ?? '')
        })
      }
    }

    const nestedFields = [
      { path: ['metadata', 'CareerProgressData', 'XP'], name: 'XP' },
      { path: ['metadata', 'CareerProgressData', 'Level'], name: 'Level' },
      { path: ['metadata', 'StatsData', 'TotalTournamentsPlayed'], name: 'TotalTournamentsPlayed' },
      { path: ['metadata', 'StataData', 'WinRatio'], name: 'WinRatio' },
      { path: ['metadata', 'EarningData', 'Ranking'], name: 'Ranking' },
      { path: ['metadata', 'EarningData', 'CashEarned'], name: 'CashEarned' },
      { path: ['metadata', 'IsBotUser'], name: 'IsBotUser' }
    ]

    for (const { path, name } of nestedFields) {
      const oldVal = getValueByPath(original, path)
      const newVal = getValueByPath(updated, path)
      if (oldVal !== newVal) {
        changes.push({
          player_id: playerId,
          user_id: userId,
          timestamp: now,
          action: 'UPDATE',
          field_name: name,
          old_value: String(oldVal ?? ''),
          new_value: String(newVal ?? '')
        })
      }
    }

    return changes
  }

  const buildPatchPayload = (data: Player) => {
    return Object.fromEntries(
      Object.entries(data).filter(([_, value]) => {
        return value !== '' && value !== null && value !== undefined
      })
    )
  }

  const sendPatchRequest = async (playerId: string, payload: any) => {
    await useAuthFetch(`${config.public.apiUrl}/players-data/${playerId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
  }

  const sendChangeLogs = async (changes: any[]) => {
    for (const change of changes) {
      await useAuthFetch('http://localhost:3030/change-logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(change)
      })
    }
  }

  const submitEdit = async () => {
    if (!editUser.value || !originalUser.value) return

    const { user } = useAuth()
    const userId = user.value?.id
    const playerId = editUser.value.id

    const changes = collectChangedFields(originalUser.value, editUser.value, userId)
    const finalPayload = buildPatchPayload({ ...editUser.value })

    console.log('PATCH payload:', finalPayload)

    try {
      await sendPatchRequest(playerId, finalPayload)
      await sendChangeLogs(changes)
      editDialog.value = false
      alert('Player information updated successfully')
      await fetchData()
    } catch (err) {
      console.error('Failed to update:', err)
    }
  }

  return {
    editDialog,
    editUser,
    openEditDialog,
    submitEdit
  }
}
