//file path: components/sections/hero/Hero.tsx

'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { INTRO_COMPLETE_EVENT, introHasPlayed } from '@/components/transition/IntroSplash';

/**
 * obsidian-intro.html preset, applied per Franklin's explicit "full swap"
 * call: a name headline replaces the previous ethos-statement headline,
 * and the per-character cursor-repel hover is dropped entirely. This hero
 * now only does the line-mask entrance reveal, gated on IntroSplash's
 * handoff exactly as before the swap.
 *
 * SSR safety carried over unchanged from the prior rewrite: no hidden
 * starting state in the server-rendered markup (no translate-y-full
 * class anywhere below). gsap.from() reads the CURRENT, already-visible
 * computed values as the animation's end state and writes the start
 * state itself at runtime — a GSAP failure or slow hydration leaves the
 * name visible and static, never blank.
 *
 * Focus handoff: the reference moved focus to its <h1> once the intro
 * finished, since intro and hero shared one DOM tree there. Here
 * IntroSplash and Hero are sibling components, so that behavior is
 * reproduced from this side instead — once told to play, this section
 * moves focus to its own heading.
 */
export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const section = sectionRef.current;
        if (!section) return;

        const lines = gsap.utils.toArray<HTMLElement>('.hero-line', section);
        const subline = section.querySelector<HTMLElement>('.hero-subline');
        const scrollLabel = section.querySelector<HTMLElement>('.hero-scroll-label');
        const scrollLine = section.querySelector<HTMLElement>('.hero-scroll-line');

        const tl = gsap.timeline({ paused: true, defaults: { ease: 'expo.out' } }); // ease-emphatic

        // Delays below match the source's per-element transition-delays
        // (60ms / 180ms / 420ms / 520ms / 620ms) against a shared
        // 900ms (duration-slow) reveal, just expressed as timeline
        // position params instead of CSS transition-delay.
        if (lines[0]) tl.from(lines[0], { yPercent: 115, duration: 0.9 }, 0.06);
        if (lines[1]) tl.from(lines[1], { yPercent: 115, duration: 0.9 }, 0.18);
        if (subline) tl.from(subline, { yPercent: 110, duration: 0.9 }, 0.42);
        if (scrollLabel) tl.from(scrollLabel, { yPercent: 140, duration: 0.9 }, 0.52);
        if (scrollLine) tl.from(scrollLine, { scaleY: 0, duration: 0.9 }, 0.62);

        const start = () => {
          tl.play();
          headingRef.current?.focus({ preventScroll: true });
        };

        if (introHasPlayed()) {
          start();
        } else {
          window.addEventListener(INTRO_COMPLETE_EVENT, start, { once: true });
        }

        return () => {
          tl.kill();
          window.removeEventListener(INTRO_COMPLETE_EVENT, start);
        };
      });

      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-svh flex-col justify-end px-gutter pb-16"
    >
      {/* aria-label carries the accessible name for the whole heading; the
          two line spans below are aria-hidden so a screen reader reads
          this once, cleanly, regardless of whether the entrance animation
          ever runs. tabIndex/outline handling is for the programmatic
          focus() call above, not for mouse/click interaction — outline
          only reappears for genuine keyboard focus. */}
      <h1
        ref={headingRef}
        tabIndex={-1}
        aria-label="Franklin Sarmiento"
        className="font-display text-display-hero uppercase leading-none text-ink outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-ink focus-visible:outline-offset-4"
      >
        <span className="block overflow-hidden pb-[0.06em]" aria-hidden="true">
          <span className="hero-line block">Franklin</span>
        </span>
        <span className="block overflow-hidden pb-[0.06em]" aria-hidden="true">
          <span className="hero-line block">Sarmiento</span>
        </span>
      </h1>

      <div className="mt-3 overflow-hidden">
        {/* Placeholder — swap for a real one-line positioning statement:
            what you do, for whom. */}
        <p className="hero-subline max-w-[34ch] text-body-regular text-ink-secondary">
          [ ONE-LINE POSITIONING STATEMENT — WHAT YOU DO, FOR WHOM ]
        </p>
      </div>

      <div className="fixed bottom-gutter right-gutter flex flex-col items-center gap-1">
        <div className="overflow-hidden">
          <span
            aria-hidden="true"
            className="hero-scroll-label block text-label-uppercase uppercase text-ink [writing-mode:vertical-rl]"
          >
            Scroll
          </span>
        </div>
        <span
          aria-hidden="true"
          className="hero-scroll-line h-11 w-px origin-top bg-ink-ghost"
        />
      </div>
    </section>
  );
}