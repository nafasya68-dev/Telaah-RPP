import { handleAnalyzeRpp } from '../src/server/analyzeHandler';

export const maxDuration = 60;

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).json({ success: false, error: 'Method Not Allowed. Gunakan metode POST.' });
    return;
  }
  if (typeof req.body === 'string') {
    try {
      req.body = JSON.parse(req.body);
    } catch {
      // payload might already be parsed or empty
    }
  }
  return handleAnalyzeRpp(req, res);
}

