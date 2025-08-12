// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#database-services
import type { Paginated, Params } from '@feathersjs/feathers'
import { KnexService } from '@feathersjs/knex'
import type { KnexAdapterParams, KnexAdapterOptions } from '@feathersjs/knex'

import type { Application } from '../../declarations'
import type { Offers, OffersData, OffersPatch, OffersQuery } from './offers.schema'
import { Knex } from 'knex'

export type { Offers, OffersData, OffersPatch, OffersQuery }

export interface OffersParams extends KnexAdapterParams<OffersQuery> {}

export class OffersService<ServiceParams extends Params = OffersParams> extends KnexService<
  Offers,
  OffersData,
  OffersParams,
  OffersPatch
> {
  // Overload signatures for type safety
  async find(params: OffersParams & { paginate: false }): Promise<Offers[]>
  async find(params?: OffersParams): Promise<Paginated<Offers>>

  async find(params?: OffersParams): Promise<Paginated<Offers> | Offers[]> {
    const knex = this.getModel(params)

    // ✅ Custom logic for $offersPerDay query
    if (params?.query?.$offersPerDay) {
      const results = await knex
        .select(knex.raw('dates.day'))
        .count<{ active_offers_count: number }>('offers.id as active_offers_count')
        .from(
          knex.raw(
            `generate_series(
              CURRENT_DATE,
              '2025-12-31'::date,
              '1 day'::interval
            ) as dates(day)`
          )
        )
        .leftJoin('offers', function () {
          this.on(knex.raw('dates.day >= offers."startDateUTC"'))
            .andOn(knex.raw('dates.day <= offers."endDateUTC"'))
        })
        .groupBy('dates.day')
        .orderBy('dates.day', 'asc')

      // ✅ Return the results in the correct FeathersJS paginated format
      //return {
       // data: results,
       // total: results.length,
       // limit: results.length,
        //skip: 0
      //} as Paginated<Offers>;
    }

    // ✅ Fallback to the default KnexService find method
    //    This is crucial to ensure the service works for all other queries
    return super.find(params)
  }
}

export const getOptions = (app: Application): KnexAdapterOptions => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('postgresqlClient'),
    name: 'offers'
  }
}