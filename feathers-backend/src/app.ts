// src/app.ts
import { feathers } from '@feathersjs/feathers'
import express, { json, urlencoded, rest, cors } from '@feathersjs/express'
import {services} from './services/index'

const app = express(feathers())

// middlewares
app.use(json())
app.use(urlencoded({ extended: true }))
//app.use(cors())

// REST API
app.configure(rest())

// register services
app.configure(services)

export default app
