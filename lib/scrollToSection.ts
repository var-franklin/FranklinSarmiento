//file path: lib/scrollToSection.ts

import { ScrollSmoother } from 'gsap/ScrollSmoother';

/**
 * Scrolls to a section by id, routed through the active ScrollSmoother
 * instance so it matches the rest of the page's smooth-scroll feel.
 * ScrollSmoother.get() returns the currently mounted instance (created in
 * SmoothScroll.tsx) without needing it passed down through props/context.
 *
 * Falls back to a native scrollIntoView when ScrollSmoother isn't active
 * (prefers-reduced-motion, or this runs before SmoothScroll has mounted).
 *
 * The "top top+=96" offset accounts for Nav's fixed height so the section
 * heading doesn't land underneath it — tune the 96 if Nav's height changes.
 */
export function scrollToSection(id: string) {
  const target = document.getElementById(id);
  if (!target) return;

  const smoother = ScrollSmoother.get();
  if (smoother) {
    smoother.scrollTo(target, true, 'top top+=96');
    return;
  }

  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  target.scrollIntoView({
    behavior: prefersReducedMotion ? 'auto' : 'smooth',
  });
}