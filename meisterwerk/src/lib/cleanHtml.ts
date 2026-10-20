/**
 * Entfernt leere Platzhalter aus Inhalten der alten Seite (`<p>&nbsp;</p>`, `<h4 aria-hidden>&nbsp;</h4>` usw.). Das
 * Original hat damit Spalten gleich hoch geschoben, in Karten und Textblöcken bleiben sonst große leere Flächen.
 */
export const cleanHtml = (html: string) =>
  html.replace(/<(p|h[1-6])\b[^>]*>(?:\s|&nbsp;|<br\s*\/?>)*<\/\1>/g, '');
