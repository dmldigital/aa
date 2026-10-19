// FAQ schiebt sich von unten über "Unsere Exklusive Projekte", wie diese Sektion zuvor über die Bild-Sektion:
// Die Projekte-Sektion bleibt stehen (Sticky), das FAQ beginnt eine Sektionshöhe weiter oben und deckt sie zu.
// Der Wrapper der Projekte ist dafür eine Fensterhöhe länger. Bei reduzierter Bewegung bleibt alles wie vorher.
import { r as ScrollTrigger } from "./motion.B5Hf7-lS.js";

const ep = document.querySelector("[data-ep]");
const sheet = ep && ep.querySelector("[data-ep-sheet]");
const faq = document.querySelector("[data-faq]");

if (ep && sheet && faq) {
  const motion = window.matchMedia("(prefers-reduced-motion: no-preference)");
  let timer = null;

  const reset = () => {
    ep.classList.remove("ep--on");
    faq.classList.remove("faq--cover");
    ep.style.height = "";
    faq.style.marginTop = "";
  };

  const build = () => {
    reset();
    if (!motion.matches) return;

    ep.classList.add("ep--on");
    faq.classList.add("faq--cover");

    const H = window.innerHeight;
    const sheetH = sheet.offsetHeight;
    ep.style.height = sheetH + H + "px";
    faq.style.marginTop = -sheetH + "px";
    requestAnimationFrame(() => ScrollTrigger.refresh());
  };

  build();
  window.addEventListener("resize", () => {
    clearTimeout(timer);
    timer = setTimeout(build, 250);
  });
  window.addEventListener("load", build);
  motion.addEventListener("change", build);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(build);
}
