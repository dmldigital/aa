// Tab-Sektionen ("Meisterliche Malerarbeiten" und FAQ).
// Meisterliche Malerarbeiten, Desktop (ab 1200 px Breite und 600 px Höhe, volle Bewegung): Die Sektion wird gepinnt.
// Rechts blendet zuerst das Bild aus, dann blenden die Tabs nacheinander sanft ein und aus. Danach löst sich der Pin.
// Die Texte passen immer in 100vh: Schrift und Abstände werden bei Bedarf verkleinert.
// FAQ (data-tb-select), ab 1025 px: kein Scroll-Effekt. Die Fragen links sind anwählbar, die Antwort steht rechts;
// die alte Antwort schließt sich, dann öffnet sich die neue. Ein goldener Balken gleitet zur gewählten Frage.
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
  const fadeShare = parseFloat(sec.dataset.tbFade) || 0.36;
  const selectMode = sec.hasAttribute("data-tb-select");
  const mq = window.matchMedia(
    "(min-width: 1200px) and (min-height: 600px) and (prefers-reduced-motion: no-preference)"
  );
  const mqSel = window.matchMedia("(min-width: 1025px)");

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
    sec.classList.remove("tb--pin", "tb--ui", "tb--sel");
    tabList.querySelector(".tb-ind")?.remove();
    tabList.removeAttribute("role");
    tabList.removeAttribute("aria-orientation");
    sec.style.height = "";
    sec.style.removeProperty("--tb-s");
    left.style.transform = "";
    tabList.setAttribute("aria-hidden", "true");
    tabList.classList.remove("has-active");
    tabs.forEach((li, i) => {
      li.classList.remove("is-on");
      li.removeAttribute("role");
      buttons[i].setAttribute("tabindex", "-1");
      buttons[i].removeAttribute("aria-expanded");
      buttons[i].removeAttribute("aria-selected");
      buttons[i].removeAttribute("role");
    });
    panels.forEach((p) => {
      p.removeAttribute("role");
      p.classList.remove("is-on");
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

  // ---------- FAQ: Fragen anwählen, Antwort rechts ----------
  const buildSelect = () => {
    sec.classList.add("tb--sel");
    tabList.removeAttribute("aria-hidden");
    tabList.setAttribute("role", "tablist");
    tabList.setAttribute("aria-orientation", "vertical");
    controller = new AbortController();
    const { signal } = controller;

    const ind = document.createElement("span");
    ind.className = "tb-ind";
    ind.setAttribute("aria-hidden", "true");
    tabList.appendChild(ind);

    let current = -1;
    const place = () => {
      const li = tabs[current];
      if (!li) return;
      ind.style.setProperty("--y", li.offsetTop + "px");
      ind.style.height = li.offsetHeight + "px";
    };
    const select = (index, focus) => {
      if (index === current) return;
      current = index;
      tabs.forEach((li, k) => {
        const on = k === index;
        li.classList.toggle("is-on", on);
        buttons[k].setAttribute("aria-selected", String(on));
        buttons[k].tabIndex = on ? 0 : -1;
        panels[k].classList.toggle("is-on", on);
        panels[k].inert = !on;
      });
      place();
      if (focus) buttons[index].focus();
    };

    tabs.forEach((li, i) => {
      li.setAttribute("role", "presentation");
      buttons[i].setAttribute("role", "tab");
      panels[i].setAttribute("role", "tabpanel");
      buttons[i].addEventListener("click", () => select(i), { signal });
      buttons[i].addEventListener(
        "keydown",
        (e) => {
          const n = tabs.length;
          let to = null;
          if (e.key === "ArrowDown" || e.key === "ArrowRight") to = (i + 1) % n;
          else if (e.key === "ArrowUp" || e.key === "ArrowLeft") to = (i - 1 + n) % n;
          else if (e.key === "Home") to = 0;
          else if (e.key === "End") to = n - 1;
          if (to !== null) {
            e.preventDefault();
            select(to, true);
          }
        },
        { signal }
      );
    });

    // erste Frage steht sofort, der Balken springt ohne Animation an seinen Platz
    ind.style.transition = "none";
    select(0);
    ind.getBoundingClientRect();
    ind.style.transition = "";
    window.addEventListener("load", place, { signal });
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

      });

      tl.to({}, { duration: TAIL }, plan[plan.length - 1].end);
    }, sec);
  };

  const build = () => {
    reset();
    if (selectMode) {
      if (mqSel.matches) buildSelect();
      else buildTabs();
    } else if (mq.matches) buildPin();
    else buildTabs();
    requestAnimationFrame(() => ScrollTrigger.refresh());
  };

  build();
  window.addEventListener("resize", () => {
    clearTimeout(timer);
    timer = setTimeout(build, 250);
  });
  mq.addEventListener("change", build);
  mqSel.addEventListener("change", build);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(build);
}
