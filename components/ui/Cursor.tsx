//file path: components/ui/Cursor.tsx

'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export default function Cursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: no-preference) and (pointer: fine)', () => {
      const el = cursorRef.current;
      if (!el) return;

      gsap.set(el, { xPercent: -50, yPercent: -50, opacity: 1 });

      const xTo = gsap.quickTo(el, 'x', { duration: 0.3, ease: 'power3' });
      const yTo = gsap.quickTo(el, 'y', { duration: 0.3, ease: 'power3' });

      const onMove = (e: MouseEvent) => {
        xTo(e.clientX);
        yTo(e.clientY);
      };
      const onOver = (e: MouseEvent) => {
        if ((e.target as HTMLElement)?.closest('[data-cursor-hover]')) {
          gsap.to(el, { scale: 2, duration: 0.3 });
        }
      };
      const onOut = (e: MouseEvent) => {
        if ((e.target as HTMLElement)?.closest('[data-cursor-hover]')) {
          gsap.to(el, { scale: 1, duration: 0.3 });
        }
      };

      window.addEventListener('mousemove', onMove);
      document.addEventListener('mouseover', onOver);
      document.addEventListener('mouseout', onOut);

      return () => {
        window.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseover', onOver);
        document.removeEventListener('mouseout', onOut);
      };
    });

    return () => mm.revert();
  });

  return (
    // h-3/w-3/bg-black kept: without a size and a fill color this element
    // is literally invisible, which would silently disable the whole
    // custom-cursor feature rather than just "un-style" it. Shape
    // (rounded-full) and blend mode were dropped as pure decoration.
    <div
      ref={cursorRef}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[100] h-3 w-3 bg-black opacity-0"
    />
  );
}
