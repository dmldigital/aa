import { gsap, ScrollTrigger } from './motion';

/*
 * Zeitleisten-Szenen, gemeinsam für „Über uns“ (/studio/) und die Teammitglieder-Seiten.
 *
 * Desktop (initTimelineDesktop, Szene `[data-tl-scene]`): Die Linie steht schon. Ein Foto (`[data-tl-founder]`, optional)
 * gleitet ganz sanft von links an seinen Platz, danach fahren die Meilensteine nacheinander aus dem Linienanfang an
 * ihre Plätze, und ihr Text blendet aus der Linie auf. Läuft einmal, sobald die Zeitleiste im Bild ist. Danach gelten
 * die Hover-Effekte (Klasse `is-ready`, Regeln in global.css).
 *
 * Handy und Tablet (initTimelinePin, Liste `[data-tlm]`): kein Pin. Titel und Jahre steigen beim Hereinscrollen
 * nacheinander weich auf. Reduzierte Bewegung: alles steht sofort.
 */

export function initTimelineDesktop() {
  document.querySelectorAll<HTMLElement>('[data-tl-scene]').forEach((scene) => {
    const mm = gsap.matchMedia();
    mm.add('(min-width: 64.0625rem) and (prefers-reduced-motion: no-preference)', () => {
      const founder = scene.querySelector<HTMLElement>('[data-tl-founder]');
      const items = [...scene.querySelectorAll<HTMLElement>('[data-tl-item]')];
      if (!items.length) return;

      let tl: gsap.core.Timeline | undefined;
      let trigger: ScrollTrigger | undefined;
      let cancelled = false;

      const build = () => {
        if (cancelled) return;
        // Maße im Ruhezustand messen, bevor etwas verschoben wird
        const first = items[0].getBoundingClientRect();
        const lineY = first.top + first.height / 2;
        const offsets = items.map((it) => first.left - it.getBoundingClientRect().left);
        const texts = items.map((it) => [...it.querySelectorAll<HTMLElement>('[data-tl-text]')]);

        if (founder) gsap.set(founder, { x: -(founder.getBoundingClientRect().right + 24), autoAlpha: 0 });
        items.forEach((it, i) => gsap.set(it, { x: offsets[i], autoAlpha: 0 }));
        texts.flat().forEach((t) => {
          const r = t.getBoundingClientRect();
          gsap.set(t, { autoAlpha: 0, y: r.top + r.height / 2 < lineY ? 18 : -18 });
        });
        scene.querySelectorAll('[data-tl-pending]').forEach((el) => el.removeAttribute('data-tl-pending'));

        tl = gsap.timeline({
          paused: true,
          onComplete: () => {
            gsap.set([...(founder ? [founder] : []), ...items, ...texts.flat()], {
              clearProps: 'transform,opacity,visibility',
            });
            scene.classList.add('is-ready'); // erst jetzt gelten die Hover-Effekte
          },
        });
        if (founder) {
          tl.to(founder, { x: 0, duration: 1.8, ease: 'power2.out' }, 0.2);
          tl.to(founder, { autoAlpha: 1, duration: 1, ease: 'power1.out' }, 0.2);
        }
        const start = founder ? 1.7 : 0.3;
        items.forEach((it, i) => {
          const at = start + i * 0.2;
          tl!.to(it, { x: 0, duration: 1.3, ease: 'power3.out' }, at);
          tl!.to(it, { autoAlpha: 1, duration: 0.3, ease: 'none' }, at);
          tl!.to(texts[i], { autoAlpha: 1, y: 0, duration: 1, ease: 'power2.out', stagger: 0.1 }, at + 0.75);
        });
        trigger = ScrollTrigger.create({
          trigger: scene,
          start: 'top 85%',
          once: true,
          onEnter: () => tl?.play(),
        });
      };

      // Erst nach Schrift und Bildern messen
      const ready = document.fonts ? document.fonts.ready : Promise.resolve();
      ready.then(() => requestAnimationFrame(build));

      return () => {
        cancelled = true;
        trigger?.kill();
        tl?.kill();
        scene.classList.remove('is-ready');
        gsap.set(
          [...(founder ? [founder] : []), ...items, ...scene.querySelectorAll('[data-tl-text]')],
          { clearProps: 'transform,opacity,visibility' },
        );
      };
    });
  });
}

export function initTimelinePin() {
  document.querySelectorAll<HTMLElement>('[data-tlm]').forEach((tlm) => {
    const mm = gsap.matchMedia();
    mm.add('(max-width: 1024.98px) and (prefers-reduced-motion: no-preference)', () => {
      const steps = [...tlm.querySelectorAll<HTMLElement>('[data-tlm-step]')];
      gsap.set(steps, { y: 28, autoAlpha: 0 });
      const batch = ScrollTrigger.batch(steps, {
        start: 'top 88%',
        once: true,
        onEnter: (els) =>
          gsap.to(els, { y: 0, autoAlpha: 1, duration: 1.1, ease: 'power3.out', stagger: 0.12, overwrite: true }),
      });
      return () => {
        batch.forEach((t) => t.kill());
        gsap.set(steps, { clearProps: 'transform,opacity,visibility' });
      };
    });
  });
}
