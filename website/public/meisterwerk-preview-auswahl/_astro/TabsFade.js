// Meisterwerk Maler Manufaktur: Sektion wird gepinnt, rechts blendet zuerst das Bild aus,
// dann blenden die drei Tabs nacheinander ein und aus. Danach löst sich der Pin.
// Ist ein Tab höher als die Bühne, fährt sein Inhalt beim Scrollen mit nach oben.
import { t as gsap } from "./gsap.CvDoa17S.js";
import "./motion.B5Hf7-lS.js";

const sec = document.querySelector("[data-tb]");

if (sec) {
  const media = sec.querySelector("[data-tb-media]");
  const panels = [...sec.querySelectorAll("[data-tb-panel]")];
  const tabs = [...sec.querySelectorAll("[data-tb-tab]")];
  const tabList = sec.querySelector("[data-tb-tabs]");
  const inners = panels.map((p) => p.querySelector(".tb-inner"));
  const lines = tabs.map((t) => t.querySelector("i"));
  const mq = window.matchMedia("(min-width: 1025px) and (prefers-reduced-motion: no-preference)");

  let ctx = null;
  let timer = null;

  const reset = () => {
    if (ctx) {
      ctx.revert();
      ctx = null;
    }
    sec.classList.remove("tb--pin");
    sec.style.height = "";
    tabList.classList.remove("has-active");
    tabs.forEach((t) => t.classList.remove("is-on"));
    panels.forEach((p) => p.classList.remove("has-more", "has-less"));
    inners.forEach((i) => (i.style.transform = ""));
  };

  const build = () => {
    reset();
    if (!mq.matches) return;

    sec.classList.add("tb--pin");

    const vh = window.innerHeight;
    const FADE = 0.28 * vh; // Ausblenden + Einblenden zusammen
    const HOLD = 0.3 * vh; // Ruhe vor und nach dem Mitfahren
    const LEAD = 0.4 * vh; // Bild bleibt zu Beginn stehen
    const TAIL = 0.25 * vh; // letzter Tab bleibt kurz stehen, dann Pin lösen

    // Wie weit ist der Inhalt höher als sein Rahmen?
    const over = panels.map((p, i) => {
      inners[i].style.transform = "none";
      return Math.max(0, inners[i].offsetHeight - p.clientHeight);
    });

    // Zeitplan in Scroll-Pixeln
    let pos = LEAD;
    const plan = panels.map((_, i) => {
      const start = pos;
      const inAt = start + FADE;
      const travelAt = inAt + HOLD;
      const travelEnd = travelAt + over[i];
      const end = travelEnd + HOLD;
      pos = end;
      return { start, inAt, travelAt, travelEnd, end };
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
      panels.forEach((panel, i) => {
        const done = Math.min(Math.max(t - plan[i].travelAt, 0), over[i]);
        panel.classList.toggle("has-more", i === active && over[i] > 0 && over[i] - done > 8);
        panel.classList.toggle("has-less", i === active && done > 8);
      });
    };

    ctx = gsap.context(() => {
      gsap.set(panels, { autoAlpha: 0 });

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: sec,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.6,
          invalidateOnRefresh: true,
          onUpdate: (self) => update(self.progress * total),
        },
      });

      plan.forEach((p, i) => {
        const out = i === 0 ? media : panels[i - 1];
        tl.to(out, { autoAlpha: 0, duration: FADE / 2 }, p.start);
        tl.to(panels[i], { autoAlpha: 1, duration: FADE / 2 }, p.start + FADE / 2);

        const slotEnd = i < plan.length - 1 ? plan[i + 1].start : p.end;
        tl.fromTo(lines[i], { scaleX: 0 }, { scaleX: 1, duration: slotEnd - (p.start + FADE / 2) }, p.start + FADE / 2);

        if (over[i] > 0) tl.to(inners[i], { y: -over[i], duration: over[i] }, p.travelAt);
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
