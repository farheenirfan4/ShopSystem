// vercel.ts
import { app as feathersApp } from '../feathers-backend/src/app'
import express from '@feathersjs/express'

// Create a plain Express server
const server = express()

// Mount Feathers app under /api
server.use('/api', feathersApp)

export default server
