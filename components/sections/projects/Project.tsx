//file path: components/sections/projects/ProjectGrid.tsx

'use client';

import { useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { projects } from '@/lib/projects';

/**
 * "Selected work" style project list: eyebrow header with a live count,
 * hairline dividers, and one full-width row per project (index / massive
 * title / right-aligned meta), in the order lib/projects.ts defines them.
 * Hover nudges the title right and reveals an arrow, both driven by GSAP
 * quickTo tweens (not CSS transitions) to stay the sole animation engine
 * per the doc's architecture rules. No `variant` prop anymore — this used
 * to render a "featured" subset for the home page and a full grid on the
 * now-removed /projects listing page; now there's only one list, shown in
 * full on the home page.
 *
 * Section-level margins (px-gutter / py-section-spacing) live on this
 * component's own root, not in app/page.tsx, so page.tsx stays untouched —
 * this keeps the file-scope constraint intact while still giving the
 * section proper breathing room against the viewport edge.
 *
 * Divider rhythm — READ BEFORE TOUCHING SPACING HERE:
 * Each row's hairline is a border-b on that row's own outer <div>, which
 * sits directly after that row's <Link py-*>. So the gap you SEE below any
 * divider is just the padding-top of whatever comes next — the previous
 * row's own padding-bottom is already "spent" above its divider, not
 * below it. That means the header must NOT carry its own margin-bottom
 * after its divider: doing so stacks an extra gap on top of row 1's own
 * pt-6/pt-8 and makes the header→row1 gap visibly bigger than every other
 * row→row gap (this was tried once and was wrong — don't reintroduce it).
 * The header's divider relies solely on row 1's own top padding, exactly
 * like every other row relies solely on the next row's own top padding.
 */
export default function ProjectGrid() {
  const listRef = useRef<HTMLDivElement>(null);

  // One quickTo tween per row per animated property, keyed by slug —
  // populated once in the mount effect below, read from the
  // pointerenter/pointerleave handlers. Refs, not state: GSAP owns these
  // values every frame, so they must never trigger a React re-render.
  const titleXTweens = useRef<Map<string, ReturnType<typeof gsap.quickTo>>>(new Map());
  const arrowXTweens = useRef<Map<string, ReturnType<typeof gsap.quickTo>>>(new Map());
  const arrowOpacityTweens = useRef<Map<string, ReturnType<typeof gsap.quickTo>>>(new Map());
  const reducedMotionRef = useRef(false);

  useGSAP(
    () => {
      const container = listRef.current;
      if (!container) return;

      // Each child is a row <div data-row> wrapping the <Link> — the
      // opacity-0/translate-y-8 starting-state classes live on the row
      // itself so GSAP animates the element that actually carries the
      // hidden state.
      const rows = container.querySelectorAll<HTMLElement>('[data-row]');
      if (rows.length === 0) return;

      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        reducedMotionRef.current = false;

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

        // Per-row hover tweens. The arrow's opacity-0 starting state is
        // set via a Tailwind class in the markup (SSR-safe, no FOUC); its
        // resting x-offset is set here imperatively, which is fine since
        // it stays invisible (opacity 0) until the first hover.
        rows.forEach((row) => {
          const slug = row.getAttribute('data-row');
          const title = row.querySelector<HTMLElement>('[data-row-title]');
          const arrow = row.querySelector<HTMLElement>('[data-row-arrow]');
          if (!slug || !title || !arrow) return;

          gsap.set(arrow, { x: -8 });

          titleXTweens.current.set(
            slug,
            gsap.quickTo(title, 'x', { duration: 0.4, ease: 'power3.out' })
          );
          arrowXTweens.current.set(
            slug,
            gsap.quickTo(arrow, 'x', { duration: 0.4, ease: 'power3.out' })
          );
          arrowOpacityTweens.current.set(
            slug,
            gsap.quickTo(arrow, 'opacity', { duration: 0.3, ease: 'power2.out' })
          );
        });

        return () => trigger.kill();
      });

      mm.add('(prefers-reduced-motion: reduce)', () => {
        reducedMotionRef.current = true;
        gsap.set(rows, { opacity: 1, y: 0 });
      });

      return () => mm.revert();
    },
    { scope: listRef }
  );

  function handleRowEnter(slug: string) {
    if (reducedMotionRef.current) return;
    titleXTweens.current.get(slug)?.(12);
    arrowXTweens.current.get(slug)?.(0);
    arrowOpacityTweens.current.get(slug)?.(1);
  }

  function handleRowLeave(slug: string) {
    if (reducedMotionRef.current) return;
    titleXTweens.current.get(slug)?.(0);
    arrowXTweens.current.get(slug)?.(-8);
    arrowOpacityTweens.current.get(slug)?.(0);
  }

  const count = projects.length;

  return (
    <div ref={listRef} className="px-gutter py-section-spacing">
      {/* Eyebrow header: section label left, live count right, hairline
          divider beneath. pb-2 is the tight gap between the label text
          and its own underline (matches the reference's "SELECTED WORK"
          underline) — deliberately NOT the same thing as the gap below
          the divider. No margin-bottom here: see the component-level
          comment above for why adding one double-counts the gap against
          row 1's own top padding. Count is derived from projects.length
          so it can never drift out of sync with the data. An <h2> (not a
          <span>) so the section keeps a real heading now that
          app/page.tsx's own <h2>Projects</h2> has been removed to avoid a
          duplicate label. */}
      <div className="flex items-baseline justify-between border-b border-line pb-2">
        <h2 className="text-label-uppercase uppercase text-ink-secondary">
          Projects
        </h2>
        <span className="text-label-uppercase text-ink-tertiary">
          ({String(count).padStart(2, '0')})
        </span>
      </div>

      {projects.map((project, i) => (
        <div
          key={project.slug}
          data-row={project.slug}
          // opacity-0/translate-y-8 kept: this is the hidden starting
          // state the scroll-reveal animation above animates away from —
          // removing it would silently disable the reveal, not just its
          // look.
          className="translate-y-8 border-b border-line opacity-0"
        >
          <Link
            href={`/projects/${project.slug}`}
            data-cursor-hover
            onPointerEnter={() => handleRowEnter(project.slug)}
            onPointerLeave={() => handleRowLeave(project.slug)}
            className="flex flex-col gap-3 py-6 sm:flex-row sm:items-center sm:gap-gutter sm:py-8"
          >
            <span className="text-label-uppercase text-ink-tertiary sm:w-12 sm:shrink-0">
              {String(i + 1).padStart(2, '0')}
            </span>

            <h3 data-row-title className="text-display-medium flex-1 text-ink">
              {project.title}
            </h3>

            <div className="flex items-center gap-4 sm:shrink-0">
              <div className="text-right">
                <div className="text-label-uppercase uppercase text-ink-secondary">
                  {project.org} · {project.category}
                </div>
                <div className="mt-1 text-label-uppercase uppercase text-ink-tertiary">
                  {project.year}
                </div>
              </div>

              <svg
                data-row-arrow
                className="h-[18px] w-[18px] shrink-0 text-accent opacity-0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
}