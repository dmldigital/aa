import { gsap, ScrollTrigger } from './motion';

/*
 * Zeitleisten-Szenen, gemeinsam für „Über uns“ (/studio/) und die Teammitglieder-Seiten.
 *
 * Desktop (initTimelineDesktop, Szene `[data-tl-scene]`): Die Linie steht schon. Ein Foto (`[data-tl-founder]`, optional)
 * gleitet ganz sanft von links an seinen Platz, danach fahren die Meilensteine nacheinander aus dem Linienanfang an
 * ihre Plätze, und ihr Text blendet aus der Linie auf. Läuft einmal, sobald die Zeitleiste im Bild ist. Danach gelten
 * die Hover-Effekte (Klasse `is-ready`, Regeln in global.css).
 *
 * Handy und Tablet (initTimelinePin, Sektion `[data-tlm]`): Pin und Scroll. Der Strahl wie am Desktop läuft mit dem Scrollen von
 * rechts nach links durch, die Station in der Mitte ist hell und größer, die Linie füllt sich. Reduzierte Bewegung: wischen statt Pin.
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
  document.querySelectorAll<HTMLElement>('[data-tlm]').forEach((sec) => {
    const stage = sec.querySelector<HTMLElement>('[data-tlm-stage]');
    const track = sec.querySelector<HTMLElement>('[data-tlm-track]');
    const fill = sec.querySelector<HTMLElement>('[data-tlm-fill]');
    const items = [...sec.querySelectorAll<HTMLElement>('[data-tlm-item]')];
    if (!stage || !track || items.length < 2) return;
    const n = items.length;
    const ticks = items.map((it) => it.querySelector<HTMLElement>('[data-tlm-tick]')!);
    const bodies = items.map((it) => [...it.querySelectorAll<HTMLElement>('[data-tlm-date], [data-tlm-text]')]);
    const mm = gsap.matchMedia();

    // Pin und Scroll: Die Sektion bleibt stehen, der Strahl läuft von rechts nach links durch. Station in der Mitte hell und groß,
    // die übrigen treten zurück. Reduzierte Bewegung oder sehr flache Fenster: kein Pin, der Strahl lässt sich wischen (CSS).
    mm.add('(max-width: 1024.98px) and (min-height: 560px) and (prefers-reduced-motion: no-preference)', () => {
      const travel = () => (n - 1) * items[0].getBoundingClientRect().width;
      const focus = (p: number) => {
        const pos = p * (n - 1);
        items.forEach((it, i) => {
          const w = Math.max(0, 1 - Math.abs(i - pos));
          const e = w * w * (3 - 2 * w); // weich ein und aus
          gsap.set(it, { opacity: 0.18 + 0.82 * e });
          gsap.set(ticks[i], { scaleY: 1 + 0.9 * e });
          gsap.set(bodies[i], { scale: 0.92 + 0.08 * e });
        });
        if (fill) gsap.set(fill, { scaleX: p });
      };
      focus(0);

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: stage,
          start: 'top top',
          end: () => `+=${Math.round(travel() * 1.15)}`,
          pin: stage,
          scrub: 0.8,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          refreshPriority: 4, // nach den Pins weiter oben messen
        },
        onUpdate: () => {
          const t = travel();
          focus(t ? Math.min(1, Math.max(0, -(gsap.getProperty(track, 'x') as number) / t)) : 0);
        },
      });
      tl.to(track, { x: () => -travel(), duration: 1 }, 0);
      tl.to({}, { duration: 0.15 }, 1); // die letzte Station bleibt einen Moment mittig stehen

      return () => {
        tl.scrollTrigger?.kill();
        tl.kill();
        gsap.set([track, fill, ...items, ...ticks, ...bodies.flat()], { clearProps: 'transform,opacity' });
      };
    });
  });
}
