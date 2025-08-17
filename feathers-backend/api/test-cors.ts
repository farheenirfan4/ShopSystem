import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  const origin = req.headers.origin || '';

  // Always set CORS headers first
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type,Authorization,Origin,X-Requested-With,Accept'
  );
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // OPTIONS preflight
  if (req.method === 'OPTIONS') {
    console.log('[test-cors] OPTIONS preflight received from', origin);
    return res.status(204).end();
  }

  // Actual request
  console.log('[test-cors] Request received from', origin);
  res.status(200).json({ message: 'CORS test successful', originReceived: origin });
}
