// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'
import { changelogHook } from '../../hooks/Changelog/changelogHooks'

import { hooks as schemaHooks } from '@feathersjs/schema'

import {
  personasConfigDataValidator,
  personasConfigPatchValidator,
  personasConfigQueryValidator,
  personasConfigResolver,
  personasConfigExternalResolver,
  personasConfigDataResolver,
  personasConfigPatchResolver,
  personasConfigQueryResolver
} from './personas-config.schema'

import type { Application } from '../../declarations'
import { PersonasConfigService, getOptions } from './personas-config.class'
import { personasConfigPath, personasConfigMethods } from './personas-config.shared'

//import { logChange } from '../../hooks/log-change'

export * from './personas-config.class'
export * from './personas-config.schema'

// A configure function that registers the service and its hooks via `app.configure`
export const personasConfig = (app: Application) => {
  // Register our service on the Feathers application
  app.use(personasConfigPath, new PersonasConfigService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: personasConfigMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(personasConfigPath).hooks({
    around: {
      all: [
        //authenticate('jwt'),
        schemaHooks.resolveExternal(personasConfigExternalResolver),
        schemaHooks.resolveResult(personasConfigResolver)
      ]
    },
    before: {
      all: [
        schemaHooks.validateQuery(personasConfigQueryValidator),
        schemaHooks.resolveQuery(personasConfigQueryResolver)
      ],
      find: [],
      get: [],
      create: [
        schemaHooks.validateData(personasConfigDataValidator),
        schemaHooks.resolveData(personasConfigDataResolver),
        
      ],
      patch: [
        schemaHooks.validateData(personasConfigPatchValidator),
        schemaHooks.resolveData(personasConfigPatchResolver),
  
      ],
      remove: []
    },
    after: {
      create: [changelogHook],
      patch: [changelogHook],
      update: [changelogHook],
      remove: [changelogHook],
      all: [],
    },
    error: {
      all: []
    }
  })
}

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    [personasConfigPath]: PersonasConfigService
  }
}
