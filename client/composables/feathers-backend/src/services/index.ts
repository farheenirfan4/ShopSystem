import { displayConfig } from './display-config/display-config'
import { offers } from './offers/offers'
import { personaConfigChangelogs } from './persona-config-changelogs/persona-config-changelogs'
import { personasConfig } from './personas-config/personas-config'
import { changeLogs } from './changelogs/changelogs'
import { playersData } from './players-data/players-data'
import { user } from './users/users'
// For more information about this file see https://dove.feathersjs.com/guides/cli/application.html#configure-functions
import type { Application } from '../declarations'

export const services = (app: Application) => {
  app.configure(displayConfig)
  app.configure(offers)
  app.configure(personaConfigChangelogs)
  app.configure(personasConfig)
  app.configure(changeLogs)
  app.configure(playersData)
  app.configure(user)
  //dashboard(app)
  // All services will be registered here
}
