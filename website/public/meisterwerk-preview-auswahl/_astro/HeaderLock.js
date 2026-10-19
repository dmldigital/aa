// Sperrt den Sticky-Header in allen Pin- und Scroll-Sektionen (Sektionen mit data-header-lock):
// Solange die Oberkante des Fensters in einer solchen Sektion liegt, bleibt der Header ausgeblendet,
// auch beim Hochscrollen. Außerhalb dieser Sektionen gilt wie bisher: hoch = ein, runter = aus.
const header = document.querySelector("[data-smart-header]");
const zones = [...document.querySelectorAll("[data-header-lock]")];

if (header && zones.length) {
  const root = document.documentElement;
  let frame = 0;

  const check = () => {
    frame = 0;
    const edge = header.offsetHeight || 88;
    const locked = zones.some((zone) => {
      const rect = zone.getBoundingClientRect();
      return rect.top <= edge && rect.bottom > 0;
    });
    root.toggleAttribute("data-header-locked", locked);
  };

  window.addEventListener("scroll", () => {
    if (!frame) frame = requestAnimationFrame(check);
  }, { passive: true });
  window.addEventListener("resize", check);
  check();
}
