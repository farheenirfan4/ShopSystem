// For more information about this file see https://dove.feathersjs.com/guides/cli/service.shared.html
import type { Params } from '@feathersjs/feathers'
import type { ClientApplication } from '../../client'
import type {
  PlayersData,
  PlayersDataData,
  PlayersDataPatch,
  PlayersDataQuery,
  PlayersDataService
} from './players-data.class'

export type { PlayersData, PlayersDataData, PlayersDataPatch, PlayersDataQuery }

export type PlayersDataClientService = Pick<
  PlayersDataService<Params<PlayersDataQuery>>,
  (typeof playersDataMethods)[number]
>

export const playersDataPath = 'players-data'

export const playersDataMethods: Array<keyof PlayersDataService> = [
  'find',
  'get',
  'create',
  'patch',
  'remove'
]

export const playersDataClient = (client: ClientApplication) => {
  const connection = client.get('connection')

  client.use(playersDataPath, connection.service(playersDataPath), {
    methods: playersDataMethods
  })
}

// Add this service to the client service type index
declare module '../../client' {
  interface ServiceTypes {
    [playersDataPath]: PlayersDataClientService
  }
}
