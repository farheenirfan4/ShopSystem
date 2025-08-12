// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'

import { hooks as schemaHooks } from '@feathersjs/schema'

import {
  displayConfigDataValidator,
  displayConfigPatchValidator,
  displayConfigQueryValidator,
  displayConfigResolver,
  displayConfigExternalResolver,
  displayConfigDataResolver,
  displayConfigPatchResolver,
  displayConfigQueryResolver
} from './display-config.schema'

import type { Application } from '../../declarations'
import { DisplayConfigService, getOptions } from './display-config.class'
import { displayConfigPath, displayConfigMethods } from './display-config.shared'

export * from './display-config.class'
export * from './display-config.schema'

// A configure function that registers the service and its hooks via `app.configure`
export const displayConfig = (app: Application) => {
  // Register our service on the Feathers application
  app.use(displayConfigPath, new DisplayConfigService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: displayConfigMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(displayConfigPath).hooks({
    around: {
      all: [
        authenticate('jwt'),
        schemaHooks.resolveExternal(displayConfigExternalResolver),
        schemaHooks.resolveResult(displayConfigResolver)
      ]
    },
    before: {
      all: [
        schemaHooks.validateQuery(displayConfigQueryValidator),
        schemaHooks.resolveQuery(displayConfigQueryResolver)
      ],
      find: [],
      get: [],
      create: [
        schemaHooks.validateData(displayConfigDataValidator),
        schemaHooks.resolveData(displayConfigDataResolver)
      ],
      patch: [
        schemaHooks.validateData(displayConfigPatchValidator),
        schemaHooks.resolveData(displayConfigPatchResolver)
      ],
      remove: []
    },
    after: {
      all: []
    },
    error: {
      all: []
    }
  })
}

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    [displayConfigPath]: DisplayConfigService
  }
}
