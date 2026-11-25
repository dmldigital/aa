// Startseite, Desktop (ab 1024 px, mit Bewegung): Übergang vom Hero in die Willkommen-Szene. Das erste Bild der Szene ist das
// letzte Bild des Hero-Flugs (`data-ws-end`). Solange die Fahrt noch nicht gelaufen ist, steht dieses Bild bildschirmfüllend
// über dem Anfang der Szene, mit demselben Ausschnitt (cover, 42 % / 50 %) und demselben dunklen Verlauf wie im Hero.
// Am Ende der Fahrt springt die Seite ohne Scrollbewegung an den Anfang der Szene (HeroFull.astro, `mwWelcomeEnter`), der
// Wechsel ist unsichtbar; dann schrumpft das Bild von selbst (1,2 s) auf seinen Platz, solange ist das Scrollen gesperrt.
// Danach bleibt es dort, auch beim Zurückscrollen (die Fahrt läuft nur einmal je Seitenaufruf, Ereignis `mw-flug-ende`).
// Wurde die Seite weiter unten geladen oder per Anker angesprungen, steht das Bild gleich an seinem Platz.
// Handy, Tablet und reduzierte Bewegung: unverändert (normales erstes Bild).
import { gsap, ScrollTrigger, lenis } from "../motion";

const scene = document.querySelector("[data-welcome-scene][data-ws-home]");
const first = scene && scene.querySelector("[data-ws-img]");
const endImg = first && first.querySelector("[data-ws-end]");

if (endImg) {
  const mq = window.matchMedia("(min-width: 1024px) and (prefers-reduced-motion: no-preference)");
  const DUR = 1.2;
  let ctx = null;
  let holder = null;
  let shade = null;
  let tween = null;
  let timer = null;
  let onEnde = null;
  let placed = false; // Bild steht an seinem Platz (Fahrt gelaufen oder übersprungen)

  const flugDone = () => window.mwFlugDone === true || window.scrollY > 10 || !!location.hash;

  const teardown = () => {
    if (onEnde) {
      window.removeEventListener("mw-flug-ende", onEnde);
      onEnde = null;
    }
    if (tween) {
      tween.kill();
      tween = null;
    }
    if (ctx) {
      ctx.revert();
      ctx = null;
    }
    if (shade) {
      shade.remove();
      shade = null;
    }
    if (holder) {
      holder.parentNode.insertBefore(first, holder);
      holder.remove();
      holder = null;
    }
    window.mwWelcomeEnter = false;
  };

  const block = (e) => {
    if (e.cancelable) e.preventDefault();
  };
  const lockScroll = (on) => {
    if (lenis) on ? lenis.stop() : lenis.start();
    const fn = on ? window.addEventListener : window.removeEventListener;
    fn("wheel", block, { passive: false, capture: true });
    fn("touchmove", block, { passive: false, capture: true });
  };

  const build = () => {
    teardown();
    if (!mq.matches) return;
    if (flugDone()) placed = true;
    window.mwWelcomeEnter = true;
    if (placed) return; // Bild bleibt einfach in der Spalte stehen

    const vw = document.documentElement.clientWidth;
    const vh = window.innerHeight;
    const sceneRect = scene.getBoundingClientRect();
    const rect = first.getBoundingClientRect();
    const w0 = rect.width;
    const h0 = rect.height;
    const left0 = rect.left;
    const top0 = rect.top - sceneRect.top; // Lage im Fenster, wenn die Szene oben steht

    // Platzhalter in Bildgröße: hält die Spalte zusammen, während das Bild bildschirmfüllend darüber liegt
    holder = document.createElement("div");
    holder.style.cssText = `height:${h0}px;position:relative;z-index:30`;
    first.parentNode.insertBefore(holder, first);
    holder.appendChild(first);

    // Gleicher Verlauf wie über dem Hero-Bild (HeroFull.astro)
    shade = document.createElement("div");
    shade.setAttribute("aria-hidden", "true");
    shade.style.cssText =
      "position:absolute;inset:0;pointer-events:none;background:linear-gradient(rgb(0 0 0/0.38),transparent 24%,transparent 38%,rgb(0 0 0/0.62))";

    ctx = gsap.context(() => {
      // absolut: das große Bild darf die Spaltenbreiten nicht verschieben (sonst misst welcome-zoom.js das letzte Bild zu breit)
      gsap.set(first, { position: "absolute", left: 0, top: 0, x: -left0, y: -top0, width: vw, height: vh });
      gsap.set(first.firstElementChild, { height: "100%" });
      first.appendChild(shade);
    }, scene);

    const shrink = (animate) => {
      if (placed) return;
      placed = true;
      const done = () => {
        lockScroll(false);
        teardown();
        gsap.set([first, first.firstElementChild], { clearProps: "all" });
        window.mwWelcomeEnter = true; // für den Hero weiterhin „einmalig“
        ScrollTrigger.refresh();
      };
      if (!animate) return done();
      lockScroll(true);
      tween = gsap
        .timeline({ onComplete: done })
        .to(first, { x: 0, y: 0, width: w0, height: h0, duration: DUR, ease: "power3.inOut" }, 0)
        .to(shade, { opacity: 0, duration: DUR * 0.8, ease: "power1.out" }, 0);
    };
    onEnde = (e) => shrink(!!(e.detail && e.detail.animate));
    window.addEventListener("mw-flug-ende", onEnde);
  };

  build();
  // Nur bei echter Breitenänderung neu aufbauen
  let lastWidth = window.innerWidth;
  window.addEventListener("resize", () => {
    if (window.innerWidth === lastWidth) return;
    lastWidth = window.innerWidth;
    clearTimeout(timer);
    timer = setTimeout(build, 250);
  });
  window.addEventListener("load", () => {
    if (!placed) build();
  });
  mq.addEventListener("change", build);
  if (document.fonts && document.fonts.ready)
    document.fonts.ready.then(() => {
      if (!placed) build();
    });
}
