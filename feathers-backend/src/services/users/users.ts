// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'
import { hooks as schemaHooks } from '@feathersjs/schema'
import {
  userDataValidator,
  userPatchValidator,
  userQueryValidator,
  userResolver,
  userExternalResolver,
  userDataResolver,
  userPatchResolver,
  userQueryResolver
} from './users.schema'

import type { Application } from '../../declarations'
import { UserService, getOptions } from './users.class'
import { userPath, userMethods } from './users.shared'

import { restrictByRole } from '../../hooks/Roles/restrictByRole';
import { preventSelfRoleChange } from '../../hooks/Roles/preventSelfRoleChange';
import { Forbidden } from '@feathersjs/errors'
import { changelogHook } from '../../hooks/Changelog/changelogHooks'


export * from './users.class'
export * from './users.schema'

// A configure function that registers the service and its hooks via `app.configure`
export const user = (app: Application) => {
  app.use(userPath, new UserService(getOptions(app)), {
    methods: userMethods,
    events: []
  })

  // Initialize hooks
  app.service(userPath).hooks({
    around: {
      all: [
        schemaHooks.resolveExternal(userExternalResolver),
        schemaHooks.resolveResult(userResolver)
      ]
    },
    before: {
      all: [
        schemaHooks.validateQuery(userQueryValidator),
        schemaHooks.resolveQuery(userQueryResolver)
      ],
      find: [
        async (context) => {
    // Only protect external requests
    if (context.params.provider) {
      await authenticate('jwt')(context);
      await restrictByRole('admin', 'moderator')(context);
    }
    return context;
  }
      ],
      get: [
        authenticate('jwt'), 
        async (context) => {
          const { id, params } = context;
          const user = params.user;

         
          if (user && user.id !== id && !user.roles?.includes('admin')) {
            throw new Forbidden('You are not allowed to get this user profile.');
          }
          return context;
        }
      ],
      
      create: [
        schemaHooks.validateData(userDataValidator),
        schemaHooks.resolveData(userDataResolver)
      ],
      update: [
        authenticate('jwt'), 
        restrictByRole('admin'), 
        preventSelfRoleChange(), 
        schemaHooks.validateData(userPatchValidator),
        schemaHooks.resolveData(userPatchResolver)
      ],
      patch: [
        authenticate('jwt'), 
        restrictByRole('admin'), 
        preventSelfRoleChange(), 
        schemaHooks.validateData(userPatchValidator),
        schemaHooks.resolveData(userPatchResolver)
      ],
      remove: [
        authenticate('jwt'), 
        restrictByRole('admin') 
      ]
    },
    after: {
      //create: [changelogHook],
      //patch: [changelogHook],
      //update: [changelogHook],
      //remove: [changelogHook],
      all: []
    },
    error: {
      all: []
    }
  })
}


declare module '../../declarations' {
  interface ServiceTypes {
    [userPath]: UserService
  }
}