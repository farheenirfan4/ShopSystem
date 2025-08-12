// For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve, getValidator, querySyntax } from '@feathersjs/schema'
import type { FromSchema } from '@feathersjs/schema'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import type { DisplayConfigService } from './display-config.class'

// Main data model schema
export const displayConfigSchema = {
  $id: 'DisplayConfig',
  type: 'object',
  additionalProperties: false,
  required: [],
  properties: {
    displaySection: { type: 'string' },        // e.g. 'personasConfig'
    height: { type: 'string' },
    width: { type: 'string' },        // create, patch, remove
    priority: {type: 'string'}
  }
} as const
export type DisplayConfig = FromSchema<typeof displayConfigSchema>
export const displayConfigValidator = getValidator(displayConfigSchema, dataValidator)
export const displayConfigResolver = resolve<DisplayConfig, HookContext<DisplayConfigService>>({})

export const displayConfigExternalResolver = resolve<DisplayConfig, HookContext<DisplayConfigService>>({})

// Schema for creating new data
export const displayConfigDataSchema = {
  $id: 'DisplayConfigData',
  type: 'object',
  additionalProperties: false,
  required: [],
  properties: {
    ...displayConfigSchema.properties
  }
} as const
export type DisplayConfigData = FromSchema<typeof displayConfigDataSchema>
export const displayConfigDataValidator = getValidator(displayConfigDataSchema, dataValidator)
export const displayConfigDataResolver = resolve<DisplayConfigData, HookContext<DisplayConfigService>>({})

// Schema for updating existing data
export const displayConfigPatchSchema = {
  $id: 'DisplayConfigPatch',
  type: 'object',
  additionalProperties: false,
  required: [],
  properties: {
    ...displayConfigSchema.properties
  }
} as const
export type DisplayConfigPatch = FromSchema<typeof displayConfigPatchSchema>
export const displayConfigPatchValidator = getValidator(displayConfigPatchSchema, dataValidator)
export const displayConfigPatchResolver = resolve<DisplayConfigPatch, HookContext<DisplayConfigService>>({})

// Schema for allowed query properties
export const displayConfigQuerySchema = {
  $id: 'DisplayConfigQuery',
  type: 'object',
  additionalProperties: false,
  properties: {
    ...querySyntax(displayConfigSchema.properties)
  }
} as const
export type DisplayConfigQuery = FromSchema<typeof displayConfigQuerySchema>
export const displayConfigQueryValidator = getValidator(displayConfigQuerySchema, queryValidator)
export const displayConfigQueryResolver = resolve<DisplayConfigQuery, HookContext<DisplayConfigService>>({})
