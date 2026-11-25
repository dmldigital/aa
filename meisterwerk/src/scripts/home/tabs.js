// Tab-Sektionen: „Meisterliche Malerarbeiten“ (Startseite), die Firmenskills bei Meisterwerke Exklusive und das FAQ.
// Die Titel sind echte Tabs, der Inhalt klappt direkt darunter auf, immer nur ein Tab ist offen (öffnet sich einer, schließt der andere).
// Desktop (ab 1025 px, Startseite und Exklusive): Text links, rechts die Tabs; der erste Tab ist offen, ein Klick auf einen anderen
//   tauscht den offenen Tab, der offene bleibt immer offen (die rechte Seite ist nie leer). Keine Scroll-Animation, kein Pin.
// Handy und Tablet sowie FAQ (data-tb-accordion): alle Tabs zu Beginn geschlossen, ein Klick auf den offenen Tab schließt ihn,
//   beim FAQ über beide Spalten hinweg.
import { ScrollTrigger, lenis } from "../motion";

document.querySelectorAll("[data-tb]").forEach(initTabs);

function initTabs(sec) {
  const view = sec.querySelector(".tb-view");
  const panels = [...sec.querySelectorAll("[data-tb-panel]")];
  const tabs = [...sec.querySelectorAll("[data-tb-tab]")];
  const tabLists = [...sec.querySelectorAll("[data-tb-tabs]")];
  const buttons = tabs.map((t) => t.querySelector(".tb-tab"));
  const faq = sec.hasAttribute("data-tb-accordion");
  const desktop = window.matchMedia("(min-width: 1025px)");

  let controller = null;
  let timer = null;

  const reset = () => {
    if (controller) {
      controller.abort();
      controller = null;
    }
    // Tab-Inhalte zurück in die Bühne, Aufklapp-Hüllen entfernen
    panels.forEach((p) => view.appendChild(p));
    tabs.forEach((li) => li.querySelector(".tb-collapse")?.remove());
    sec.classList.remove("tb--ui");
    tabLists.forEach((l) => l.setAttribute("aria-hidden", "true"));
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
  };

  // ---------- Tab-Liste zum Antippen ----------
  const build = () => {
    reset();
    sec.classList.add("tb--ui");
    tabLists.forEach((l) => l.removeAttribute("aria-hidden"));
    controller = new AbortController();
    const keepOpen = desktop.matches && !faq; // Desktop: immer ein Tab offen

    let current = -1;
    let settle = null;
    // Öffnet sich ein Tab, während ein anderer offen war, schiebt das Zuklappen den Inhalt: Der neue Tab würde mitten
    // im Feld beginnen. Nach dem Zuklappen wird deshalb seine Kopfzeile unter die schwebende Menü-Pille gerückt (nur Handy/Tablet).
    const alignTo = (i, wasOpen) => {
      clearTimeout(settle);
      settle = setTimeout(() => {
        const top = buttons[i].getBoundingClientRect().top;
        if (!wasOpen && top >= 90 && top < innerHeight * 0.55) return;
        const y = top + window.scrollY - 96;
        if (lenis) lenis.scrollTo(y, { duration: 0.9 });
        else window.scrollTo({ top: y, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
      }, wasOpen ? 640 : 120);
    };
    const toggle = (index, user = false) => {
      const was = current;
      current = current === index && !keepOpen ? -1 : index;
      if (user && current >= 0 && !desktop.matches) alignTo(current, was >= 0);
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
      buttons[i].addEventListener("click", () => toggle(i, true), { signal: controller.signal });
    });
    toggle(keepOpen ? 0 : -1);
    requestAnimationFrame(() => ScrollTrigger.refresh());
  };

  build();
  // Nur bei echter Breitenänderung neu aufbauen. Auf dem Handy ändert das Ein- und Ausfahren der Browserleiste nur die
  // Höhe; ein Neuaufbau mit neuer Fensterhöhe hat dabei Inhalte und Scrollposition springen lassen.
  let lastWidth = window.innerWidth;
  window.addEventListener("resize", () => {
    if (window.innerWidth === lastWidth) return;
    lastWidth = window.innerWidth;
    clearTimeout(timer);
    timer = setTimeout(build, 250);
  });
  desktop.addEventListener("change", build);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(build);
}
