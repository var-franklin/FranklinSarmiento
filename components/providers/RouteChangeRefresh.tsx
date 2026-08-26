//file path: components/providers/RouteChangeRefresh.tsx

'use client';

import { usePathname } from 'next/navigation';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

/**
 * PageTransition used to call ScrollTrigger.refresh() after its reveal
 * animation completed on every route change — necessary because each page
 * has a different content height, so trigger positions calculated for the
 * previous page go stale the moment navigation swaps in new content (see
 * baseline doc: "Refresh ScrollTrigger after async layout shifts... and
 * also after route/page transitions"). Now that PageTransition is gone,
 * nothing else does this. This component's only job is that refresh call —
 * it renders nothing and has no visual effect.
 */
export default function RouteChangeRefresh() {
  const pathname = usePathname();

  useGSAP(() => {
    ScrollTrigger.refresh();
  }, [pathname]);

  return null;
}