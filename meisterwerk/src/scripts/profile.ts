import { gsap, ScrollTrigger } from './motion';

/*
 * Teammitglieder-Seite: Auftritt des Kopfbereichs beim Laden (Linie zieht auf, Name steigt Wort für Wort aus einer
 * Maske auf, Rolle und Hinweis blenden nach), Einblenden der Inhalte beim Scrollen (Klasse `is-in`, Übergänge in
 * ProfileTemplate.astro) und das Lebensmotto, das sich Wort für Wort füllt. Reduzierte Bewegung: alles sofort sichtbar.
 */
export function initProfile() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const hero = document.querySelector<HTMLElement>('[data-ph]');
  if (hero) {
    // Die Wörter warten per CSS unsichtbar, GSAP setzt erst den Startzustand und gibt sie dann frei
    const words = hero.querySelectorAll('.ph-word');
    gsap.set(words, { yPercent: 110 });
    hero.querySelector('.ph-name')?.classList.add('is-go');
    const tl = gsap.timeline({ delay: 0.15 });
    tl.to(hero.querySelector('.ph-rule'), { scaleX: 1, duration: 0.9, ease: 'power3.inOut' }, 0);
    tl.to(words, { yPercent: 0, duration: 1.25, ease: 'power4.out', stagger: 0.14 }, 0.1);
    tl.to(hero.querySelectorAll('[data-ph-fade]'), { opacity: 1, y: 0, duration: 1, ease: 'power3.out', stagger: 0.12 }, 0.6);
  }

  ScrollTrigger.batch('[data-rv], [data-rv-line]', {
    start: 'top 90%',
    once: true,
    onEnter: (els) =>
      els.forEach((el, i) => {
        (el as HTMLElement).style.setProperty('--d', `${i * 0.1}s`);
        el.classList.add('is-in');
      }),
  });

  const quote = document.querySelector<HTMLElement>('[data-pm-quote]');
  if (quote) {
    const words = [...quote.querySelectorAll<HTMLElement>('.pm-w')];
    gsap.set(words, { opacity: 0.16 });
    gsap.to(words, {
      opacity: 1,
      ease: 'none',
      stagger: 0.12,
      scrollTrigger: { trigger: quote, start: 'top 80%', end: 'bottom 45%', scrub: true },
    });
  }
}
