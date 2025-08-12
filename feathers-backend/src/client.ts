// For more information about this file see https://dove.feathersjs.com/guides/cli/client.html
import { feathers } from '@feathersjs/feathers'
import type { TransportConnection, Application } from '@feathersjs/feathers'
import authenticationClient from '@feathersjs/authentication-client'
import type { AuthenticationClientOptions } from '@feathersjs/authentication-client'

import { displayConfigClient } from './services/display-config/display-config.shared'
export type {
  DisplayConfig,
  DisplayConfigData,
  DisplayConfigQuery,
  DisplayConfigPatch
} from './services/display-config/display-config.shared'

import { offersClient } from './services/offers/offers.shared'
export type { Offers, OffersData, OffersQuery, OffersPatch } from './services/offers/offers.shared'

import { personaConfigChangelogsClient } from './services/persona-config-changelogs/persona-config-changelogs.shared'
export type {
  PersonaConfigChangelogs,
  PersonaConfigChangelogsData,
  PersonaConfigChangelogsQuery,
  PersonaConfigChangelogsPatch
} from './services/persona-config-changelogs/persona-config-changelogs.shared'

import { personasConfigClient } from './services/personas-config/personas-config.shared'
export type {
  PersonasConfig,
  PersonasConfigData,
  PersonasConfigQuery,
  PersonasConfigPatch
} from './services/personas-config/personas-config.shared'

import { changeLogsClient } from './services/changelogs/changelogs.shared'
export type {
  ChangeLogs,
  ChangeLogsData,
  ChangeLogsQuery,
  ChangeLogsPatch
} from './services/changelogs/changelogs.shared'

import { playersDataClient } from './services/players-data/players-data.shared'
export type {
  PlayersData,
  PlayersDataData,
  PlayersDataQuery,
  PlayersDataPatch
} from './services/players-data/players-data.shared'

import { userClient } from './services/users/users.shared'
export type { User, UserData, UserQuery, UserPatch } from './services/users/users.shared'

export interface Configuration {
  connection: TransportConnection<ServiceTypes>
}

export interface ServiceTypes {}

export type ClientApplication = Application<ServiceTypes, Configuration>

/**
 * Returns a typed client for the feathers-backend app.
 *
 * @param connection The REST or Socket.io Feathers client connection
 * @param authenticationOptions Additional settings for the authentication client
 * @see https://dove.feathersjs.com/api/client.html
 * @returns The Feathers client application
 */
export const createClient = <Configuration = any,>(
  connection: TransportConnection<ServiceTypes>,
  authenticationOptions: Partial<AuthenticationClientOptions> = {}
) => {
  const client: ClientApplication = feathers()

  client.configure(connection)
  client.configure(authenticationClient(authenticationOptions))
  client.set('connection', connection)

  client.configure(userClient)
  client.configure(playersDataClient)
  client.configure(changeLogsClient)
  client.configure(personasConfigClient)
  client.configure(personaConfigChangelogsClient)
  client.configure(offersClient)
  client.configure(displayConfigClient)
  return client
}
