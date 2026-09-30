// Heavy media (videos, posters, the frame sequence) must not compete with the first paint or with a page speed
// measurement. They start after the page has loaded and either the visitor interacts (scroll, touch, pointer, key)
// or a generous idle time has passed, whichever comes first.
const EVENTS = ['pointerdown', 'pointermove', 'touchstart', 'wheel', 'scroll', 'keydown'] as const;
const IDLE_MS = 8000;
let ready: Promise<void> | undefined;

export function afterFirstVisit(): Promise<void> {
  return (ready ??= new Promise<void>(resolve => {
    let timer = 0;
    const go = () => {
      EVENTS.forEach(e => removeEventListener(e, go));
      clearTimeout(timer);
      resolve();
    };
    EVENTS.forEach(e => addEventListener(e, go, { passive: true, once: true }));
    const arm = () => { timer = window.setTimeout(go, IDLE_MS); };
    if (document.readyState === 'complete') arm(); else addEventListener('load', arm, { once: true });
  }));
}
