//file path: components/providers/RouteChangeRefresh.tsx

'use client';

import { usePathname } from 'next/navigation';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

export default function RouteChangeRefresh() {
  const pathname = usePathname();

  useGSAP(() => {
    ScrollTrigger.refresh();
  }, [pathname]);

  return null;
}