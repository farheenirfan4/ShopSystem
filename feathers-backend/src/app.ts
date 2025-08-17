// src/app.ts

import { feathers } from '@feathersjs/feathers'
import express, {
  rest,
  json,
  urlencoded,
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

// Create the Feathers application singleton instance
export const app: Application = express(feathers());

// 💡 JSON and URL-encoded middleware are kept to handle request bodies.
app.use(json());
app.use(urlencoded({ extended: true }));

// --- REMOVED: CORS-related code ---
// CORS is now configured in vercel.json.
// const allowedOrigins = [...];
// const corsOptions = {...};
// app.use(cors(corsOptions));
// app.use((req, res, next) => { ... });
// app.options('*', cors({ ... }));

app.use((req, res, next) => {
  console.log('Incoming request:', req.method, req.url, req.headers.origin)
  next()
});

// Host the public folder (only for local development)
//app.use('/', serveStatic(app.get('public')))

// Configure services and real-time functionality
app.configure(rest())

// Feathers Socket.io requires a persistent connection, which is not supported on Vercel Serverless.
// We will still keep this configuration for local development. Vercel will simply ignore it.
app.configure(
  socketio({
    cors: {
      origin: [
        process.env.FRONTEND_URL || 'http://localhost:3000',
        'https://shop-system-hafg.vercel.app'
      ],
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
