// For more information about this file see https://dove.feathersjs.com/guides/cli/service.shared.html
import type { Params } from '@feathersjs/feathers'
import type { ClientApplication } from '../../client'
import type {
  ChangeLogs,
  ChangeLogsData,
  ChangeLogsPatch,
  ChangeLogsQuery,
  ChangeLogsService
} from './changelogs.class'

export type { ChangeLogs, ChangeLogsData, ChangeLogsPatch, ChangeLogsQuery }

export type ChangeLogsClientService = Pick<
  ChangeLogsService<Params<ChangeLogsQuery>>,
  (typeof changeLogsMethods)[number]
>

export const changeLogsPath = 'change-logs'

export const changeLogsMethods: Array<keyof ChangeLogsService> = ['find', 'get', 'create']

export const changeLogsClient = (client: ClientApplication) => {
  const connection = client.get('connection')

  client.use(changeLogsPath, connection.service(changeLogsPath), {
    methods: changeLogsMethods
  })
}

// Add this service to the client service type index
declare module '../../client' {
  interface ServiceTypes {
    [changeLogsPath]: ChangeLogsClientService
  }
}
