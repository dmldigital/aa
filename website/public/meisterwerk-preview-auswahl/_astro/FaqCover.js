// FAQ schiebt sich von unten über "Unsere Exklusive Projekte", wie diese Sektion zuvor über die Bild-Sektion:
// Die Projekte-Sektion bleibt stehen (Sticky), das FAQ beginnt eine Sektionshöhe weiter oben und deckt sie zu.
// Der Wrapper der Projekte ist dafür eine Fensterhöhe länger. Bei reduzierter Bewegung bleibt alles wie vorher.
// Der Header bleibt nur gesperrt, solange das FAQ noch darüberfährt; danach gilt wieder hoch = ein, runter = aus.
import { r as ScrollTrigger } from "./motion.B5Hf7-lS.js";

const ep = document.querySelector("[data-ep]");
const sheet = ep && ep.querySelector("[data-ep-sheet]");
const faq = document.querySelector("[data-faq]");
const zone = ep && ep.querySelector(".ep-lockzone");

if (ep && sheet && faq && zone) {
  const motion = window.matchMedia("(prefers-reduced-motion: no-preference)");
  let timer = null;

  const reset = () => {
    ep.classList.remove("ep--on");
    faq.classList.remove("faq--cover");
    ep.style.height = "";
    faq.style.marginTop = "";
    faq.style.minHeight = "";
    zone.style.height = "0";
  };

  const build = () => {
    reset();
    if (!motion.matches) return;

    ep.classList.add("ep--on");
    faq.classList.add("faq--cover");

    const H = window.innerHeight;
    const sheetH = sheet.offsetHeight;
    ep.style.height = sheetH + H + "px";
    zone.style.height = H + "px";
    faq.style.marginTop = -sheetH + "px";
    faq.style.minHeight = sheetH + "px"; // das FAQ muss die Projekte vollständig überdecken
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
