// For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve, getValidator, querySyntax } from '@feathersjs/schema'
import type { FromSchema } from '@feathersjs/schema'

import { Type, Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import type { PlayersDataService } from './players-data.class'
import { flattenMetadataForSort } from '../../hooks/flatenMetadata.hooks'

// Main data model schema
export const playersDataSchema = {
  $id: 'PlayersData',
  type: 'object',
  additionalProperties: false,
  required: ['id'],
  properties: {
    id: { type: 'string', format: 'uuid' },
    username: { type: 'string' },
    display_name: { type: 'string' },
    avatar_url: { type: 'string' },
    lang_tag: { type: 'string' },
    location: { type: 'string' },
    timezone: { type: 'string' },
    metadata: { type: 'object' },
    wallet: { type: 'object' },
    email: { type: 'string' ,format: 'email' },
    password: { type: 'string' },
    facebook_id: { type: 'string' },
    google_id: { type: 'string' },
    gamecenter_id: { type: 'string' },
    steam_id: { type: 'string' },
    custom_id: { type: 'string' },
    edge_count: { type: 'integer' },
    create_time: { type: 'string', format: 'date-time' },
    update_time: { type: 'string', format: 'date-time' },
    verify_time: { type: 'string', format: 'date-time' },
    disable_time: { type: 'string', format: 'date-time' },
    facebook_instant_game_id: { type: 'string' },
    apple_id: { type: 'string' }
  }
} as const

export type PlayersData = FromSchema<typeof playersDataSchema>
export const playersDataValidator = getValidator(playersDataSchema, dataValidator)
export const playersDataResolver = resolve<PlayersData, HookContext<PlayersDataService>>({})

export const playersDataExternalResolver = resolve<PlayersData, HookContext<PlayersDataService>>({})

// Schema for creating new data
export const playersDataDataSchema = {
  $id: 'PlayersDataData',
  type: 'object',
  additionalProperties: false,
  required: ['username'], // 👈 include only fields needed on create
  properties: {
    ...playersDataSchema.properties
  }
} as const
export type PlayersDataData = FromSchema<typeof playersDataDataSchema>
export const playersDataDataValidator = getValidator(playersDataDataSchema, dataValidator)
export const playersDataDataResolver = resolve<PlayersDataData, HookContext<PlayersDataService>>({})

// Schema for patch (partial updates)
export const playersDataPatchSchema = {
  $id: 'PlayersDataPatch',
  type: 'object',
  additionalProperties: true,
  properties: {
    ...playersDataSchema.properties
  }
} as const
export type PlayersDataPatch = FromSchema<typeof playersDataPatchSchema>
export const playersDataPatchValidator = getValidator(playersDataPatchSchema, dataValidator)
export const playersDataPatchResolver = resolve<PlayersDataPatch, HookContext<PlayersDataService>>({})

// Query schema (for find endpoint)
export const playersDataQuerySchema = {
  $id: 'PlayersDataQuery',
  type: 'object',
  additionalProperties: false,
  properties: {
    ...querySyntax(playersDataSchema.properties),
    'metadata.EarningData.CashEarned': { type: 'number' },
    'metadata.CareerProgressData.Level': { type: 'number' },
    'metadata.IsBotUser': { type: 'boolean' },
    $includeCashDeposit: Type.Optional(Type.Boolean()),
    $aggregateByDate: Type.Optional(Type.Boolean()),
    $levelRange50to100: Type.Optional(Type.Boolean()),
    $levelRange: Type.Optional(Type.Object({
      min: Type.Number(),
      max: Type.Number(),
    })),
    $isPaying: Type.Optional(Type.Boolean()),
    $Mmr: Type.Optional(Type.Object({
      min: Type.Number(),
      max: Type.Number(),
    })),
    $totalDeposit: Type.Optional(Type.Object({
      min: Type.Number(),
      max: Type.Number(),
    })),
    $count : Type.Optional(Type.Number()),

    $sort: Type.Optional(
      Type.Object({}, { 
        patternProperties: {
          '.*': Type.Number({ minimum: -1, maximum: 1 })
        }
      })
    ),

  }
} as const

export type PlayersDataQuery = FromSchema<typeof playersDataQuerySchema>
export const playersDataQueryValidator = getValidator(playersDataQuerySchema, queryValidator)
export const playersDataQueryResolver = resolve<PlayersDataQuery, HookContext<PlayersDataService>>({})


