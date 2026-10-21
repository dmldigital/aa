import { defineMiddleware } from 'astro:middleware';
import { autolink } from './lib/autolink';

/** Jede HTML-Seite läuft durch die interne Verlinkung (Regeln in `lib/autolink.ts`). */
export const onRequest = defineMiddleware(async (context, next) => {
  const response = await next();
  if (!response.headers.get('content-type')?.includes('text/html')) return response;
  const html = await response.text();
  return new Response(autolink(html, context.url.pathname), {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
  });
});
