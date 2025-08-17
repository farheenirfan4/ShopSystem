// api/index.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { app } from '../src/app';

// Track cold start vs warm start
let isAppSetup = false;

// Allowed origins for CORS
const allowedOrigins = [
  'https://shop-system-hafg.vercel.app',
  'http://localhost:3000'
];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log('----------------------------------------');
  console.log('[api/index.ts] Incoming request:', req.method, req.url);
  console.log('[api/index.ts] Origin header:', req.headers.origin);
  console.log('[api/index.ts] isAppSetup:', isAppSetup);

  try {
    const origin = req.headers.origin || '';

    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
      console.log('[api/index.ts] OPTIONS preflight received from:', req.headers.origin); 
      console.log('[api/index.ts] Handling OPTIONS preflight');
      if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
        res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
        res.setHeader(
          'Access-Control-Allow-Headers',
          'Content-Type,Authorization,Origin,X-Requested-With,Accept,x-client-key,x-client-token,x-client-secret'
        );
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        res.setHeader('Access-Control-Max-Age', '86400');
        console.log('[api/index.ts] Preflight response sent ✅');
        return res.status(204).end();
      } else {
        console.log('[api/index.ts] Preflight blocked ❌ Origin not allowed:', origin);
        return res.status(403).end();
      }
    }

    // Cold start → setup Feathers app once
    if (!isAppSetup) {
      console.log('[api/index.ts] Cold start detected → running app.setup()');
      await app.setup();
      isAppSetup = true;
      console.log('[api/index.ts] app.setup() completed ✅');
    } else {
      console.log('[api/index.ts] Warm start → app.setup() skipped');
    }

    // Apply CORS headers for actual requests
    if (allowedOrigins.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Access-Control-Allow-Credentials', 'true');
      console.log('[api/index.ts] CORS headers applied for request');
    }

    // Hand over the request to Feathers
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
