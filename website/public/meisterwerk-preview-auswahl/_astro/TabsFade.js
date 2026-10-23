// Tab-Sektionen ("Meisterliche Malerarbeiten" und FAQ).
// Meisterliche Malerarbeiten, Desktop (ab 1200 px Breite und 600 px Höhe, volle Bewegung): Die Sektion wird gepinnt.
// Rechts steht statt des Bildes ein feststehender Trennstrich. Die Tab-Texte gleiten von links unter ihm hindurch nach
// rechts heraus und beim nächsten Tab nach rechts wieder weg. Danach löst sich der Pin.
// Die Texte passen immer in 100vh: Abstände und notfalls die Stufe (small) werden verkleinert, die Schrift bleibt in der Skala.
// Passt es so nicht (sehr niedrige Fenster), gibt es statt des Pins die aufklappbaren Tabs.
// FAQ (data-tb-accordion), Handy, Tablet, reduzierte Bewegung: Die Titel sind echte Tabs zum Antippen. Der Inhalt klappt
// direkt darunter auf, immer nur ein Tab ist offen (öffnet sich einer, schließt der andere), auch über beide FAQ-Spalten.
import { t as gsap } from "./gsap.CvDoa17S.js";
import { r as ScrollTrigger } from "./motion.B5Hf7-lS.js";

document.querySelectorAll("[data-tb]").forEach(initTabs);

function initTabs(sec) {
  const view = sec.querySelector(".tb-view");
  const right = sec.querySelector(".tb-right");
  const stage = sec.querySelector(".tb-sticky");
  const left = sec.querySelector(".tb-left");
  const panels = [...sec.querySelectorAll("[data-tb-panel]")];
  const tabs = [...sec.querySelectorAll("[data-tb-tab]")];
  const tabLists = [...sec.querySelectorAll("[data-tb-tabs]")];
  const tabList = tabLists[0];
  const buttons = tabs.map((t) => t.querySelector(".tb-tab"));
  const inners = panels.map((p) => p.querySelector(".tb-inner"));
  const accordionOnly = sec.hasAttribute("data-tb-accordion");
  const mq = window.matchMedia(
    "(min-width: 1200px) and (min-height: 600px) and (prefers-reduced-motion: no-preference)"
  );

  const MIN_SCALE = 0.4;
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
    // Tab-Inhalte zurück in die Bühne, Aufklapp-Hüllen und Trennstrich entfernen
    right.querySelector(".tb-line")?.remove();
    panels.forEach((p) => view.appendChild(p));
    tabs.forEach((li) => li.querySelector(".tb-collapse")?.remove());
    sec.classList.remove("tb--pin", "tb--ui", "tb--compact");
    sec.style.height = "";
    sec.style.removeProperty("--tb-s");
    left.style.transform = "";
    tabLists.forEach((l) => {
      l.setAttribute("aria-hidden", "true");
      l.classList.remove("has-active");
    });
    tabs.forEach((li, i) => {
      li.classList.remove("is-on");
      buttons[i].setAttribute("tabindex", "-1");
      buttons[i].removeAttribute("aria-expanded");
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
    tabLists.forEach((l) => l.removeAttribute("aria-hidden"));
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
    toggle(accordionOnly ? -1 : 0); // FAQ: zu Beginn alle Tabs geschlossen
  };

  // ---------- Pin mit Ein- und Ausblenden ----------
  // Die Schrift bleibt in den Stufen der Skala. Passt der höchste Tab nicht in die Bühne, werden zuerst nur die Abstände
  // (--tb-s) verkleinert, reicht das nicht, schaltet .tb--compact Lede, Listenpunkte, Hinweis und Tabellenzellen auf die Stufe small.
  const fitPanels = () => {
    const avail = view.clientHeight * 0.97;
    const tallest = () => Math.max(...inners.map((i) => i.offsetHeight));
    sec.classList.remove("tb--compact");
    for (const compact of [false, true]) {
      sec.classList.toggle("tb--compact", compact);
      for (const scale of [1, 0.85, 0.7, 0.55, MIN_SCALE]) {
        sec.style.setProperty("--tb-s", String(scale));
        if (tallest() <= avail) return true;
      }
    }
    return false;
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

  // false, wenn der höchste Tab selbst mit den kleinsten Abständen und der Stufe small nicht in die Bühne passt (niedrige Fenster)
  const buildPin = () => {
    sec.classList.add("tb--pin");
    if (!fitPanels()) return false;
    fitLeft();

    const vh = window.innerHeight;
    // Tempo wie der Bilderstreifen im Hero (dort 0,2 px Bewegung je Scroll-Pixel), hier etwas schneller: 0,3.
    // Der Text legt nur eine kurze Strecke zurück und blendet dabei ein bzw. aus.
    const SPEED = 0.3;
    const TRAVEL = Math.min(300, window.innerWidth * 0.21);
    const HALF = TRAVEL / SPEED; // Scroll-Pixel für Einblenden oder Ausblenden
    const LEAD = 0.25 * vh; // zu Beginn steht nur der Strich
    const TAIL = 0.2 * vh; // letzter Tab bleibt kurz stehen, dann Pin lösen
    const holdOf = (i) => (parseFloat(panels[i].dataset.hold) || 0.5) * vh; // jeder Tab bleibt eine Weile stehen

    // Zeitplan in Scroll-Pixeln
    let pos = LEAD;
    const plan = panels.map((_, i) => {
      const start = pos;
      const inAt = start + (i > 0 ? HALF * 0.5 : 0); // der neue Text beginnt, wenn der alte halb draußen ist
      const end = inAt + HALF + holdOf(i);
      pos = end;
      return { start, inAt, end };
    });
    const total = pos + TAIL;

    sec.style.height = vh + total + "px";

    const update = (t) => {
      let active = -1;
      plan.forEach((p, i) => {
        if (t >= p.inAt) active = i;
      });
      tabList.classList.toggle("has-active", active >= 0);
      tabs.forEach((tab, i) => tab.classList.toggle("is-on", i === active));
    };

    ctx = gsap.context(() => {
      // Feststehender Trennstrich am linken Rand der Bühne, rechts mit leichtem Schatten (wirkt wie eine Erhebung)
      const line = document.createElement("div");
      line.className = "tb-line";
      line.setAttribute("aria-hidden", "true");
      right.appendChild(line);
      // Der Strich reicht über den höchsten Text hinaus (mittig zur Bühne, höchstens bis kurz vor den Bildschirmrand)
      const tallest = Math.max(...inners.map((inner) => inner.offsetHeight));
      const lineH = Math.min(tallest + 0.16 * vh, stage.clientHeight - 48);
      line.style.height = lineH + "px";
      line.style.top = view.offsetTop + (view.clientHeight - lineH) / 2 + "px";

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: sec,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => update(self.progress * total),
        },
      });

      // Wechsel (Scroll-gesteuert, rückwärts genauso): Zu Beginn steht nur der Strich. Der Text gleitet von links unter
      // dem Strich hindurch nach rechts heraus (die Bühne schneidet nur am Strich ab) und blendet dabei ein. Beim Tab-Wechsel
      // gleitet der alte Text nach rechts und blendet aus, der neue kommt überlappend unter dem Strich heraus.
      gsap.set(panels, { autoAlpha: 1 });
      gsap.set(inners, { x: -TRAVEL, autoAlpha: 0 });

      plan.forEach((p, i) => {
        if (i > 0) {
          tl.to(inners[i - 1], { x: TRAVEL, autoAlpha: 0, duration: HALF, ease: "power2.inOut" }, p.start);
        }
        tl.fromTo(
          inners[i],
          { x: -TRAVEL, autoAlpha: 0 },
          { x: 0, autoAlpha: 1, duration: HALF, ease: "power2.inOut", immediateRender: false },
          p.inAt
        );
      });

      tl.to({}, { duration: TAIL }, plan[plan.length - 1].end);
    }, sec);
    return true;
  };

  const build = () => {
    reset();
    if (!(!accordionOnly && mq.matches && buildPin())) {
      reset();
      buildTabs();
    }
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
