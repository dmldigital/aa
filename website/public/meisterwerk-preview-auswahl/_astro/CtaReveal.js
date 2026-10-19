// Sektion "Jede Oberfläche ist einzigartig" (Bild, Linien, CTA-Box):
// 1. Beim Hereinscrollen kommt das Hintergrundbild mit den horizontalen Linien per Parallax hoch.
// 2. Dann steht die Sektion (Pin). Beim Scrollen gleiten die senkrechten Linien und die CTA-Box von links herein.
// 3. Kurzer Stopp, dann gleiten sie nach links wieder hinaus.
// 4. Die Sektion bleibt stehen, "Unsere Exklusive Projekte" schiebt sich von unten darüber.
import { t as gsap } from "./gsap.CvDoa17S.js";
import "./motion.B5Hf7-lS.js";

const wrap = document.querySelector("[data-mz]");
const cover = document.querySelector("[data-mz-cover]");

if (wrap && cover) {
  const stage = wrap.querySelector(".mz-stage");
  const bg = wrap.querySelector(".mz-bg");
  const cols = [...wrap.querySelectorAll(".mz-col")];
  const zone = wrap.querySelector(".mz-lockzone");
  const mq = window.matchMedia("(prefers-reduced-motion: no-preference)");

  let ctx = null;
  let timer = null;

  const reset = () => {
    if (ctx) {
      ctx.revert();
      ctx = null;
    }
    wrap.classList.remove("mz--on");
    cover.classList.remove("mz-cover--on");
    wrap.style.height = "";
    cover.style.marginTop = "";
    zone.style.height = "0";
  };

  const build = () => {
    reset();
    if (!mq.matches) return;

    wrap.classList.add("mz--on");
    cover.classList.add("mz-cover--on");

    const vh = window.innerHeight;
    const H = stage.offsetHeight; // Bühne = 100svh
    const IN = 0.4 * vh; // Linien und Box gleiten herein
    const HOLD = 0.3 * vh; // kurzer Stopp
    const OUT = 0.4 * vh; // Linien und Box gleiten hinaus
    const D = IN + HOLD + OUT;

    // Wrapper: Bühne + Animation + Strecke, auf der die nächste Sektion darüberfährt.
    // Die nächste Sektion beginnt eine Bühnenhöhe weiter oben und deckt die stehende Bühne zu.
    wrap.style.height = 2 * H + D + "px";
    cover.style.marginTop = -H + "px";
    // Header bleibt gesperrt, bis die nächste Sektion die Bühne vollständig bedeckt
    zone.style.height = H + D + "px";

    ctx = gsap.context(() => {
      gsap.set(cols, { x: 0 });
      const offsets = cols.map((c) => c.getBoundingClientRect().right + 4);

      // Parallax beim Hereinscrollen: Das Bild wandert langsamer als die Sektion
      gsap.fromTo(
        bg,
        { y: () => -0.16 * stage.offsetHeight },
        {
          y: 0,
          ease: "none",
          scrollTrigger: { trigger: wrap, start: "top bottom", end: "top top", scrub: true, invalidateOnRefresh: true },
        }
      );

      // Senkrechte Linien und CTA-Box: herein, Stopp, hinaus
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrap,
          start: "top top",
          end: "+=" + D,
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
      });
      cols.forEach((col, i) => {
        tl.fromTo(col, { x: -offsets[i] }, { x: 0, duration: IN, ease: "power2.out" }, 0);
        tl.to(col, { x: -offsets[i], duration: OUT, ease: "power2.in" }, IN + HOLD);
      });
    }, wrap);
  };

  build();
  window.addEventListener("resize", () => {
    clearTimeout(timer);
    timer = setTimeout(build, 250);
  });
  mq.addEventListener("change", build);
}
