// Willkommens-Sektion, Desktop (ab 1025 px): Wenn die Bildwechsel fertig sind und weitergescrollt wird, wächst das
// letzte Bild auf Vollbild mit 24 px Rand rundum, genau wie das Hero-Bild. Die Seite steht (Pin), bis das Bild
// die volle Größe hat, erst dann scrollt sie weiter. Handy und Tablet: siehe Bildstapel im Welcome-Skript.
// Bei reduzierter Bewegung bleibt alles wie zuvor.
import { t as gsap } from "./gsap.CvDoa17S.js";
import { r as ScrollTrigger } from "./motion.B5Hf7-lS.js";

const scene = document.querySelector("[data-welcome-scene]");
const stack = scene && scene.querySelector("[data-ws-stack]");
const last = stack && [...stack.querySelectorAll("[data-ws-img]")].pop();
const text = scene && scene.querySelector("[data-ws-pin]").firstElementChild;

if (last) {
  const mq = window.matchMedia("(min-width: 1025px) and (prefers-reduced-motion: no-preference)");
  const M = 24;
  let ctx = null;
  let wrap = null;
  let timer = null;

  const teardown = () => {
    if (ctx) {
      ctx.revert();
      ctx = null;
    }
    if (wrap) {
      wrap.parentNode.insertBefore(last, wrap);
      wrap.remove();
      wrap = null;
    }
  };

  const build = () => {
    teardown();
    if (!mq.matches) return;

    const vw = document.documentElement.clientWidth;
    const vh = window.innerHeight;
    const rect = last.getBoundingClientRect();
    const w0 = rect.width;
    const h0 = rect.height;
    const left0 = rect.left;
    const startTop = (vh - h0) / 2; // Bild steht beim Pin mittig im Fenster
    const over = Math.max(0, vh - M - (startTop + h0)); // so weit ragt das Vollbild unter den Rahmen hinaus
    const dist = vh * 1.6;

    wrap = document.createElement("div");
    wrap.className = "wz-pin";
    wrap.style.height = h0 + "px";
    last.parentNode.insertBefore(wrap, last);
    wrap.appendChild(last);

    ctx = gsap.context(() => {
      gsap.set(last, { width: w0, height: h0 });
      gsap.set(stack, { paddingBottom: over });
      gsap
        .timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: wrap,
            start: "center center",
            end: "+=" + dist,
            pin: true,
            pinSpacing: true,
            scrub: 1,
            anticipatePin: 1,
            refreshPriority: 10, // Pin-Abstand vor allen weiter unten liegenden Triggern berechnen
          },
        })
        .to(last, { x: M - left0, y: M - startTop, width: vw - 2 * M, height: vh - 2 * M, ease: "power2.inOut" })
        .to(text, { opacity: 0, ease: "power2.inOut" }, 0); // Textspalte tritt zurück, damit im Rand nichts durchscheint
    }, scene);
    requestAnimationFrame(() => ScrollTrigger.refresh());
  };

  build();
  window.addEventListener("resize", () => {
    clearTimeout(timer);
    timer = setTimeout(build, 250);
  });
  window.addEventListener("load", build);
  mq.addEventListener("change", build);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(build);
}
