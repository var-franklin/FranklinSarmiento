//file path: components/providers/HashScrollHandler.tsx

'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { scrollToSection } from '@/lib/scrollToSection';

/**
 * Handles arriving at "/" with a hash already in the URL — e.g. clicking
 * Nav's "Projects" link (href="/#projects") from a project detail page
 * navigates here, then this scrolls once the home page has mounted.
 *
 * Nav.tsx handles the same-page case itself (already on "/") by calling
 * scrollToSection() directly and preventing navigation, so this component
 * only needs to fire on route changes that land on "/" with a hash.
 */
export default function HashScrollHandler() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== '/') return;

    const hash = window.location.hash;
    if (!hash) return;

    // Give GsapProvider/SmoothScroll a tick to finish mounting so
    // ScrollSmoother.get() has an instance to return.
    const raf = requestAnimationFrame(() => {
      scrollToSection(hash.slice(1));
    });

    return () => cancelAnimationFrame(raf);
  }, [pathname]);

  return null;
}