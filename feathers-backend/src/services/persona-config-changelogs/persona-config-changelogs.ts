// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'

import { hooks as schemaHooks } from '@feathersjs/schema'

import {
  personaConfigChangelogsDataValidator,
  personaConfigChangelogsPatchValidator,
  personaConfigChangelogsQueryValidator,
  personaConfigChangelogsResolver,
  personaConfigChangelogsExternalResolver,
  personaConfigChangelogsDataResolver,
  personaConfigChangelogsPatchResolver,
  personaConfigChangelogsQueryResolver
} from './persona-config-changelogs.schema'

import type { Application } from '../../declarations'
import { PersonaConfigChangelogsService, getOptions } from './persona-config-changelogs.class'
import {
  personaConfigChangelogsPath,
  personaConfigChangelogsMethods
} from './persona-config-changelogs.shared'

export * from './persona-config-changelogs.class'
export * from './persona-config-changelogs.schema'

// A configure function that registers the service and its hooks via `app.configure`
export const personaConfigChangelogs = (app: Application) => {
  // Register our service on the Feathers application
  app.use(personaConfigChangelogsPath, new PersonaConfigChangelogsService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: personaConfigChangelogsMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(personaConfigChangelogsPath).hooks({
    around: {
      all: [
        authenticate('jwt'),
        schemaHooks.resolveExternal(personaConfigChangelogsExternalResolver),
        schemaHooks.resolveResult(personaConfigChangelogsResolver)
      ]
    },
    before: {
      all: [
        schemaHooks.validateQuery(personaConfigChangelogsQueryValidator),
        schemaHooks.resolveQuery(personaConfigChangelogsQueryResolver)
      ],
      find: [],
      get: [],
      create: [
        schemaHooks.validateData(personaConfigChangelogsDataValidator),
        schemaHooks.resolveData(personaConfigChangelogsDataResolver)
      ],
      patch: [
        schemaHooks.validateData(personaConfigChangelogsPatchValidator),
        schemaHooks.resolveData(personaConfigChangelogsPatchResolver)
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
    [personaConfigChangelogsPath]: PersonaConfigChangelogsService
  }
}
