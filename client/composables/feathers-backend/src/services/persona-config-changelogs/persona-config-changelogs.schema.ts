// For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve, getValidator, querySyntax } from '@feathersjs/schema'
import type { FromSchema } from '@feathersjs/schema'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import type { PersonaConfigChangelogsService } from './persona-config-changelogs.class'

// Main data model schema
export const personaConfigChangelogsSchema = {
  $id: 'PersonaConfigChangelogs',
  type: 'object',
  additionalProperties: false,
  required: [],
  properties: {
    entity: { type: 'string' },        // e.g. 'personasConfig'
    entityId: { type: 'string' },
    action: { type: 'string' },        // create, patch, remove
    oldData: { type: 'object' },
    newData: { type: 'object' },
    changedBy: { type: 'string' },
    timestamp: { type: 'string', format: 'date-time' }
  }
} as const
export type PersonaConfigChangelogs = FromSchema<typeof personaConfigChangelogsSchema>
export const personaConfigChangelogsValidator = getValidator(personaConfigChangelogsSchema, dataValidator)
export const personaConfigChangelogsResolver = resolve<
  PersonaConfigChangelogs,
  HookContext<PersonaConfigChangelogsService>
>({})

export const personaConfigChangelogsExternalResolver = resolve<
  PersonaConfigChangelogs,
  HookContext<PersonaConfigChangelogsService>
>({})

// Schema for creating new data
export const personaConfigChangelogsDataSchema = {
  $id: 'PersonaConfigChangelogsData',
  type: 'object',
  additionalProperties: false,
  required: [],
  properties: {
    ...personaConfigChangelogsSchema.properties
  }
} as const
export type PersonaConfigChangelogsData = FromSchema<typeof personaConfigChangelogsDataSchema>
export const personaConfigChangelogsDataValidator = getValidator(
  personaConfigChangelogsDataSchema,
  dataValidator
)
export const personaConfigChangelogsDataResolver = resolve<
  PersonaConfigChangelogsData,
  HookContext<PersonaConfigChangelogsService>
>({})

// Schema for updating existing data
export const personaConfigChangelogsPatchSchema = {
  $id: 'PersonaConfigChangelogsPatch',
  type: 'object',
  additionalProperties: false,
  required: [],
  properties: {
    ...personaConfigChangelogsSchema.properties
  }
} as const
export type PersonaConfigChangelogsPatch = FromSchema<typeof personaConfigChangelogsPatchSchema>
export const personaConfigChangelogsPatchValidator = getValidator(
  personaConfigChangelogsPatchSchema,
  dataValidator
)
export const personaConfigChangelogsPatchResolver = resolve<
  PersonaConfigChangelogsPatch,
  HookContext<PersonaConfigChangelogsService>
>({})

// Schema for allowed query properties
export const personaConfigChangelogsQuerySchema = {
  $id: 'PersonaConfigChangelogsQuery',
  type: 'object',
  additionalProperties: false,
  properties: {
    ...querySyntax(personaConfigChangelogsSchema.properties)
  }
} as const
export type PersonaConfigChangelogsQuery = FromSchema<typeof personaConfigChangelogsQuerySchema>
export const personaConfigChangelogsQueryValidator = getValidator(
  personaConfigChangelogsQuerySchema,
  queryValidator
)
export const personaConfigChangelogsQueryResolver = resolve<
  PersonaConfigChangelogsQuery,
  HookContext<PersonaConfigChangelogsService>
>({})
