// src/app.ts

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

// Define allowed origins for CORS
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
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Origin', 'X-Requested-With', 'Accept', 'x-client-key', 'x-client-token', 'x-client-secret', 'Authorization']
};

// Create the Feathers application singleton instance
// This is a singleton that can be imported using `{ app }`
export const app: Application = express(feathers())

// Handle preflight requests
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Origin', req.headers.origin || '*')
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS')
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Origin, X-Requested-With, Accept')
    res.header('Access-Control-Allow-Credentials', 'true')
    return res.sendStatus(200)
  }
  next()
})

app.use((req, res, next) => {
  console.log('Incoming request:', req.method, req.url, req.headers.origin)
  next()
})
app.use(cors(corsOptions))
app.options('*', cors({
  origin: true,
  credentials: true
}))

// Load app configuration
app.configure(configuration(configurationValidator))

app.use(json())
app.use(urlencoded({ extended: true }))

// Host the public folder
//app.use('/', serveStatic(app.get('public')))

// Configure services and real-time functionality
app.configure(rest())

// Feathers Socket.io requires a persistent connection, which is not supported on Vercel Serverless.
// We will still keep this configuration for local development. Vercel will simply ignore it.
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
