// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'

import { hooks as schemaHooks } from '@feathersjs/schema'

import {
  offersDataValidator,
  offersPatchValidator,
  offersQueryValidator,
  offersResolver,
  offersExternalResolver,
  offersDataResolver,
  offersPatchResolver,
  offersQueryResolver
} from './offers.schema'

import type { Application } from '../../declarations'
import { OffersService, getOptions } from './offers.class'
import { offersPath, offersMethods } from './offers.shared'
//import { filterActiveOffers } from '../../hooks/Offers/filterActiveOffers'
import { attachOfferStatus } from '../../hooks/Offers/attachActiveStatus'
import { changelogHook } from '../../hooks/Changelog/changelogHooks'
import { saveOriginalDataHook } from '../../hooks/Changelog/changelogHooks'

export * from './offers.class'
export * from './offers.schema'


// A configure function that registers the service and its hooks via `app.configure`
export const offers = (app: Application) => {
  // Register our service on the Feathers application
  app.use(offersPath, new OffersService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: offersMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(offersPath).hooks({
    around: {
      all: [
        authenticate('jwt'),
        schemaHooks.resolveExternal(offersExternalResolver),
        schemaHooks.resolveResult(offersResolver)
      ]
    },
    before: {
      all: [schemaHooks.validateQuery(offersQueryValidator), schemaHooks.resolveQuery(offersQueryResolver)],
      find: [],
      get: [],
      create: [schemaHooks.validateData(offersDataValidator), schemaHooks.resolveData(offersDataResolver)],
      patch: [saveOriginalDataHook,schemaHooks.validateData(offersPatchValidator), schemaHooks.resolveData(offersPatchResolver)],
      update: [saveOriginalDataHook],
      remove: []
    },
    after: {
     // find: [attachOfferStatus],
      //get: [attachOfferStatus],
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
    [offersPath]: OffersService
  }
}
