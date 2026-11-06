// Startseite, Willkommen-Szene auf Handy und Tablet (bis 1024 px): Die Bilder schieben sich von rechts übereinander, danach wächst der
// Bildstapel bis auf 12 px Rand zum Vollbild (wie das Hero-Bild), erst dann löst sich der Pin. Beim Pin liegt die Unterkante des
// Wrappers auf der Fensterunterkante. Läuft nur, wenn die Szene `data-ws-home` trägt (Startseite).
import { gsap } from "../motion";

const scene = document.querySelector("[data-welcome-scene][data-ws-home]");
if (scene) {
  const stack = scene.querySelector("[data-ws-stack]");
  const wrap = scene.querySelector("[data-ws-pin]");
  const imgs = [...stack.querySelectorAll("[data-ws-img]")];
  const mm = gsap.matchMedia();
  mm.add("(max-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
    if (imgs.length < 3) return;
    const M = 12;
    const geo = () => {
      const s = stack.getBoundingClientRect();
      const w = wrap.getBoundingClientRect();
      return { left: s.left, top: innerHeight - w.height + (s.top - w.top) };
    };
    gsap.set(imgs.slice(1), { xPercent: 100 });
    gsap.set(stack, { zIndex: 6 });
    gsap
      .timeline({
        scrollTrigger: { trigger: wrap, start: "bottom bottom", end: "+=340%", pin: true, scrub: 1, anticipatePin: 1, invalidateOnRefresh: true, refreshPriority: 10 },
      })
      .to(imgs[1], { xPercent: 0, duration: 1, ease: "power2.inOut" })
      .to(imgs[2], { xPercent: 0, duration: 1, ease: "power2.inOut" }, "+=0.15")
      .to(
        stack,
        {
          x: () => M - geo().left,
          y: () => M - geo().top,
          width: () => document.documentElement.clientWidth - 2 * M,
          height: () => innerHeight - 2 * M,
          duration: 1.4,
          ease: "power2.inOut",
        },
        "+=0.2",
      )
      .to(wrap.firstElementChild, { opacity: 0, duration: 1.4, ease: "power2.inOut" }, "<");
    return () => gsap.set([...imgs, stack, wrap.firstElementChild], { clearProps: "transform,opacity,width,height,zIndex" });
  });
}
