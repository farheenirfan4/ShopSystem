// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#database-services
import type { Paginated, Params } from '@feathersjs/feathers'
import { KnexService } from '@feathersjs/knex'
import type { KnexAdapterParams, KnexAdapterOptions } from '@feathersjs/knex'
import { Knex } from 'knex'

import type { Application } from '../../declarations'
import { primaryDb } from '../../db/primary'

import type { PlayersData, PlayersDataData, PlayersDataPatch, PlayersDataQuery } from './players-data.schema'
import { join } from 'path'

export type { PlayersData, PlayersDataData, PlayersDataPatch, PlayersDataQuery }

export interface PlayersDataParams extends KnexAdapterParams<PlayersDataQuery> {}

// By default calls the standard Knex adapter service methods but can be customized with your own functionality.
export class PlayersDataService<ServiceParams extends Params = PlayersDataParams> extends KnexService<
  PlayersData,
  PlayersDataData,
  PlayersDataParams,
  PlayersDataPatch
> {
  async find(
  params: PlayersDataParams & { paginate: false }
): Promise<PlayersData[]>

async find(
  params?: PlayersDataParams
): Promise<Paginated<PlayersData>>

async find(
  params: PlayersDataParams
): Promise<any> {

  //console.log('Incoming find params:', JSON.stringify(params, null, 2));
  const { query } = params

  const knex: Knex = this.getModel(params)

  if (query?.$aggregateByDate) {
    const knex: Knex = this.getModel(params)
    const results = await knex('users')
      .select(knex.raw(`DATE(create_time) as date`))
      .count('* as count')
      .groupByRaw('DATE(create_time)')
      .orderBy('date', 'asc')

      return results.map(row => ({
        date: row.date,
        count: String(row.count)
      }))

   
  }


   let knexQuery = knex('users as u')
  .select('u.username', 'u.id');

if (query?.$includeCashDeposit || query?.$totalDeposit || query?.$Mmr) {
  knexQuery = knexQuery.join('storage as p', 'p.user_id', 'u.id');
}

// $isPaying filter
if (query?.$isPaying !== undefined) {
  knexQuery = knexQuery.andWhereRaw(`metadata->'UserPaymentInfo' @> ?`, [`{"IsPaying": ${query.$isPaying}}`]);
}

// $levelRange filter
if (query?.$levelRange !== undefined) {
  const { min, max } = query.$levelRange;
  knexQuery = knexQuery
    .whereRaw(`(metadata->'CareerProgressData'->>'Level')::INT >= ?`, [min])
    .andWhereRaw(`(metadata->'CareerProgressData'->>'Level')::INT <= ?`, [max]);
}

// $totalDeposit filter
if (query?.$totalDeposit !== undefined) {
  const { min, max } = query.$totalDeposit;
  knexQuery = knexQuery
    .where('p.collection', 'UserState')
    .andWhere('p.key', 'UserStats')
    .andWhereRaw(`CAST(p.value -> 'UsersCurrencyStatsData' ->> 'CashDeposit' AS numeric) >= ?`, [min])
    .andWhereRaw(`CAST(p.value -> 'UsersCurrencyStatsData' ->> 'CashDeposit' AS numeric) <= ?`, [max]);
}

if (query?.$Mmr === undefined) {
  console.log('No $Mmr filter applied, skipping Mmr-related joins');
}

// $Mmr filter
if (query?.$Mmr !== undefined) {
  const { min, max } = query.$Mmr;
  knexQuery = knexQuery
    .where('p.collection', 'Progress')
    .andWhere('p.key', 'PlayerRatingData')
    .andWhereRaw(`CAST(p.value ->> 'Mou' AS numeric) >= ?`, [min])
    .andWhereRaw(`CAST(p.value ->> 'Mou' AS numeric) <= ?`, [max]);
}

  if (query?.$count) {
    const result = await knexQuery.count('* as count').first() as Record<string, string | number> | undefined;
    if (result) {
  return {
    count: Number(result.count) || 0
  };
}  else {
  return {
    count: 0
  };
}
  }
  
  if (query?.$sort) {
    for (const [key, order] of Object.entries(query.$sort)) {
      if (key.includes('metadata.')) {
        const parts = key.split('.').slice(1)
        const path = parts.map(p => `'${p}'`).join('->')
        const castType = key.includes('CashEarned') || key.includes('Level') ? 'int' : 'text'
        knexQuery = knexQuery.orderByRaw(`(metadata->${path})::${castType} ${order === 1 ? 'ASC' : 'DESC'}`)
      } else {
        knexQuery = knexQuery.orderBy(key, order === 1 ? 'asc' : 'desc')
      }
    }
  }

  const finalQuery = this.filterQuery ? this.filterQuery(params) : params
  const { $limit, $skip, ...restQuery } = finalQuery.query || {}

  if ($limit !== undefined) knexQuery.limit($limit)
  if ($skip !== undefined) knexQuery.offset($skip)
    console.log('Final knex SQL:', knexQuery.toQuery());

  const data = await knexQuery
  const total = await knex('users').count('* as count').first()

  //return super.find(params)
  return {
    total: Number(total?.count ?? 0),
    limit: $limit ?? data.length,
    skip: $skip ?? 0,
    data
  }
}

}

export const getOptions = (app: Application): KnexAdapterOptions => {
  return {
    paginate: app.get('paginate'),
    Model: primaryDb,
    name: 'users'
  }
}

