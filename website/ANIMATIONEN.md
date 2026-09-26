# Animations-Referenzen (vom Kunden/Nutzer ausgewählt)

Nur Bewegung und Abläufe übernehmen – Optik der Elemente bleibt wie im Design-System der Website.

## 1. Button-Gruppe „Auffächern“ – 21st.dev `bundled/10`
Quelle: https://cdn.21st.dev/bundled/10.html?theme=dark&dark=true

- **Einsatz:** überall, wo mehrere Buttons nebeneinander stehen (z. B. Hero-CTAs, Navigation).
- **Ablauf:** Die Buttons liegen zu Beginn übereinander hinter dem ersten Button (Stapel), dann gleiten sie nacheinander nach rechts an ihre Position.
  - Startzustand je Button *n* (0-basiert): `transform: translateX(-n × 100px)`, `z-index: 100 − n` → der erste liegt oben, die folgenden darunter.
  - Endzustand: `transform: none`.
- **Umsetzung bei uns:** Buttons-Optik wie auf der Website (primär/hell/Text-Link), nur diese Auffächer-Bewegung beim Einblenden (z. B. wenn die Gruppe in den Viewport kommt). Dauer/Easing im Original per Framer Motion; bei uns ca. 0,6–0,8 s, Staffelung ca. 0,1 s, `cubic-bezier(0.22, 1, 0.36, 1)` (Schätzung, beim Einbau am Original feinjustieren).
- `prefers-reduced-motion`: ohne Bewegung direkt im Endzustand.

## 2. „Scroll & Roll“ – Medienfenster öffnet sich beim Scrollen – 21st.dev `bundled/1959`
Quelle: https://cdn.21st.dev/bundled/1959.html?theme=dark&dark=true

- **Einsatz (Vorschlag):** großer Bild-/Video-Moment, z. B. direkt nach dem Hero: ein Pool-Video/-Foto „öffnet“ sich beim Scrollen von einer kleinen Kapsel zum großen Bild.
- **Aufbau:** Sektion ist 350vh hoch, darin eine `position: sticky; top: 0`-Bühne mit `min-height: 100svh`. Alle Werte hängen linear am Scrollfortschritt der Sektion (Framer Motion `useScroll`/`useTransform`); **fertig bei ca. 80 %** des Scrollwegs, danach steht alles still.
- **Gemessene Werte (Start → Ende):**
  - Medienfenster: `clip-path: inset(35.6% round 836px)` → `inset(0% round 16px)` → startet als schmale Kapsel/Pille, endet als volles Bild mit 16px Radius (Radius läuft bis 100 % weiter: 180px bei 80 % → 16px bei 100 %).
  - Video/Bild darin: `transform: scale(0.7625)` → `scale(1)`.
  - Überschrift + Text: `translateY(80px)` → `0` (wandert nach oben).
  - Button: `translateY(-91px)` → `0` (sitzt anfangs direkt unter dem Text, wandert mit dem wachsenden Bild nach unten); `opacity 1`, `blur 0` (Filter vorbereitet, aber unverändert).
- **Umsetzung bei uns:** ohne Framer Motion mit einem kleinen Scroll-Listener (requestAnimationFrame) bzw. CSS `animation-timeline: view()` wo verfügbar; Optik (Farben, Buttons, Schrift) aus unserem Design-System, nicht der dunkelblaue Glow-Look des Beispiels.
- `prefers-reduced-motion`: Endzustand sofort, keine Sticky-Strecke.
