// For more information about this file see https://dove.feathersjs.com/guides/cli/service.shared.html
import type { Params } from '@feathersjs/feathers'
import type { ClientApplication } from '../../client'
import type {
  PersonasConfig,
  PersonasConfigData,
  PersonasConfigPatch,
  PersonasConfigQuery,
  PersonasConfigService
} from './personas-config.class'

export type { PersonasConfig, PersonasConfigData, PersonasConfigPatch, PersonasConfigQuery }

export type PersonasConfigClientService = Pick<
  PersonasConfigService<Params<PersonasConfigQuery>>,
  (typeof personasConfigMethods)[number]
>

export const personasConfigPath = 'personas-config'

export const personasConfigMethods: Array<keyof PersonasConfigService> = [
  'find',
  'get',
  'create',
  'patch',
  'remove'
]

export const personasConfigClient = (client: ClientApplication) => {
  const connection = client.get('connection')

  client.use(personasConfigPath, connection.service(personasConfigPath), {
    methods: personasConfigMethods
  })
}

// Add this service to the client service type index
declare module '../../client' {
  interface ServiceTypes {
    [personasConfigPath]: PersonasConfigClientService
  }
}
