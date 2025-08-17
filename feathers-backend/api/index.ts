import {app} from '../src/app'
import type { IncomingMessage, ServerResponse } from 'http'

// Vercel will pass (req, res) here
export default function handler(req: IncomingMessage, res: ServerResponse) {
  // Feathers Express app is also a request listener
  return (app as any)(req, res)
}
