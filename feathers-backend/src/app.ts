// src/app.ts
import { feathers } from '@feathersjs/feathers'
import express, { json, urlencoded, rest } from '@feathersjs/express'
import cors from 'cors'
import { services } from './services'

const app = express(feathers())

// middlewares
app.use(json())
app.use(urlencoded({ extended: true }))
app.use(cors())

// REST transport
app.configure(rest())

// register services
app.configure(services)

export default app
