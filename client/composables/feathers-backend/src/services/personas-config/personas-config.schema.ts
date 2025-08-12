// For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve, getValidator, querySyntax } from '@feathersjs/schema'
import type { FromSchema } from '@feathersjs/schema'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import type { PersonasConfigService } from './personas-config.class'

// Main data model schema
export const personasConfigSchema = {
  $id: 'PersonasConfig',
  type: 'object',
  additionalProperties: false,
  required: [],
  properties: {
    name: { type: 'string' },
    forPayingUsers: {
      "type": ["boolean", "null"]
    },
    maxLevel:{type: 'number'},
    minLevel:{type: 'number'},
    maxMmr:{type: 'number'},
    minMmr:{type: 'number'},
    maxDeposits:{type: 'number'},
    minDeposits:{type: 'number'},
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' }
  }
} as const
export type PersonasConfig = FromSchema<typeof personasConfigSchema>
export const personasConfigValidator = getValidator(personasConfigSchema, dataValidator)
export const personasConfigResolver = resolve<PersonasConfig, HookContext<PersonasConfigService>>({})

export const personasConfigExternalResolver = resolve<PersonasConfig, HookContext<PersonasConfigService>>({})

// Schema for creating new data
export const personasConfigDataSchema = {
  $id: 'PersonasConfigData',
  type: 'object',
  additionalProperties: false,
  required: [],
  properties: {
    ...personasConfigSchema.properties
  }
} as const
export type PersonasConfigData = FromSchema<typeof personasConfigDataSchema>
export const personasConfigDataValidator = getValidator(personasConfigDataSchema, dataValidator)
export const personasConfigDataResolver = resolve<PersonasConfigData, HookContext<PersonasConfigService>>({})

// Schema for updating existing data
export const personasConfigPatchSchema = {
  $id: 'PersonasConfigPatch',
  type: 'object',
  additionalProperties: false,
  required: [],
  properties: {
    ...personasConfigSchema.properties
  }
} as const
export type PersonasConfigPatch = FromSchema<typeof personasConfigPatchSchema>
export const personasConfigPatchValidator = getValidator(personasConfigPatchSchema, dataValidator)
export const personasConfigPatchResolver = resolve<PersonasConfigPatch, HookContext<PersonasConfigService>>(
  {}
)

// Schema for allowed query properties
export const personasConfigQuerySchema = {
  $id: 'PersonasConfigQuery',
  type: 'object',
  additionalProperties: false,
  properties: {
    ...querySyntax(personasConfigSchema.properties)
  }
} as const
export type PersonasConfigQuery = FromSchema<typeof personasConfigQuerySchema>
export const personasConfigQueryValidator = getValidator(personasConfigQuerySchema, queryValidator)
export const personasConfigQueryResolver = resolve<PersonasConfigQuery, HookContext<PersonasConfigService>>(
  {}
)
