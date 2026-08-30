//file path: components/providers/GsapProvider.tsx

'use client';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { Flip } from 'gsap/Flip';
import { SplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';

// SplitText added for Hero's per-character cursor-repulsion hover effect.
// Free since GSAP 3.13 (the April 2025 Webflow acquisition made every
// plugin free for commercial use), so this stays inside the doc's
// single-animation-engine rule the same way the other plugins do.
gsap.registerPlugin(ScrollTrigger, ScrollSmoother, Flip, SplitText, useGSAP);

export default function GsapProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}