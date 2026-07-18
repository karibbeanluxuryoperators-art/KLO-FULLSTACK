// Vercel serverless entry point.
// @vercel/node compiles this TypeScript file and its imports (server.ts).
// The exported handler is the Express app from server.ts.

let app: any;

try {
  const mod = require('../server');
  app = mod.default || mod;
  console.log('[api/index] server.ts loaded successfully, app type:', typeof app);
} catch (err: any) {
  console.error('[api/index] FAILED to load server.ts:', err.message);
  console.error('[api/index] Stack:', err.stack);
  // Fallback minimal handler so the function doesn't 500
  const express = require('express');
  app = express();
  app.get('/api/health', (_req: any, res: any) => {
    res.json({
      status: 'error',
      message: 'server.ts failed to load',
      error: err.message,
      stack: err.stack?.split('\n').slice(0, 5).join('\n')
    });
  });
  app.all('/api/(.*)', (_req: any, res: any) => {
    res.status(500).json({ error: err.message });
  });
}

export default app;
