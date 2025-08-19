// api/index.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { app } from '../src/app';
import { URL } from 'url';

// Track cold start vs warm start
let isAppSetup = false;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log('----------------------------------------');
  console.log('[api/index.ts] Incoming request:', req.method, req.url);
  console.log('[api/index.ts] Origin header:', req.headers.origin);
  console.log('[api/index.ts] isAppSetup:', isAppSetup);

  try {
    
    if (!isAppSetup) {
      console.log('[api/index.ts] Cold start detected → running app.setup()');
      await app.setup();
      isAppSetup = true;
      console.log('[api/index.ts] app.setup() completed ✅');
    } else {
      console.log('[api/index.ts] Warm start → app.setup() skipped');
    }

    // Preserve the query string when stripping the /api prefix
    if (req.url && req.url.startsWith('/api/') && !req.url.startsWith('/api/authentication')) {
  const urlObject = new URL(req.url, `http://${req.headers.host}`);
  urlObject.pathname = urlObject.pathname.replace(/^\/api/, '');
  req.url = urlObject.pathname + urlObject.search; // keep path + query

  // --- START: Parse and transform query parameters ---
  const rawQuery = Object.fromEntries(urlObject.searchParams.entries());

  const query: Record<string, any> = {};

  for (const key in rawQuery) {
    const value = rawQuery[key];

    // Convert boolean strings
    if (value === 'true') query[key] = true;
    else if (value === 'false') query[key] = false;
    // Convert numeric strings
    else if (!isNaN(Number(value))) query[key] = Number(value);
    else query[key] = value;

    // Handle range operators like $Mmr[min] and $Mmr[max]
    const rangeMatch = key.match(/^\$(\w+)\[(min|max)\]$/);
if (rangeMatch) {
  const field = rangeMatch[1];        // e.g., 'levelRange', 'Mmr'
  query[field] = query[field] || {};
  query[field][rangeMatch[2]] = Number(value); // keep as min/max
  delete query[key];                  // remove old key
}
  }

  req.query = query;
  console.log('[api/index.ts] Parsed & transformed query →', req.query);
  // --- END ---
}

    

  //console.log('[api/index.ts] Stripped /api prefix →', req.url);
  //console.log('[api/index.ts] Parsed query →', req.query);
    console.log('[api/index.ts] Passing request to Feathers app.handle()');
    (app as any).handle(req, res);
    console.log('[api/index.ts] Full URL:', req.url);

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