// Untermenü als eigene Ansicht: Tippen auf „Leistungen“ blendet die Hauptliste aus und zeigt nur die Unterpunkte, „Zurück“ kehrt zurück.
// Siegel und Kontaktblock blenden sich über `aria-expanded` am Auslöser aus (Klassen im Fenster).
document.querySelectorAll<HTMLElement>('[data-drill]').forEach((nav) => {
  const dialog = nav.closest('dialog');
  const main = nav.querySelector<HTMLElement>('[data-drill-main]')!;
  const panels = [...nav.querySelectorAll<HTMLElement>('[data-drill-panel]')];
  const openers = [...nav.querySelectorAll<HTMLButtonElement>('[data-drill-open]')];
  const show = (i: number | null, focus = true) => {
    const open = i !== null;
    main.toggleAttribute('data-off', open);
    main.inert = open;
    panels.forEach((p) => {
      const on = open && Number(p.dataset.drillPanel) === i;
      p.toggleAttribute('data-off', !on);
      p.inert = !on;
    });
    openers.forEach((b) => b.setAttribute('aria-expanded', String(open && Number(b.dataset.drillOpen) === i)));
    dialog?.scrollTo({ top: 0 });
    if (!focus) return;
    const target = open
      ? panels.find((p) => Number(p.dataset.drillPanel) === i)?.querySelector<HTMLElement>('[data-drill-back]')
      : openers.find((b) => b.dataset.lastOpen !== undefined);
    target?.focus({ preventScroll: true });
  };
  openers.forEach((b) =>
    b.addEventListener('click', () => {
      openers.forEach((o) => o.removeAttribute('data-last-open'));
      b.setAttribute('data-last-open', '');
      show(Number(b.dataset.drillOpen));
    }),
  );
  nav.querySelectorAll('[data-drill-back]').forEach((b) => b.addEventListener('click', () => show(null)));
  // Beim Schließen des Menüs wieder die Hauptliste zeigen, ohne Fokus zu setzen
  dialog?.addEventListener('close', () => show(null, false));
});
