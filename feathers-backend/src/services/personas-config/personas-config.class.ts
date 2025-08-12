// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#database-services
import type { Params } from '@feathersjs/feathers'
import { KnexService } from '@feathersjs/knex'
import type { KnexAdapterParams, KnexAdapterOptions } from '@feathersjs/knex'

import type { Application } from '../../declarations'
import type {
  PersonasConfig,
  PersonasConfigData,
  PersonasConfigPatch,
  PersonasConfigQuery
} from './personas-config.schema'

export type { PersonasConfig, PersonasConfigData, PersonasConfigPatch, PersonasConfigQuery }

export interface PersonasConfigParams extends KnexAdapterParams<PersonasConfigQuery> {}

// By default calls the standard Knex adapter service methods but can be customized with your own functionality.
export class PersonasConfigService<ServiceParams extends Params = PersonasConfigParams> extends KnexService<
  PersonasConfig,
  PersonasConfigData,
  PersonasConfigParams,
  PersonasConfigPatch
> {}

export const getOptions = (app: Application): KnexAdapterOptions => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('postgresqlClient'),
    name: 'personas-config'
  }
}
