// Willkommens-Sektion: Beim Hereinscrollen kommen H2, die drei Textabsätze, der Link und der Schlusssatz
// nacheinander von unten hoch, verzögert wie an einer Kette gezogen: Jedes Glied folgt dem vorigen mit Abstand
// und legt einen etwas längeren Weg zurück. Bei reduzierter Bewegung steht alles sofort da.
import { t as gsap } from "./gsap.CvDoa17S.js";
import "./motion.B5Hf7-lS.js";

const scene = document.querySelector("[data-welcome-scene]");

if (scene) {
  const mm = gsap.matchMedia();

  mm.add("(prefers-reduced-motion: no-preference)", () => {
    const items = [...scene.querySelectorAll("[data-wc]")];
    if (!items.length) return;

    // Abstand zum vorigen Glied in Sekunden: H2, drei Absätze, Link, Schlusssatz (kommt als letztes Glied)
    const gaps = [0, 0.3, 0.2, 0.2, 0.22, 0.42];
    let at = 0;
    const starts = items.map((_, i) => (at += gaps[i] ?? 0.18));

    gsap.set(items, { autoAlpha: 0, y: (i) => 54 + i * 16 });
    gsap
      .timeline({ scrollTrigger: { trigger: items[0], start: "top 88%", once: true } })
      .to(items, { autoAlpha: 1, y: 0, duration: 1.3, ease: "power3.out", delay: (i) => starts[i] });
  });
}
