// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'

import { hooks as schemaHooks } from '@feathersjs/schema'

import {
  changeLogsDataValidator,
  changeLogsPatchValidator,
  changeLogsQueryValidator,
  changeLogsResolver,
  changeLogsExternalResolver,
  changeLogsDataResolver,
  changeLogsPatchResolver,
  changeLogsQueryResolver
} from './changelogs.schema'

import type { Application } from '../../declarations'
import { ChangeLogsService, getOptions } from './changelogs.class'
import { changeLogsPath, changeLogsMethods } from './changelogs.shared'

export * from './changelogs.class'
export * from './changelogs.schema'

// A configure function that registers the service and its hooks via `app.configure`
export const changeLogs = (app: Application) => {
  // Register our service on the Feathers application
  app.use(changeLogsPath, new ChangeLogsService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: changeLogsMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(changeLogsPath).hooks({
    around: {
      all: [
        authenticate('jwt'),
        schemaHooks.resolveExternal(changeLogsExternalResolver),
        schemaHooks.resolveResult(changeLogsResolver)
      ]
    },
    before: {
      all: [
        schemaHooks.validateQuery(changeLogsQueryValidator),
        schemaHooks.resolveQuery(changeLogsQueryResolver)
      ],
      find: [],
      get: [],
      create: [
        schemaHooks.validateData(changeLogsDataValidator),
        schemaHooks.resolveData(changeLogsDataResolver)
      ],
      patch: [
        schemaHooks.validateData(changeLogsPatchValidator),
        schemaHooks.resolveData(changeLogsPatchResolver)
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
    [changeLogsPath]: ChangeLogsService
  }
}
