'use client';

import { useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { projects } from '@/lib/projects';

/**
 * Renders every entry in `lib/projects.ts` as a scroll-triggered, staggered
 * grid of cards. Used as-is on both the home page's projects section and
 * the /projects listing route — there's no featured/draft filtering, so
 * whatever is added to `projects` shows up here unchanged.
 */
export default function ProjectGrid() {
  const gridRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const container = gridRef.current;
      if (!container) return;

      const cards = container.children;
      if (cards.length === 0) return;

      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // The hidden starting state (opacity-0 translate-y-8) already lives
        // in the server-rendered className below, per the Hydration/FOUC
        // gotcha in the baseline doc — onEnter only animates it back to
        // visible, it never sets the hidden state itself.
        const trigger = ScrollTrigger.create({
          trigger: container,
          start: 'top 80%',
          once: true,
          onEnter: () => {
            gsap.to(cards, {
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
        // No stagger reveal, but cards still have to leave the opacity-0
        // starting class or reduced-motion users never see them at all —
        // this is what "respect prefers-reduced-motion via
        // gsap.matchMedia()" actually requires here, not just skipping the
        // scroll-triggered animation above.
        gsap.set(cards, { opacity: 1, y: 0 });
      });

      return () => mm.revert();
    },
    { scope: gridRef }
  );

  return (
    <div
      ref={gridRef}
      className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
    >
      {projects.map((project) => (
        /* Plain <article>, not a <Link>, for this pass — /projects/[slug]
           doesn't exist yet. data-cursor-hover is deliberately left off:
           adding it now would make Cursor.tsx show a clickable-hover state
           on something that isn't actually clickable.

           TODO: once /projects/[slug] is built, wrap this in
           <Link href={`/projects/${project.slug}`} data-cursor-hover> —
           Link can wrap an <article> child, so the semantic element stays. */
        <article
          key={project.slug}
          className="translate-y-8 rounded-lg border border-black/10 bg-white p-4 opacity-0 dark:border-white/10 dark:bg-black"
        >
          {/* Fixed aspect ratio so real screenshots and the stand-in photo
              (different intrinsic dimensions) still produce even card
              heights across the grid, and so the reserved space avoids any
              layout shift once each image finishes loading — no extra
              ScrollTrigger.refresh() call needed here as a result (see
              Patterns Established re: not scattering refresh calls). */}
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-md bg-black/5 dark:bg-white/5">
            <Image
              src={project.screenshots[0]}
              alt={`${project.title} screenshot`}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover"
            />
          </div>

          <div className="mt-4 flex flex-col gap-2">
            {/* h3 assumes this grid sits under a section-level h2 wherever
                it's mounted (home page's projects section, /projects
                listing) — that heading doesn't exist yet since Hero.tsx and
                app/projects/page.tsx haven't been built. */}
            <h3 className="text-lg font-medium">{project.title}</h3>

            <p className="text-sm text-black/60 dark:text-white/60">
              {project.role} · {project.timeframe}
            </p>

            <p className="text-sm">{project.summary}</p>

            {/* Lab Manager currently has an empty techStack — skip the tag
                row entirely rather than rendering an empty <ul>. */}
            {project.techStack.length > 0 && (
              <ul className="mt-1 flex flex-wrap gap-2">
                {project.techStack.map((tech) => (
                  <li
                    key={tech}
                    className="rounded-full border border-black/10 px-2 py-0.5 text-xs text-black/70 dark:border-white/10 dark:text-white/70"
                  >
                    {tech}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}