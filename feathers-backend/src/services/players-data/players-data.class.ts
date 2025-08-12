// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#database-services
import type { Paginated, Params } from '@feathersjs/feathers'
import { KnexService } from '@feathersjs/knex'
import type { KnexAdapterParams, KnexAdapterOptions } from '@feathersjs/knex'
import { Knex } from 'knex'

import type { Application } from '../../declarations'
import { primaryDb } from '../../db/primary'

import type { PlayersData, PlayersDataData, PlayersDataPatch, PlayersDataQuery } from './players-data.schema'

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

    //return results
  }
   let knexQuery = knex('users').select('id','username');

   if (query?.$levelRange50to100) { // 👈 Check for the new parameter
    knexQuery = knexQuery
      .whereRaw(`(metadata->'CareerProgressData'->>'Level')::INT > ?`, [50])
      .andWhereRaw(`(metadata->'CareerProgressData'->>'Level')::INT < ?`, [100]);
    // Important: Remove this custom parameter from the query so it doesn't interfere with other filters
    delete query.$levelRange50to100;
  }

  if (query?.$isPaying !== undefined) {
    const isPayingUserValue = query.$isPaying;
    knexQuery = knexQuery
        .andWhereRaw(`metadata->'UserPaymentInfo' @> ?`, [`{"IsPaying": ${isPayingUserValue}}`]);
    delete query.$isPaying;
}

if (query?.$levelRange) {
    const { min, max } = query.$levelRange;
    knexQuery = knexQuery
        .whereRaw(`(metadata->'CareerProgressData'->>'Level')::INT >= ?`, [min])
        .andWhereRaw(`(metadata->'CareerProgressData'->>'Level')::INT <= ?`, [max])
        .andWhereRaw(`(metadata->>'IsBotUser') = 'false'`);
    delete query.$levelRange;
}

// Now, handle the conditions that require joining the 'storage' table.
// If any of these conditions exist, we'll perform the join.
if (query?.$totalDeposit || query?.$Mmr) {
    // Perform the join only once if needed
    knexQuery = knexQuery
        .from('storage as p')
        .join('users as u', 'p.user_id', 'u.id');
    
    // Now apply the where conditions from the original 'totalDeposit' block
    if (query?.$totalDeposit) {
        const { min, max } = query.$totalDeposit;
        knexQuery = knexQuery
            .where('p.collection', 'UserState')
            .andWhere('p.key', 'UserStats')
            .andWhereRaw(
                `CAST(p.value -> 'UsersCurrencyStatsData' ->> 'CashDeposit' AS numeric) >= ?`, 
                [min]
            )
            .andWhereRaw(
                `CAST(p.value -> 'UsersCurrencyStatsData' ->> 'CashDeposit' AS numeric) <= ?`, 
                [max]
            );
        delete query.$totalDeposit;
    }

    // Now apply the where conditions from the original 'Mmr' block
    if (query?.$Mmr) {
        const { min, max } = query.$Mmr;
        knexQuery = knexQuery
            .where('p.collection', 'Progress')
            .andWhere('p.key', 'PlayerRatingData')
            .andWhereRaw(`CAST(p.value ->> 'Mou' AS numeric) >= ?`, [min])
.andWhereRaw(`CAST(p.value ->> 'Mou' AS numeric) <= ?`, [max]);
        delete query.$Mmr;
    }
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

  // You may optionally apply additional filters using where clauses here if needed

  // Run query and paginate manually
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
