// Vercel serverless entry point.
// @vercel/node compiles this TypeScript file and its imports (server.ts).
// The exported handler is the Express app from server.ts.

import express from 'express';

let app: any = null;
let loadError: any = null;
let loadingPromise: Promise<void> | null = null;

function loadServer(): Promise<void> {
  if (loadingPromise) return loadingPromise;
  loadingPromise = import('../server.js')
    .then((mod: any) => {
      app = mod.default || mod;
      console.log('[klo-api] server.ts loaded OK');
    })
    .catch((err: any) => {
      loadError = err;
      console.error('[klo-api] server.ts LOAD FAILED:', err?.message || err);
    });
  return loadingPromise;
}

// Kick off loading on first request
const handler = express();
handler.get('/api/health', async (_req: any, res: any) => {
  if (!app && !loadError) await loadServer();
  res.json({
    status: loadError ? 'error' : 'ok',
    timestamp: new Date().toISOString(),
    runtime: 'vercel-serverless',
    serverLoaded: !!app,
    error: loadError ? { message: loadError.message } : undefined,
  });
});
handler.all('/api/(.*)', async (req: any, res: any) => {
  if (!app && !loadError) await loadServer();
  if (app) return app(req, res);
  res.status(500).json({ error: loadError?.message || 'server.ts not loaded' });
});

export default handler;
