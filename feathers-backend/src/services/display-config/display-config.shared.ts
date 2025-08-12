// For more information about this file see https://dove.feathersjs.com/guides/cli/service.shared.html
import type { Params } from '@feathersjs/feathers'
import type { ClientApplication } from '../../client'
import type {
  DisplayConfig,
  DisplayConfigData,
  DisplayConfigPatch,
  DisplayConfigQuery,
  DisplayConfigService
} from './display-config.class'

export type { DisplayConfig, DisplayConfigData, DisplayConfigPatch, DisplayConfigQuery }

export type DisplayConfigClientService = Pick<
  DisplayConfigService<Params<DisplayConfigQuery>>,
  (typeof displayConfigMethods)[number]
>

export const displayConfigPath = 'display-config'

export const displayConfigMethods: Array<keyof DisplayConfigService> = [
  'find',
  'get',
  'create',
  'patch',
  'remove'
]

export const displayConfigClient = (client: ClientApplication) => {
  const connection = client.get('connection')

  client.use(displayConfigPath, connection.service(displayConfigPath), {
    methods: displayConfigMethods
  })
}

// Add this service to the client service type index
declare module '../../client' {
  interface ServiceTypes {
    [displayConfigPath]: DisplayConfigClientService
  }
}
