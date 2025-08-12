// types/player.ts
export type Player = {
  id: string
  username: string
  display_name: string
  email: string
  location: string
  avatar_url: string
  create_time: Date
  metadata: {
    CareerProgressData: { XP?: number; Level?: number }
    StatsData: { TotalTournamentsPlayed?: number }
    StataData?: { WinRatio?: number }
    EarningData: { Ranking?: number; CashEarned?: number }
    IsBotUser?: string | boolean
  }
}

export type SortItem = {
  key: string
  order?: 'asc' | 'desc'
}
