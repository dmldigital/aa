// Tab-Sektionen ("Meisterliche Malerarbeiten für Wohnträume und Lebensräume" und FAQ).
// Desktop (ab 1200 px Breite und 600 px Höhe, volle Bewegung): Die Sektion wird gepinnt. Rechts blendet zuerst das Bild
// aus, dann blenden die Tabs nacheinander sanft ein und aus. Danach löst sich der Pin. Die Texte passen immer in 100vh:
// Schrift und Abstände werden bei Bedarf verkleinert.
// Handy, Tablet, reduzierte Bewegung: Die Titel sind echte Tabs zum Antippen. Der Inhalt klappt direkt darunter auf,
// immer nur ein Tab ist offen.
import { t as gsap } from "./gsap.CvDoa17S.js";
import { r as ScrollTrigger } from "./motion.B5Hf7-lS.js";

document.querySelectorAll("[data-tb]").forEach(initTabs);

function initTabs(sec) {
  const media = sec.querySelector("[data-tb-media]");
  const view = sec.querySelector(".tb-view");
  const stage = sec.querySelector(".tb-sticky");
  const left = sec.querySelector(".tb-left");
  const panels = [...sec.querySelectorAll("[data-tb-panel]")];
  const tabs = [...sec.querySelectorAll("[data-tb-tab]")];
  const tabList = sec.querySelector("[data-tb-tabs]");
  const buttons = tabs.map((t) => t.querySelector(".tb-tab"));
  const inners = panels.map((p) => p.querySelector(".tb-inner"));
  const lines = tabs.map((t) => t.querySelector("i"));
  const fadeShare = parseFloat(sec.dataset.tbFade) || 0.36;
  const mq = window.matchMedia(
    "(min-width: 1200px) and (min-height: 600px) and (prefers-reduced-motion: no-preference)"
  );

  const MIN_SCALE = 0.62;
  let ctx = null;
  let controller = null;
  let timer = null;

  const reset = () => {
    if (ctx) {
      ctx.revert();
      ctx = null;
    }
    if (controller) {
      controller.abort();
      controller = null;
    }
    // Tab-Inhalte zurück in die Bühne, Aufklapp-Hüllen entfernen
    panels.forEach((p) => view.appendChild(p));
    tabs.forEach((li) => li.querySelector(".tb-collapse")?.remove());
    sec.classList.remove("tb--pin", "tb--ui");
    sec.style.height = "";
    sec.style.removeProperty("--tb-s");
    left.style.transform = "";
    tabList.setAttribute("aria-hidden", "true");
    tabList.classList.remove("has-active");
    tabs.forEach((li, i) => {
      li.classList.remove("is-on");
      buttons[i].setAttribute("tabindex", "-1");
      buttons[i].removeAttribute("aria-expanded");
    });
    panels.forEach((p) => {
      p.removeAttribute("role");
      p.inert = false;
    });
    inners.forEach((i) => (i.style.transform = ""));
  };

  // ---------- Tab-Liste zum Antippen ----------
  const buildTabs = () => {
    sec.classList.add("tb--ui");
    tabList.removeAttribute("aria-hidden");
    controller = new AbortController();

    let current = -1;
    const toggle = (index) => {
      current = current === index ? -1 : index;
      tabs.forEach((li, k) => {
        const open = k === current;
        const collapse = li.querySelector(".tb-collapse");
        collapse.classList.toggle("is-open", open);
        collapse.inert = !open;
        buttons[k].setAttribute("aria-expanded", String(open));
        li.classList.toggle("is-on", open);
      });
    };

    tabs.forEach((li, i) => {
      const collapse = document.createElement("div");
      collapse.className = "tb-collapse";
      const inner = document.createElement("div");
      inner.className = "tb-collapse-inner";
      inner.appendChild(panels[i]);
      collapse.appendChild(inner);
      li.appendChild(collapse);
      panels[i].setAttribute("role", "region");
      buttons[i].removeAttribute("tabindex");
      buttons[i].addEventListener("click", () => toggle(i), { signal: controller.signal });
    });
    toggle(0);
  };

  // ---------- Pin mit Ein- und Ausblenden ----------
  // Schrift und Abstände so weit verkleinern, dass der höchste Tab in die Bühne passt
  const fitPanels = () => {
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

  // Lange Tab-Listen (FAQ) links ebenfalls in die Bühne passen lassen
  const fitLeft = () => {
    left.style.transform = "";
    const avail = stage.clientHeight - 100;
    const height = left.offsetHeight;
    if (height > avail) {
      const scale = Math.max(0.55, avail / height);
      left.style.transformOrigin = "0 50%";
      left.style.transform = `scale(${scale.toFixed(3)})`;
    }
  };

  const buildPin = () => {
    sec.classList.add("tb--pin");
    fitPanels();
    fitLeft();

    const vh = window.innerHeight;
    const FADE = fadeShare * vh; // Ausblenden + Einblenden zusammen
    const LEAD = 0.4 * vh; // Bild bleibt zu Beginn stehen
    const TAIL = 0.2 * vh; // letzter Tab bleibt kurz stehen, dann Pin lösen
    const holdOf = (i) => (parseFloat(panels[i].dataset.hold) || 0.6) * vh; // jeder Tab bleibt eine Weile stehen

    // Zeitplan in Scroll-Pixeln
    let pos = LEAD;
    const plan = panels.map((_, i) => {
      const start = pos;
      const end = start + FADE + holdOf(i);
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

  const build = () => {
    reset();
    if (mq.matches) buildPin();
    else buildTabs();
    requestAnimationFrame(() => ScrollTrigger.refresh());
  };

  build();
  window.addEventListener("resize", () => {
    clearTimeout(timer);
    timer = setTimeout(build, 250);
  });
  mq.addEventListener("change", build);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(build);
}
