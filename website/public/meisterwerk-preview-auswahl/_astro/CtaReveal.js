// Sektion "Jede Oberfläche ist einzigartig" (Bild, Linien, CTA-Box, Kontaktformular):
// 1. Beim Hereinscrollen kommt das Hintergrundbild mit den horizontalen Linien per Parallax hoch.
// 2. Dann steht die Sektion (Pin). Die senkrechten Linien und die CTA-Box gleiten von links herein und bleiben stehen.
// 3. Sofort danach läuft die Kontaktformular-Box von links unter der CTA-Box durch, kommt rechts davon heraus
//    und bleibt stehen (rechts derselbe Randabstand wie links bei der CTA-Box). Kurzer Stopp.
// 4. Beim Weiterscrollen schiebt sich die Kontaktbox nach rechts hinaus, zeitversetzt und schneller folgt die CTA-Box
//    nach links, beide verschwinden kurz hintereinander.
// 5. Die Sektion bleibt stehen, "Unsere Exklusive Projekte" schiebt sich von unten darüber.
//    Die Bühne wird nur dort sichtbar gehalten, wo die Projekte noch nicht darüberliegen.
// Unter 1025 px ist die Kontaktbox so breit wie die Zeile und fährt von rechts über die CTA-Box.
import { t as gsap } from "./gsap.CvDoa17S.js";
import "./motion.B5Hf7-lS.js";

const wrap = document.querySelector("[data-mz]");
const cover = document.querySelector("[data-mz-cover]");

if (wrap && cover) {
  const stage = wrap.querySelector(".mz-stage");
  const bg = wrap.querySelector(".mz-bg");
  const cols = [...wrap.querySelectorAll(".mz-col")];
  const contact = wrap.querySelector("[data-mz-contact]");
  const zone = wrap.querySelector(".mz-lockzone");
  const motion = window.matchMedia("(prefers-reduced-motion: no-preference)");
  const wide = window.matchMedia("(min-width: 1025px)");

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
    stage.style.clipPath = "";
    contact.inert = false;
  };

  const build = () => {
    reset();
    if (!motion.matches) return;

    wrap.classList.add("mz--on");
    cover.classList.add("mz-cover--on");

    const vh = window.innerHeight;
    const H = stage.offsetHeight; // Bühne = 100svh

    // Zeitplan in Scroll-Pixeln
    const CTA_IN = 0.8 * vh; // CTA-Box und Linien gleiten herein
    const FORM_IN = 1.2 * vh; // Kontaktbox läuft durch (startet, sobald die CTA-Box steht)
    const HOLD = 0.4 * vh; // kurzer Stopp
    const FORM_OUT = 0.9 * vh; // Kontaktbox nach rechts hinaus
    const CTA_DELAY = 0.28 * vh; // die CTA-Box startet kurz nach der Kontaktbox
    const CTA_OUT = 0.62 * vh; // und ist schneller, beide verschwinden kurz hintereinander
    const tFormIn = CTA_IN;
    const tFormOut = CTA_IN + FORM_IN + HOLD;
    const tCtaOut = tFormOut + CTA_DELAY;
    const D = tFormOut + Math.max(FORM_OUT, CTA_DELAY + CTA_OUT);

    // Wrapper: Bühne + Animation + Strecke, auf der die nächste Sektion darüberfährt.
    wrap.style.height = 2 * H + D + "px";
    cover.style.marginTop = -H + "px";
    // Header bleibt gesperrt, bis die nächste Sektion die Bühne vollständig bedeckt
    zone.style.height = H + D + "px";

    ctx = gsap.context(() => {
      gsap.set([...cols, contact], { x: 0 });
      contact.inert = true; // vor dem Auftritt nicht bedienbar
      const stageW = stage.clientWidth;
      const colOffsets = cols.map((c) => c.getBoundingClientRect().right + 4);
      const box = contact.getBoundingClientRect();
      const fromLeft = -(box.right + 4); // links außerhalb
      const toRight = stageW - box.left + 4; // rechts außerhalb

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

      // Bühne nur dort sichtbar, wo die nächste Sektion noch nicht darüberliegt
      gsap.fromTo(
        stage,
        { clipPath: "inset(0px 0px 0px 0px)" },
        {
          clipPath: `inset(0px 0px ${H}px 0px)`,
          ease: "none",
          scrollTrigger: { trigger: wrap, start: `top+=${D} top`, end: `top+=${D + H} top`, scrub: true },
        }
      );

      // Hauptablauf
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrap,
          start: "top top",
          end: "+=" + D,
          scrub: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            // Formular nur bedienbar, solange die Kontaktbox im Bild steht
            const t = self.progress * D;
            contact.inert = !(t > tFormIn + FORM_IN * 0.6 && t < tFormOut + FORM_OUT * 0.3);
          },
        },
      });

      cols.forEach((col, i) => {
        tl.fromTo(col, { x: -colOffsets[i] }, { x: 0, duration: CTA_IN, ease: "power2.out" }, 0);
        tl.to(col, { x: -colOffsets[i], duration: CTA_OUT, ease: "power2.in" }, tCtaOut);
      });

      // Breit: von links unter der CTA-Box durch. Schmal: von rechts über die CTA-Box.
      const start = wide.matches ? fromLeft : toRight;
      tl.fromTo(contact, { x: start }, { x: 0, duration: FORM_IN, ease: "power2.out" }, tFormIn);
      tl.to(contact, { x: toRight, duration: FORM_OUT, ease: "power2.in" }, tFormOut);
    }, wrap);
  };

  build();
  window.addEventListener("resize", () => {
    clearTimeout(timer);
    timer = setTimeout(build, 250);
  });
  motion.addEventListener("change", build);
  wide.addEventListener("change", build);
}
