// For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve, getValidator, querySyntax } from '@feathersjs/schema'
import type { FromSchema } from '@feathersjs/schema'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import type { ChangeLogsService } from './changelogs.class'

// Main data model schema
export const changeLogsSchema = {
  $id: 'ChangeLogs',
  type: 'object',
  additionalProperties: false,
  required: ['id'],
  properties: {
    id: { type: 'number' },
    service_id: { type: 'string' },
    service:{type:'string'},
    user_id: {type: 'number'},
    timestamp: { type: 'string', format: 'date-time' },
    action: { type: 'string' },
    changes: { type: 'string' } 
    
  }
} as const
export type ChangeLogs = FromSchema<typeof changeLogsSchema>
export const changeLogsValidator = getValidator(changeLogsSchema, dataValidator)
export const changeLogsResolver = resolve<ChangeLogs, HookContext<ChangeLogsService>>({})

export const changeLogsExternalResolver = resolve<ChangeLogs, HookContext<ChangeLogsService>>({})

// Schema for creating new data
export const changeLogsDataSchema = {
  $id: 'ChangeLogsData',
  type: 'object',
  additionalProperties: false,
  required: [],
  properties: {
    ...changeLogsSchema.properties
  }
} as const
export type ChangeLogsData = FromSchema<typeof changeLogsDataSchema>
export const changeLogsDataValidator = getValidator(changeLogsDataSchema, dataValidator)
export const changeLogsDataResolver = resolve<ChangeLogsData, HookContext<ChangeLogsService>>({})

// Schema for updating existing data
export const changeLogsPatchSchema = {
  $id: 'ChangeLogsPatch',
  type: 'object',
  additionalProperties: false,
  required: [],
  properties: {
    ...changeLogsSchema.properties
  }
} as const
export type ChangeLogsPatch = FromSchema<typeof changeLogsPatchSchema>
export const changeLogsPatchValidator = getValidator(changeLogsPatchSchema, dataValidator)
export const changeLogsPatchResolver = resolve<ChangeLogsPatch, HookContext<ChangeLogsService>>({})

// Schema for allowed query properties
export const changeLogsQuerySchema = {
  $id: 'ChangeLogsQuery',
  type: 'object',
  additionalProperties: false,
  properties: {
    ...querySyntax(changeLogsSchema.properties)
  }
} as const
export type ChangeLogsQuery = FromSchema<typeof changeLogsQuerySchema>
export const changeLogsQueryValidator = getValidator(changeLogsQuerySchema, queryValidator)
export const changeLogsQueryResolver = resolve<ChangeLogsQuery, HookContext<ChangeLogsService>>({})
