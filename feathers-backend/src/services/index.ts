import { displayConfig } from './display-config/display-config'
import { offers } from './offers/offers'
import { personaConfigChangelogs } from './persona-config-changelogs/persona-config-changelogs'
import { personasConfig } from './personas-config/personas-config'
import { changeLogs } from './changelogs/changelogs'
import { playersData } from './players-data/players-data'
import { user } from './users/users'
import type { Application } from '../declarations'

export const services = (app: Application) => {
  //Feathers service registration
  //app.configure(authentication)
  app.configure(displayConfig)
  app.configure(offers)
  app.configure(personaConfigChangelogs)
  app.configure(personasConfig)
  app.configure(changeLogs)
  app.configure(playersData)
  app.configure(user)

  Object.keys(app.services).forEach(path => {
    const service: any = app.service(path as any)
    const options = service.options || {}

    if (!options.paginate) {
      service.options = {
        ...options,
        paginate: app.get('paginate')
      }
    }
  })

}
