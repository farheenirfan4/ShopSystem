// For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve, getValidator, querySyntax } from '@feathersjs/schema'
import type { FromSchema } from '@feathersjs/schema'
import { passwordHash } from '@feathersjs/authentication-local'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import type { UserService } from './users.class'

// Main data model schema
export const userSchema = {
  $id: 'User',
  type: 'object',
  additionalProperties: false,
  required: ['id',  'username'],
  properties: {
    id: { type: 'number' },
    email: { type: 'string', format: 'email' },
    password: { type: 'string', minLength: 6 },
    username: { type: 'string', minLength: 3 },
    roles: { type: 'array', items: { type: 'string' } } 

  }
} as const

export type User = FromSchema<typeof userSchema>
export const userValidator = getValidator(userSchema, dataValidator)
export const userResolver = resolve<User, HookContext<UserService>>({})

// This resolver ensures the password is never returned externally
export const userExternalResolver = resolve<User, HookContext<UserService>>({
  password: async () => undefined
})

// Schema for creating new users
export const userDataSchema = {
  $id: 'UserData',
  type: 'object',
  additionalProperties: false,
  required: ['email', 'password', 'username'],
  properties: {
    email: userSchema.properties.email,
    password: userSchema.properties.password,
    username: userSchema.properties.username,
    roles: userSchema.properties.roles
  }
} as const

export type UserData = FromSchema<typeof userDataSchema>
export const userDataValidator = getValidator(userDataSchema, dataValidator)
export const userDataResolver = resolve<UserData, HookContext<UserService>>({
  password: passwordHash({ strategy: 'local' })
})

// Schema for patch (partial updates)
export const userPatchSchema = {
  $id: 'UserPatch',
  type: 'object',
  additionalProperties: false,
  required: [],
  properties: {
    email: userSchema.properties.email,
    password: userSchema.properties.password,
    username: userSchema.properties.username,
    roles: userSchema.properties.roles
  }
} as const

export type UserPatch = FromSchema<typeof userPatchSchema>
export const userPatchValidator = getValidator(userPatchSchema, dataValidator)
export const userPatchResolver = resolve<UserPatch, HookContext<UserService>>({
  password: passwordHash({ strategy: 'local' })
})

// Schema for allowed query parameters
export const userQuerySchema = {
  $id: 'UserQuery',
  type: 'object',
  additionalProperties: false,
  properties: {
    ...querySyntax(userSchema.properties)
  }
} as const

export type UserQuery = FromSchema<typeof userQuerySchema>
export const userQueryValidator = getValidator(userQuerySchema, queryValidator)
export const userQueryResolver = resolve<UserQuery, HookContext<UserService>>({
  id: async (value, user, context) => {
    if (context.params.user) {
      return context.params.user.id
    }

    return value
  }
})
