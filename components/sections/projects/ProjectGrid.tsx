//file path: components/sections/projects/ProjectGrid.tsx

'use client';

import { useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { projects } from '@/lib/projects';

/**
 * Minimalist project list: title + short category tag per row, no
 * thumbnails, in the order lib/projects.ts defines them. No `variant` prop
 * anymore — this used to render a "featured" subset for the home page and
 * a full grid on the now-removed /projects listing page; now there's only
 * one list, shown in full on the home page.
 */
export default function ProjectGrid() {
  const listRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const container = listRef.current;
      if (!container) return;

      // container.children are the <Link> rows below — the opacity-0 /
      // translate-y-8 starting-state classes live on the Link itself so
      // GSAP animates the element that actually carries the hidden state.
      const rows = container.children;
      if (rows.length === 0) return;

      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const trigger = ScrollTrigger.create({
          trigger: container,
          start: 'top 80%',
          once: true,
          onEnter: () => {
            gsap.to(rows, {
              opacity: 1,
              y: 0,
              duration: 0.6,
              ease: 'power3.out',
              stagger: 0.08,
            });
          },
        });

        return () => trigger.kill();
      });

      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set(rows, { opacity: 1, y: 0 });
      });

      return () => mm.revert();
    },
    { scope: listRef }
  );

  return (
    <div ref={listRef}>
      {projects.map((project) => (
        // opacity-0/translate-y-8 kept: this is the hidden starting state
        // the scroll-reveal animation above animates away from — removing
        // it would silently disable the reveal effect, not just its look.
        <Link
          key={project.slug}
          href={`/projects/${project.slug}`}
          data-cursor-hover
          className="translate-y-8 opacity-0"
        >
          <h3>{project.title}</h3>
          <span>{project.category}</span>
        </Link>
      ))}
    </div>
  );
}
