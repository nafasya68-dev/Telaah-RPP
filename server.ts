import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { handleAnalyzeRpp, handleHealth } from './src/server/analyzeHandler';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '70mb' }));
app.use(express.urlencoded({ limit: '70mb', extended: true }));

// Mount API handlers from shared analyzeHandler module
app.get('/api/health', handleHealth);
app.post('/api/analyze-rpp', handleAnalyzeRpp);

// Guard GET or OPTIONS on /api/analyze-rpp
app.get(['/api/analyze-rpp', '/api/analyze-rpp/'], (_req: Request, res: Response) => {
  res.status(405).json({ success: false, error: 'Endpoint ini hanya menerima metode POST.' });
});

// Any unmatched /api/* route MUST return JSON, NEVER fall through to HTML
app.all('/api/*', (_req: Request, res: Response) => {
  res.status(404).json({ success: false, error: 'Endpoint API tidak ditemukan' });
});

// Global Express error handler to guarantee JSON error output for API calls
app.use((err: any, req: Request, res: Response, next: any) => {
  console.error('Express global error:', err);
  if (req.path && req.path.startsWith('/api/')) {
    return res.status(err.status || 500).json({
      success: false,
      error: err.message || 'Terjadi kesalahan pada pemrosesan server',
    });
  }
  next(err);
});

// Configure Vite or Static file serving
async function setupApp() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Server Dashboard Telaah RPP running at http://localhost:${PORT}`);
  });
}

setupApp();
