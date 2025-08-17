// api/test-cors.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';

const allowedOrigins = [
  'https://shop-system-hafg.vercel.app',
  'http://localhost:3000'
];

export default function handler(req: VercelRequest, res: VercelResponse) {
  console.log('----------------------------------------');
  console.log('[test-cors] Incoming request:', req.method, req.url);
  console.log('[test-cors] Origin header:', req.headers.origin);

  const origin = req.headers.origin || '';

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    console.log('[test-cors] Handling OPTIONS preflight');
    if (allowedOrigins.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
      res.setHeader(
        'Access-Control-Allow-Headers',
        'Content-Type,Authorization,Origin,X-Requested-With,Accept'
      );
      res.setHeader('Access-Control-Allow-Credentials', 'true');
      res.setHeader('Access-Control-Max-Age', '86400');
      console.log('[test-cors] Preflight response sent ✅');
      return res.status(204).end();
    } else {
      console.log('[test-cors] Preflight blocked ❌ Origin not allowed:', origin);
      return res.status(403).end();
    }
  }

  // Handle actual requests
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  }

  console.log('[test-cors] Sending JSON response ✅');
  res.json({ message: 'CORS test successful', originReceived: origin });
}
