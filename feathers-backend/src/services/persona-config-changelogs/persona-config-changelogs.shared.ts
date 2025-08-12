// For more information about this file see https://dove.feathersjs.com/guides/cli/service.shared.html
import type { Params } from '@feathersjs/feathers'
import type { ClientApplication } from '../../client'
import type {
  PersonaConfigChangelogs,
  PersonaConfigChangelogsData,
  PersonaConfigChangelogsPatch,
  PersonaConfigChangelogsQuery,
  PersonaConfigChangelogsService
} from './persona-config-changelogs.class'

export type {
  PersonaConfigChangelogs,
  PersonaConfigChangelogsData,
  PersonaConfigChangelogsPatch,
  PersonaConfigChangelogsQuery
}

export type PersonaConfigChangelogsClientService = Pick<
  PersonaConfigChangelogsService<Params<PersonaConfigChangelogsQuery>>,
  (typeof personaConfigChangelogsMethods)[number]
>

export const personaConfigChangelogsPath = 'persona-config-changelogs'

export const personaConfigChangelogsMethods: Array<keyof PersonaConfigChangelogsService> = [
  'find',
  'get',
  'create',
  'patch',
  'remove'
]

export const personaConfigChangelogsClient = (client: ClientApplication) => {
  const connection = client.get('connection')

  client.use(personaConfigChangelogsPath, connection.service(personaConfigChangelogsPath), {
    methods: personaConfigChangelogsMethods
  })
}

// Add this service to the client service type index
declare module '../../client' {
  interface ServiceTypes {
    [personaConfigChangelogsPath]: PersonaConfigChangelogsClientService
  }
}
