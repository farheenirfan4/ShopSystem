import { AuthenticationService, JWTStrategy } from '@feathersjs/authentication'
import { LocalStrategy } from '@feathersjs/authentication-local'

import type { Application } from './declarations'

declare module './declarations' {
  interface ServiceTypes {
    authentication: AuthenticationService
  }
}

export const authentication = (app: Application) => {
  const service = new AuthenticationService(app)   // 👈 renamed

  service.register('jwt', new JWTStrategy())
  service.register('local', new LocalStrategy())

  app.use('/api/authentication', service as any)          // ✅ TS accepts this
}
