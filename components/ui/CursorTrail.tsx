//file path: components/ui/CursorTrail.tsx

'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { CURSOR_HANDOFF_EVENT } from '@/components/transition/IntroSplash';

/**
 * Persistent cursor-trail effect. Replaces the old, never-mounted
 * Cursor.tsx dot. Renders nothing visible until IntroSplash's caret
 * hands off (see CURSOR_HANDOFF_EVENT) — but its position trackers run
 * quietly in the background from mount, so the moment it's revealed it's
 * already sitting at the live mouse position with no visible jump.
 *
 * Mouse-only (pointer: fine) and skipped entirely under
 * prefers-reduced-motion, per the design doc's motion rules — this is a
 * pure addition alongside the native cursor, never a replacement for it.
 *
 * Intentionally simple per the current brief: four bars trailing the
 * live pointer at increasing lag/decreasing opacity, fading out after a
 * short idle period. Not final-tuned — durations and bar count are easy
 * to adjust once you've seen it move.
 */

const TRAIL_COUNT = 4;
const IDLE_HIDE_DELAY = 150; // ms of no mousemove before the trail fades out

export default function CursorTrail() {
  const groupRef = useRef<HTMLDivElement>(null);
  const barRefs = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(() => {
    const group = groupRef.current;
    if (!group) return;

    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: no-preference) and (pointer: fine)', () => {
      const bars = barRefs.current.filter((b): b is HTMLDivElement => !!b);
      if (!bars.length) return;

      // Each bar gets its own quickTo tracker with a progressively
      // longer duration, so later bars lag further behind the lead bar
      // and the group reads as one trailing line, not four independent
      // dots.
      const trackers = bars.map((bar, i) => ({
        x: gsap.quickTo(bar, 'x', { duration: 0.12 + i * 0.09, ease: 'power3' }),
        y: gsap.quickTo(bar, 'y', { duration: 0.12 + i * 0.09, ease: 'power3' }),
      }));

      gsap.set(bars, { xPercent: -50, yPercent: -50 });

      let active = false; // becomes true once IntroSplash hands off
      let visible = false;
      let idleTimeout: ReturnType<typeof setTimeout> | null = null;

      const show = () => {
        if (!active || visible) return;
        visible = true;
        gsap.to(group, { autoAlpha: 1, duration: 0.15, overwrite: true });
      };

      const hide = () => {
        if (!visible) return;
        visible = false;
        gsap.to(group, { autoAlpha: 0, duration: 0.3, overwrite: true });
      };

      const onMove = (e: MouseEvent) => {
        trackers.forEach(({ x, y }) => {
          x(e.clientX);
          y(e.clientY);
        });

        show();

        if (idleTimeout) clearTimeout(idleTimeout);
        idleTimeout = setTimeout(hide, IDLE_HIDE_DELAY);
      };

      const onHandoff = () => {
        active = true;
        show();
      };

      window.addEventListener('mousemove', onMove);
      window.addEventListener(CURSOR_HANDOFF_EVENT, onHandoff);

      return () => {
        window.removeEventListener('mousemove', onMove);
        window.removeEventListener(CURSOR_HANDOFF_EVENT, onHandoff);
        if (idleTimeout) clearTimeout(idleTimeout);
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <div ref={groupRef} aria-hidden="true" className="pointer-events-none fixed inset-0 z-[100] opacity-0">
      {Array.from({ length: TRAIL_COUNT }).map((_, i) => (
        <div
          key={i}
          ref={(el) => {
            barRefs.current[i] = el;
          }}
          className="absolute left-0 top-0 h-5 w-[2px] bg-ink"
          style={{ opacity: 1 - i * 0.22 }}
        />
      ))}
    </div>
  );
}