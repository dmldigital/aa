import { gsap } from 'gsap';

/**
 * Exact 1:1 Implementation of Foundix Webflow IX2 Button Hover Animation
 * 
 * Foundix IX2 parameters extracted directly from foundix.webflow.shared.css & webflow.js:
 * 1. Background expansion (.bg_before_button_hover):
 *    - Scale: 0 -> 1
 *    - Duration: 0.4s
 *    - Ease: power1.out
 * 2. Letter Roll (.btn-text-style-1._01 & ._02):
 *    - Split text into characters
 *    - _01: y: 0% -> -100%
 *    - _02: y: 100% -> 0%
 *    - Duration: 0.4s
 *    - Stagger: { amount: 0.12, from: "random" } (Signature organic random stagger!)
 *    - Ease: power1.inOut
 * 3. Mouse Leave:
 *    - Smooth timeline reverse (tl.reverse())
 */
export function initFoundixButtons() {
  document.querySelectorAll<HTMLElement>('.button-style-1').forEach(btn => {
    if ((btn as any)._foundixInit) return;
    (btn as any)._foundixInit = true;

    // 1. Ensure .before_button_hover and .bg_before_button_hover exist
    let beforeHover = btn.querySelector<HTMLElement>('.before_button_hover');
    let bgHover = btn.querySelector<HTMLElement>('.bg_before_button_hover');

    if (!beforeHover) {
      beforeHover = document.createElement('div');
      beforeHover.className = 'before_button_hover';
      bgHover = document.createElement('div');
      bgHover.className = 'bg_before_button_hover';
      beforeHover.appendChild(bgHover);
      btn.insertBefore(beforeHover, btn.firstChild);
    } else if (!bgHover) {
      bgHover = document.createElement('div');
      bgHover.className = 'bg_before_button_hover';
      beforeHover.appendChild(bgHover);
    }

    // 2. Locate text containers
    const text01 = btn.querySelector<HTMLElement>('.btn-text-style-1._01');
    const text02 = btn.querySelector<HTMLElement>('.btn-text-style-1._02');
    if (!text01 || !text02) return;

    // Split text into individual characters
    function splitChars(el: HTMLElement) {
      if (el.dataset.split) return;
      const rawText = el.textContent || '';
      el.innerHTML = '';
      rawText.split('').forEach(char => {
        const span = document.createElement('span');
        span.className = 'gsap_split_letter inline-block relative';
        span.innerHTML = char === ' ' ? '&nbsp;' : char;
        el.appendChild(span);
      });
      el.dataset.split = 'true';
    }

    splitChars(text01);
    splitChars(text02);

    const chars01 = text01.querySelectorAll('.gsap_split_letter');
    const chars02 = text02.querySelectorAll('.gsap_split_letter');

    // 3. Set initial state
    gsap.set(chars01, { y: '0%' });
    gsap.set(chars02, { y: '100%' });
    if (bgHover) {
      gsap.set(bgHover, { scale: 0, transformOrigin: '50% 50%' });
    }

    // 4. Create reversible GSAP timeline matching Foundix IX2
    const tl = gsap.timeline({ paused: true });

    if (bgHover) {
      tl.to(bgHover, {
        scale: 1,
        duration: 0.4,
        ease: 'power1.out'
      }, 0);
    }

    tl.to(chars01, {
      y: '-100%',
      duration: 0.4,
      stagger: { amount: 0.12, from: 'random' },
      ease: 'power1.inOut'
    }, 0)
    .to(chars02, {
      y: '0%',
      duration: 0.4,
      stagger: { amount: 0.12, from: 'random' },
      ease: 'power1.inOut'
    }, 0);

    // 5. Trigger play on hover, reverse on leave
    btn.addEventListener('mouseenter', () => {
      tl.play();
    });

    btn.addEventListener('mouseleave', () => {
      tl.reverse();
    });
  });
}
