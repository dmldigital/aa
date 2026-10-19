// Meisterwerk Maler Manufaktur: Sektion wird gepinnt, rechts blendet zuerst das Bild aus,
// dann blenden die drei Tabs nacheinander sanft ein und aus. Danach löst sich der Pin.
// Die Tab-Texte passen immer in die Bühne (100vh): Schrift und Abstände werden bei Bedarf verkleinert.
import { t as gsap } from "./gsap.CvDoa17S.js";
import "./motion.B5Hf7-lS.js";

const sec = document.querySelector("[data-tb]");

if (sec) {
  const media = sec.querySelector("[data-tb-media]");
  const view = sec.querySelector(".tb-view");
  const panels = [...sec.querySelectorAll("[data-tb-panel]")];
  const tabs = [...sec.querySelectorAll("[data-tb-tab]")];
  const tabList = sec.querySelector("[data-tb-tabs]");
  const inners = panels.map((p) => p.querySelector(".tb-inner"));
  const lines = tabs.map((t) => t.querySelector("i"));
  const mq = window.matchMedia(
    "(min-width: 1200px) and (min-height: 600px) and (prefers-reduced-motion: no-preference)"
  );

  const MIN_SCALE = 0.62;
  let ctx = null;
  let timer = null;

  const reset = () => {
    if (ctx) {
      ctx.revert();
      ctx = null;
    }
    sec.classList.remove("tb--pin");
    sec.style.height = "";
    sec.style.removeProperty("--tb-s");
    tabList.classList.remove("has-active");
    tabs.forEach((t) => t.classList.remove("is-on"));
  };

  // Schrift und Abstände so weit verkleinern, dass der höchste Tab in die Bühne passt
  const fit = () => {
    const avail = view.clientHeight;
    let scale = 1;
    sec.style.setProperty("--tb-s", "1");
    for (let k = 0; k < 8; k++) {
      const tallest = Math.max(...inners.map((i) => i.offsetHeight));
      if (tallest <= avail * 0.97) break;
      scale = Math.max(MIN_SCALE, scale * Math.sqrt((avail * 0.96) / tallest));
      sec.style.setProperty("--tb-s", scale.toFixed(3));
      if (scale === MIN_SCALE) break;
    }
  };

  const build = () => {
    reset();
    if (!mq.matches) return;

    sec.classList.add("tb--pin");
    fit();

    const vh = window.innerHeight;
    const FADE = 0.36 * vh; // Ausblenden + Einblenden zusammen
    const HOLD = 0.6 * vh; // jeder Tab bleibt eine Weile stehen
    const LEAD = 0.4 * vh; // Bild bleibt zu Beginn stehen
    const TAIL = 0.2 * vh; // letzter Tab bleibt kurz stehen, dann Pin lösen

    // Zeitplan in Scroll-Pixeln
    let pos = LEAD;
    const plan = panels.map(() => {
      const start = pos;
      const end = start + FADE + HOLD;
      pos = end;
      return { start, end };
    });
    const total = pos + TAIL;

    sec.style.height = vh + total + "px";

    const update = (t) => {
      let active = -1;
      plan.forEach((p, i) => {
        if (t >= p.start + FADE / 2) active = i;
      });
      tabList.classList.toggle("has-active", active >= 0);
      tabs.forEach((tab, i) => tab.classList.toggle("is-on", i === active));
    };

    ctx = gsap.context(() => {
      gsap.set(panels, { autoAlpha: 0 });

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: sec,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.8,
          invalidateOnRefresh: true,
          onUpdate: (self) => update(self.progress * total),
        },
      });

      plan.forEach((p, i) => {
        const out = i === 0 ? media : panels[i - 1];
        tl.to(out, { autoAlpha: 0, duration: FADE / 2, ease: "sine.inOut" }, p.start);
        tl.to(panels[i], { autoAlpha: 1, duration: FADE / 2, ease: "sine.inOut" }, p.start + FADE / 2);

        const slotEnd = i < plan.length - 1 ? plan[i + 1].start : p.end;
        tl.fromTo(lines[i], { scaleX: 0 }, { scaleX: 1, duration: slotEnd - (p.start + FADE / 2) }, p.start + FADE / 2);
      });

      tl.to({}, { duration: TAIL }, plan[plan.length - 1].end);
    }, sec);
  };

  build();
  window.addEventListener("resize", () => {
    clearTimeout(timer);
    timer = setTimeout(build, 250);
  });
  mq.addEventListener("change", build);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(build);
}
