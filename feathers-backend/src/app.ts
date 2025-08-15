// For more information about this file see https://dove.feathersjs.com/guides/cli/application.html
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
import { registerChangeLogListener } from './listeners/changeLogs.listener';
import { changeLogs } from './services/changelogs/changelogs'

const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:3000',
  'https://shop-system-hafg.vercel.app'
]

// Corrected CORS options
const corsOptions = {
  // Use a function to dynamically check if the origin is allowed
  origin: (origin: string | undefined, callback: any) => {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);

    // Check if the incoming origin is in our allowed list
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'], // Best practice to include all methods
  allowedHeaders: ['Content-Type', 'Origin', 'X-Requested-With', 'Accept', 'x-client-key', 'x-client-token', 'x-client-secret', 'Authorization'] // Also best practice
};

const app: Application = express(feathers())

// Load app configuration
app.configure(configuration(configurationValidator))

// IMPORTANT: Configure CORS here at the top, using your custom options.
app.use(cors(corsOptions))

app.use(json())
app.use(urlencoded({ extended: true }))

// Host the public folder
app.use('/', serveStatic(app.get('public')))

// Configure services and real-time functionality
app.configure(rest())
app.configure(
  socketio({
    cors: {
      origin: allowedOrigins,
      credentials: true
    }
  })
);
app.configure(postgresql)
app.configure(authentication)
app.configure(services)
app.configure(channels)

// Configure a middleware for 404s and the error handler
app.use(notFound())
app.use(errorHandler({ logger }))

registerChangeLogListener(app);

// Register hooks that run on all service methods
app.hooks({
  around: {
    all: [logError]
  },
  before: {},
  after: {},
  error: {}
})

// Register application setup and teardown hooks here
app.hooks({
  setup: [],
  teardown: []
})

export { app }