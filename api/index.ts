// Vercel serverless entry point.
// @vercel/node compiles this TypeScript file and its imports (server.ts).
// The exported handler is the Express app from server.ts.

import express from 'express';

let app: any = null;
let loadError: any = null;

try {
  const mod = require('../server');
  app = mod.default || mod;
  console.log('[klo-api] server.ts loaded OK, app type:', typeof app);
} catch (err: any) {
  loadError = err;
  console.error('[klo-api] server.ts LOAD FAILED:', err?.message || err);
  console.error('[klo-api] stack:', err?.stack?.split('\n').slice(0, 8).join(' | '));
}

const fallback = express();
fallback.get('/api/health', (_req: any, res: any) => {
  res.json({
    status: loadError ? 'error' : 'ok',
    timestamp: new Date().toISOString(),
    runtime: 'vercel-serverless',
    error: loadError ? {
      message: loadError.message,
      stack: loadError.stack?.split('\n').slice(0, 8).join('\n'),
    } : undefined,
  });
});
fallback.all('/api/(.*)', (req: any, res: any) => {
  if (app) return app(req, res);
  res.status(500).json({ error: loadError?.message || 'server.ts not loaded' });
});

export default app || fallback;
