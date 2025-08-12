// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'

import { hooks as schemaHooks } from '@feathersjs/schema'

import { validateUsernameSearch } from '../../hooks/validateUsernameSearch'

import {
  playersDataDataValidator,
  playersDataPatchValidator,
  playersDataQueryValidator,
  playersDataResolver,
  playersDataExternalResolver,
  playersDataDataResolver,
  playersDataPatchResolver,
  playersDataQueryResolver
} from './players-data.schema'
import { changelogHook } from '../../hooks/Changelog/changelogHooks'

import type { Application } from '../../declarations'
import { PlayersDataService, getOptions } from './players-data.class'
import { playersDataPath, playersDataMethods } from './players-data.shared'
import type { HookContext } from '../../declarations';

export * from './players-data.class'
export * from './players-data.schema'

const logQueryHook = (context: HookContext) => {
  console.log('Incoming query params:', context.params.query);
  return context;
};


// A configure function that registers the service and its hooks via `app.configure`
export const playersData = (app: Application) => {
  // Register our service on the Feathers application
  app.use(playersDataPath, new PlayersDataService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: playersDataMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(playersDataPath).hooks({
    around: {
      all: [
        authenticate('jwt'),
        schemaHooks.resolveExternal(playersDataExternalResolver),
        schemaHooks.resolveResult(playersDataResolver)
      ]
    },
    before: {
      all: [
        //logQueryHook,
        schemaHooks.validateQuery(playersDataQueryValidator),
        schemaHooks.resolveQuery(playersDataQueryResolver)
      ],
      find: [validateUsernameSearch(),
        (context) => {
    if (context.params.query?.$aggregateByDate) {
      return context
    }
    return validateUsernameSearch()(context)
  }
      ],
      get: [],
      create: [
        schemaHooks.validateData(playersDataDataValidator),
        schemaHooks.resolveData(playersDataDataResolver)
      ],
      patch: [
        schemaHooks.validateData(playersDataPatchValidator),
        schemaHooks.resolveData(playersDataPatchResolver)
      ],
      remove: []
    },
    after: {
      create: [changelogHook],
      patch: [changelogHook],
      update: [changelogHook],
      remove: [changelogHook],
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
    [playersDataPath]: PlayersDataService
  }
}
