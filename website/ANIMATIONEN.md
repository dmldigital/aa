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
