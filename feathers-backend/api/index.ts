// api/index.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { app } from '../src/app';

// Track cold start vs warm start
let isAppSetup = false;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log('----------------------------------------');
  console.log('[api/index.ts] Incoming request:', req.method, req.url);
  console.log('[api/index.ts] Origin header:', req.headers.origin);
  console.log('[api/index.ts] isAppSetup:', isAppSetup);

  try {
    // Cold start → setup Feathers app once
    if (!isAppSetup) {
      console.log('[api/index.ts] Cold start detected → running app.setup()');
      await app.setup();
      isAppSetup = true;
      console.log('[api/index.ts] app.setup() completed ✅');
    } else {
      console.log('[api/index.ts] Warm start → app.setup() skipped');
    }

    // Hand over ALL requests (including OPTIONS) to Feathers
    console.log('[api/index.ts] Passing request to Feathers app.handle()');
    (app as any).handle(req, res);

  } catch (error: any) {
    console.error('[api/index.ts] Error occurred ❌', error);
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
