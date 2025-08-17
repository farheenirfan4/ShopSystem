// api/index.ts

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { app } from '../src/app';

// This flag tracks if the app has been set up for the current Lambda instance.
let isAppSetup = false;

// This is the main handler for the Vercel serverless function.
export default async function (req: VercelRequest, res: VercelResponse) {
  try {
    // Only set up the Feathers app once per cold start.
    // This is the crucial step to ensure database connections and services are ready.
    if (!isAppSetup) {
      await app.setup();
      isAppSetup = true;
    }

    // Use app.handle to explicitly process the request and response.
    // This is the most reliable way to handle the request given
    // the TypeScript type constraints.
    (app as any).handle(req, res);

  } catch (error) {
    console.error(error);
    // Send a consistent error response for any unhandled exceptions
    res.status(500).json({
      code: 500,
      message: 'Internal Server Error',
      name: 'ServerlessError',
      className: 'server-error',
      data: {},
      errors: {}
    });
  }
}