import { AI_NOTICE } from '../lib/ai-notice';
export const GET = () => new Response(AI_NOTICE + '\n', { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
