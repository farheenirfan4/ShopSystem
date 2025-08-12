// types/player.ts
export type ChangeLog = {
  id: string
  timestamp: string
  action: string
  fieldname: string
  oldvalue: string
  newvalue: string
  playerid: string
  userid: number
}
