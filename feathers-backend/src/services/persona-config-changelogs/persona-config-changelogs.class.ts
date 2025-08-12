// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#database-services
import type { Params } from '@feathersjs/feathers'
import { KnexService } from '@feathersjs/knex'
import type { KnexAdapterParams, KnexAdapterOptions } from '@feathersjs/knex'

import type { Application } from '../../declarations'
import type {
  PersonaConfigChangelogs,
  PersonaConfigChangelogsData,
  PersonaConfigChangelogsPatch,
  PersonaConfigChangelogsQuery
} from './persona-config-changelogs.schema'

export type {
  PersonaConfigChangelogs,
  PersonaConfigChangelogsData,
  PersonaConfigChangelogsPatch,
  PersonaConfigChangelogsQuery
}

export interface PersonaConfigChangelogsParams extends KnexAdapterParams<PersonaConfigChangelogsQuery> {}

// By default calls the standard Knex adapter service methods but can be customized with your own functionality.
export class PersonaConfigChangelogsService<
  ServiceParams extends Params = PersonaConfigChangelogsParams
> extends KnexService<
  PersonaConfigChangelogs,
  PersonaConfigChangelogsData,
  PersonaConfigChangelogsParams,
  PersonaConfigChangelogsPatch
> {}

export const getOptions = (app: Application): KnexAdapterOptions => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('postgresqlClient'),
    name: 'persona-config-changelogs'
  }
}
