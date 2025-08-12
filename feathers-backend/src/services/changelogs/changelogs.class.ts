// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#database-services
import type { Params } from '@feathersjs/feathers'
import { KnexService } from '@feathersjs/knex'
import type { KnexAdapterParams, KnexAdapterOptions } from '@feathersjs/knex'

import type { Application } from '../../declarations'
import type { ChangeLogs, ChangeLogsData, ChangeLogsPatch, ChangeLogsQuery } from './changelogs.schema'

export type { ChangeLogs, ChangeLogsData, ChangeLogsPatch, ChangeLogsQuery }

export interface ChangeLogsParams extends KnexAdapterParams<ChangeLogsQuery> {}

// By default calls the standard Knex adapter service methods but can be customized with your own functionality.
export class ChangeLogsService<ServiceParams extends Params = ChangeLogsParams> extends KnexService<
  ChangeLogs,
  ChangeLogsData,
  ChangeLogsParams,
  ChangeLogsPatch
> {}

export const getOptions = (app: Application): KnexAdapterOptions => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('postgresqlClient'),
    name: 'changelogs'
  }
}
