// file path: components/transition/IntroSplash.tsx

'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

let hasIntroPlayed = false;

export const INTRO_COMPLETE_EVENT = 'intro:complete';

export function introHasPlayed() {
  return hasIntroPlayed;
}

/**
 * obsidian-intro.html preset, ported to GSAP/React — replaces the old
 * flat-white 2-second-timeout placeholder with the reference's real
 * sequence: a 0-100% counter drives a pill progress bar, the loader slides
 * out, the curtain rises while it's still finishing, and the hero gets the
 * go-ahead. The exported contract (INTRO_COMPLETE_EVENT / introHasPlayed)
 * is unchanged — Hero.tsx doesn't need to know any of this changed.
 *
 * Timing below mirrors the source's relative rhythm (counter, a beat of
 * stillness, loader-out, curtain-rise overlapping the tail of loader-out)
 * translated from its ms values into GSAP seconds. Two eases are
 * approximated with GSAP built-ins (power2.out / power4.inOut) rather than
 * registering CustomEase for the source's exact cubic-bezier curves —
 * close enough visually that the extra plugin registration isn't worth it;
 * revisit if a side-by-side comparison says otherwise.
 *
 * This component can block the entire site if something goes wrong, which
 * is a different risk profile than Hero's earlier invisible-text bug — so
 * it gets two independent, JS-free escape hatches on top of the normal
 * Skip button: a <noscript> rule that hides it outright with scripting
 * off, and a pure-CSS @keyframes failsafe that forces it invisible after a
 * generous delay if GSAP throws or never fires with scripting on.
 *
 * Font: this file previously referenced `.font-display`, a token that no
 * longer exists (Big Shoulders Display was replaced by a single Geist
 * Sans / Geist Mono system — see globals.css). That dead reference on the
 * percentage counter is removed below. Separately, the four label-tier
 * text elements here (site name, role placeholder, "Loading", skip
 * button) now carry `font-mono`, matching every other label-tier element
 * on the site (Hero's "Scroll" label, About's field-name spans, Project's
 * eyebrow/index/meta) — this file was the one place that was still on the
 * default Geist Sans for that tier.
 */

const COUNTER_DURATION = 1.5;
const LOADER_OUT_DELAY = 0.2;
const LOADER_OUT_DURATION = 0.5;
const CURTAIN_DELAY = 0.35;
const CURTAIN_DURATION = 0.9;
const POST_CURTAIN_HOLD = 0.2;

export default function IntroSplash() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const loaderRef = useRef<HTMLDivElement>(null);
  const counterNumRef = useRef<HTMLSpanElement>(null);
  const counterLiveRef = useRef<HTMLSpanElement>(null);
  const progressFillRef = useRef<HTMLDivElement>(null);
  const skipBtnRef = useRef<HTMLButtonElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  const complete = () => {
    if (hasIntroPlayed) return;
    hasIntroPlayed = true;
    window.dispatchEvent(new CustomEvent(INTRO_COMPLETE_EVENT));
  };

  const hide = () => {
    document.body.style.overflow = '';
    if (overlayRef.current) {
      gsap.set(overlayRef.current, { display: 'none' });
    }
  };

  const { contextSafe } = useGSAP(
    () => {
      const overlay = overlayRef.current;
      const loader = loaderRef.current;
      const progressFill = progressFillRef.current;
      if (!overlay || !loader || !progressFill) return;

      // Repeat-mount guard (StrictMode double-invoke in dev, or any other
      // remount) — matches the previous file's guard: don't replay.
      if (hasIntroPlayed) {
        hide();
        return;
      }

      const prefersReduced = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches;

      if (prefersReduced) {
        // No curtain, no counter. Hero's own reduced-motion branch
        // renders its final state with zero motion already — this just
        // needs to get out of the way immediately, per the doc's
        // reduced-motion rule (cut transforms, don't slow them down).
        complete();
        hide();
        return;
      }

      document.body.style.overflow = 'hidden';
      skipBtnRef.current?.focus();

      const counterState = { value: 0 };
      let lastAnnounced = -1;

      const tl = gsap.timeline({ onComplete: hide });
      tlRef.current = tl;

      tl.to(counterState, {
        value: 100,
        duration: COUNTER_DURATION,
        ease: 'power2.out',
        onUpdate: () => {
          const pct = Math.round(counterState.value);
          if (counterNumRef.current) {
            counterNumRef.current.textContent = String(pct);
          }
          gsap.set(progressFill, { scaleX: counterState.value / 100 });
          if (pct !== lastAnnounced && pct % 25 === 0 && counterLiveRef.current) {
            lastAnnounced = pct;
            counterLiveRef.current.textContent = `Loading, ${pct} percent`;
          }
        },
      })
        .to(
          loader,
          { yPercent: -120, duration: LOADER_OUT_DURATION, ease: 'power4.inOut' },
          `+=${LOADER_OUT_DELAY}`
        )
        .to(
          overlay,
          {
            yPercent: -100,
            duration: CURTAIN_DURATION,
            ease: 'power4.inOut',
            // Fires the instant the curtain starts rising, not when it
            // finishes — Hero's line-reveal is meant to overlap the
            // curtain's exit, same as the source driving both off one
            // class toggle at once.
            onStart: complete,
          },
          `<+=${CURTAIN_DELAY}`
        )
        .to({}, { duration: POST_CURTAIN_HOLD });

      return () => {
        tl.kill();
        document.body.style.overflow = '';
      };
    },
    { scope: overlayRef }
  );

  const skip = contextSafe(() => {
    if (hasIntroPlayed) return;
    tlRef.current?.kill();
    if (loaderRef.current) gsap.set(loaderRef.current, { yPercent: -120 });
    if (overlayRef.current) gsap.set(overlayRef.current, { yPercent: -100 });
    complete();
    hide();
  });

  useEffect(() => {
    const onKeydown = (event: KeyboardEvent) => {
      if (!hasIntroPlayed && event.key === 'Escape') skip();
    };
    document.addEventListener('keydown', onKeydown);
    return () => document.removeEventListener('keydown', onKeydown);
  }, [skip]);

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label="Site is loading"
      className="intro-overlay intro-failsafe fixed inset-0 z-[200] flex flex-col justify-end bg-background-base p-gutter motion-reduce:hidden"
    >
      <div
        aria-hidden="true"
        className="fixed left-gutter right-gutter top-gutter flex justify-between"
      >
        {/* Real — from Nav.tsx. Label-tier text: font-mono. */}
        <span className="font-mono text-label-uppercase uppercase text-ink">
          Franklin Sarmiento
        </span>
        {/* Placeholder — fill in your role/discipline line. */}
        <span className="font-mono text-label-uppercase uppercase text-ink">
          [ ROLE / DISCIPLINE ]
        </span>
      </div>

      <button
        ref={skipBtnRef}
        type="button"
        onClick={skip}
        className="fixed bottom-gutter right-gutter z-10 inline-flex items-center gap-1 border border-ink-ghost px-2 py-1 font-mono text-label-uppercase uppercase text-ink transition-[border-color,transform] duration-200 ease-out hover:-translate-y-px hover:border-ink active:translate-y-0"
      >
        <span aria-hidden="true" className="inline-block h-1.5 w-1.5 bg-ink" />
        <span>Skip intro</span>
      </button>

      <div className="overflow-hidden">
        <div ref={loaderRef} className="flex flex-col gap-2">
          <p aria-hidden="true" className="font-mono text-label-uppercase uppercase text-ink">
            Loading
          </p>
          <div
            aria-hidden="true"
            className="flex items-end gap-1 text-display-medium font-light leading-none tabular-nums text-ink"
          >
            <span ref={counterNumRef}>0</span>
            <span className="pb-[0.35em] font-sans text-body-regular text-ink">%</span>
          </div>
          <div className="h-[3px] w-[min(280px,60vw)] overflow-hidden rounded-full bg-ink-ghost">
            <div
              ref={progressFillRef}
              className="h-full w-full origin-left scale-x-0 rounded-full bg-ink"
            />
          </div>
          <span ref={counterLiveRef} role="status" aria-live="polite" className="sr-only">
            Loading, 0 percent
          </span>
        </div>
      </div>

      {/* No-JS fallback: never leave a visitor staring at a stuck curtain. */}
      <noscript>
        <style>{`.intro-overlay { display: none !important; }`}</style>
      </noscript>

      {/* Pure-CSS failsafe for the JS-enabled-but-broken case: forces the
          curtain invisible and non-interactive well past the ~3s intended
          sequence if GSAP throws or never runs. */}
      <style>{`
        .intro-failsafe {
          animation: intro-failsafe-hide 0s 6s forwards;
        }
        @keyframes intro-failsafe-hide {
          to {
            visibility: hidden;
            opacity: 0;
            pointer-events: none;
          }
        }
      `}</style>
    </div>
  );
}