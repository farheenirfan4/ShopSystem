// For more information about this file see https://dove.feathersjs.com/guides/cli/service.shared.html
import type { Params } from '@feathersjs/feathers'
import type { ClientApplication } from '../../client'
import type { Offers, OffersData, OffersPatch, OffersQuery, OffersService } from './offers.class'

export type { Offers, OffersData, OffersPatch, OffersQuery }

export type OffersClientService = Pick<OffersService<Params<OffersQuery>>, (typeof offersMethods)[number]>

export const offersPath = 'offers'

export const offersMethods: Array<keyof OffersService> = ['find', 'get', 'create', 'patch', 'remove']

export const offersClient = (client: ClientApplication) => {
  const connection = client.get('connection')

  client.use(offersPath, connection.service(offersPath), {
    methods: offersMethods
  })
}

// Add this service to the client service type index
declare module '../../client' {
  interface ServiceTypes {
    [offersPath]: OffersClientService
  }
}
