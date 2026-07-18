import type { VercelRequest, VercelResponse } from '@vercel/node';
import express from 'express';

const app = express();
app.use(express.json());

app.get('/api/health', (_req: any, res: any) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    runtime: 'vercel-serverless-isolated',
    note: 'minimal handler from api/index.ts'
  });
});

app.all('/api/(.*)', (req: any, res: any) => {
  res.status(404).json({ error: 'Not Found', path: req.path });
});

export default app;
