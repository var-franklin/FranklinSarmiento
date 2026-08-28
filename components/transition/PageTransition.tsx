//file path: components/transition/PageTransition.tsx

'use client';

import { useRef } from 'react';
import { usePathname } from 'next/navigation';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const prevPathname = useRef(pathname);

  useGSAP(() => {
    if (pathname === prevPathname.current) {
      return;
    }
    prevPathname.current = pathname;

    const overlay = overlayRef.current;
    if (!overlay) return;

    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const tl = gsap.timeline({ onComplete: () => ScrollTrigger.refresh() });

      tl.set(overlay, { yPercent: 100 })
        .to(overlay, { yPercent: 0, duration: 0.4, ease: 'power3.inOut' })
        .to(overlay, { yPercent: -100, duration: 0.5, ease: 'power3.inOut', delay: 0.1 });

      return () => tl.kill();
    });

    mm.add('(prefers-reduced-motion: reduce)', () => {
      ScrollTrigger.refresh();
    });

    return () => mm.revert();
  }, [pathname]);

  return (
    <>
      {/* fixed/inset-0/z-[60]/translate-y-full kept: positioning and the
          hidden starting state are required for the wipe timeline above to
          have any visible effect. bg-black kept only because an overlay
          with no fill is transparent, i.e. invisible — that would silently
          disable the transition rather than just un-style it. */}
      <div
        ref={overlayRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[60] translate-y-full bg-black"
      />
      {children}
    </>
  );
}
