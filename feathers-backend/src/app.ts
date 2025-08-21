// app.ts
import { feathers } from '@feathersjs/feathers'
import express, {
  rest,
  json,
  urlencoded,
  cors,
  serveStatic,
  notFound,
  errorHandler
} from '@feathersjs/express'
import configuration from '@feathersjs/configuration'
import socketio from '@feathersjs/socketio'

import type { Application } from './declarations'
import { configurationValidator } from './configuration'
import { logger } from './logger'
import { logError } from './hooks/log-error'
import { postgresql } from './postgresql'
import { authentication } from './authentication'
import { services } from './services/index'
import { channels } from './channels'
import { registerChangeLogListener } from './listeners/changeLogs.listener'
import { config as dotenvConfig } from 'dotenv';
import compression from 'compression' 

dotenvConfig();

const productionConfig = {
  host: '0.0.0.0',
  port: 3030,
  public: './public/',
  origins: [process.env.FRONTEND_URL || 'http://localhost:3000'],
  authentication: {
    entity: 'user',
    service: 'users',
    secret: process.env.AUTH_SECRET || 'secret',
    authStrategies: ['jwt', 'local'],
    path: "/api/authentication",
    jwtOptions: {
      header: { typ: 'access' },
      audience: process.env.FRONTEND_URL,
      algorithm: 'HS256',
      expiresIn: '1d'
    },
    local: { usernameField: 'email', passwordField: 'password' }
  }
};
const allowedOrigins = [
  'https://shop-system-hafg.vercel.app'
]

//console.log('[app.ts] Initializing Feathers app..')

const app: Application = express(feathers())

//app.use(compression())

// --- CORS ---
//console.log('[app.ts] Configuring CORS with allowed origins:', allowedOrigins)
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }))

// --- Incoming request logger ---
app.use((req, res, next) => {
  //console.log('[app.ts] Incoming request:', req.method, req.url, 'Origin:', req.headers.origin)
  next()
})

// --- Load app configuration ---
//console.log('[app.ts] Loading configuration...')
app.configure(configuration(configurationValidator))

// --- Body parsers ---
//console.log('[app.ts] Configuring body parsers (json + urlencoded)')
app.use(json())
app.use(urlencoded({ extended: true }))

// --- Public folder ---
//console.log('[app.ts] Serving static files from:', app.get('public'))
//app.use('/', serveStatic(app.get('public')))

// --- REST + Socket.io ---
//console.log('[app.ts] Configuring REST transport...')
app.configure(rest())

//console.log('[app.ts] Configuring Socket.io with allowed origins...')
app.configure(
  socketio({
    cors: {
      origin: allowedOrigins,
      credentials: true
    }
  })
)

// --- Database ---
//console.log('[app.ts] Setting up PostgreSQL...')
app.configure(postgresql)

// --- Authentication ---
//console.log('[app.ts] Setting up authentication...')
app.configure(authentication)

// --- Services ---
//console.log('[app.ts] Registering services...')
app.configure(services)

// --- Channels ---
//console.log('[app.ts] Configuring channels...')
app.configure(channels)

// --- Error + 404 handlers ---
//console.log('[app.ts] Registering notFound + errorHandler middlewares...')
app.use(notFound())
app.use(errorHandler({ logger }))

// --- ChangeLog Listener ---
//console.log('[app.ts] Registering changeLog listener...')
registerChangeLogListener(app)

// --- Global hooks ---
//console.log('[app.ts] Registering global hooks...')
app.hooks({
  around: {
    all: [logError]
  },
  before: {},
  after: {},
  error: {}
})

// --- Lifecycle hooks ---
//console.log('[app.ts] Registering setup & teardown hooks...')
app.hooks({
  setup: [
    async () => {
      console.log('[app.ts] 🔧 App setup hook running...')
    }
  ],
  teardown: [
    async () => {
      //console.log('[app.ts] 🛑 App teardown hook running...')
    }
  ]
})

if (!app.get('authentication')) {
  
  app.set('authentication', productionConfig.authentication);
  //console.log('[Authentication] Default authentication configuration set');
}

//console.log('[app.ts] Feathers app initialized ')


export { app }
