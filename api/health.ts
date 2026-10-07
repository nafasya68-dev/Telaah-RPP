import { handleHealth } from '../src/server/analyzeHandler';

export default async function handler(req: any, res: any) {
  return handleHealth(req, res);
}
