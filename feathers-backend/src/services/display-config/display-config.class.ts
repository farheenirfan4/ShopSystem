// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#database-services
import type { Params } from '@feathersjs/feathers'
import { KnexService } from '@feathersjs/knex'
import type { KnexAdapterParams, KnexAdapterOptions } from '@feathersjs/knex'

import type { Application } from '../../declarations'
import type {
  DisplayConfig,
  DisplayConfigData,
  DisplayConfigPatch,
  DisplayConfigQuery
} from './display-config.schema'

export type { DisplayConfig, DisplayConfigData, DisplayConfigPatch, DisplayConfigQuery }

export interface DisplayConfigParams extends KnexAdapterParams<DisplayConfigQuery> {}

// By default calls the standard Knex adapter service methods but can be customized with your own functionality.
export class DisplayConfigService<ServiceParams extends Params = DisplayConfigParams> extends KnexService<
  DisplayConfig,
  DisplayConfigData,
  DisplayConfigParams,
  DisplayConfigPatch
> {}

export const getOptions = (app: Application): KnexAdapterOptions => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('postgresqlClient'),
    name: 'displayConfig'
  }
}
