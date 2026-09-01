//file path: components/sections/projects/Project.tsx

'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { projects } from '@/lib/projects';

export default function ProjectGrid() {
  const listRef = useRef<HTMLDivElement>(null);

  const titleXTweens = useRef<Map<string, ReturnType<typeof gsap.quickTo>>>(new Map());
  const arrowXTweens = useRef<Map<string, ReturnType<typeof gsap.quickTo>>>(new Map());
  const arrowOpacityTweens = useRef<Map<string, ReturnType<typeof gsap.quickTo>>>(new Map());
  const reducedMotionRef = useRef(false);

  const trailStageRef = useRef<HTMLDivElement>(null);
  const trailEngineRef = useRef<{
    start: (slug: string, images: string[], x: number, y: number) => void;
    stop: () => void;
  } | null>(null);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    projects.forEach((project) => {
      project.trailImages.forEach((src) => {
        const img = new window.Image();
        img.src = src;
      });
    });
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useGSAP(
    () => {
      const container = listRef.current;
      if (!container) return;

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

      mm.add('(prefers-reduced-motion: no-preference) and (pointer: fine)', () => {
        const stage = trailStageRef.current;
        if (!stage) return;

        const SPAWN_DISTANCE = 186; // px the *smoothed* trail point must travel before the next stamp spawns
        const FOLLOW_EASE = 0.8; // 0–1, how fast the trail point catches up to the real cursor each frame — lower = laggier/smoother, higher = snappier
        const STAMP_SIZE = 264; // px, square
        const POP_IN_S = 0.5; // scale+fade entrance
        const HOLD_S = 0; // time fully visible before the exit starts
        const POP_OUT_S = 0.3; // scale+fade exit

        const MAX_ALIVE = 10;

        let active = false; // true only while a row is actively hovered
        let images: string[] = [];
        let imageIndex = 0;
        let currentSlug = '';

        // rawX/rawY track the actual cursor on every mousemove event.
        // trailX/trailY ease toward that target once per animation frame
        // instead of jumping straight to it — that lag is what reads as a
        // smooth trailing motion rather than stamps snapping to the raw,
        // often jumpy mousemove coordinates.
        let rawX = 0;
        let rawY = 0;
        let trailX = 0;
        let trailY = 0;
        let lastSpawnX = 0;
        let lastSpawnY = 0;
        const liveStamps: HTMLDivElement[] = [];

        // Remembers which image each project last showed, keyed by slug, so
        // re-hovering the same row picks up the next image in sequence
        // instead of always restarting at that project's first trail image.
        // Scoped to this matchMedia setup, so it resets on remount (route
        // away and back) — persisting within a session is the point, a
        // clean slate on a fresh mount is fine.
        const imageCursors = new Map<string, number>();

        const removeStamp = (el: HTMLDivElement) => {
          const idx = liveStamps.indexOf(el);
          if (idx !== -1) liveStamps.splice(idx, 1);
          el.remove();
        };

        const spawnStamp = (x: number, y: number) => {
          if (images.length === 0) return;

          if (liveStamps.length >= MAX_ALIVE) {
            const oldest = liveStamps[0];
            gsap.killTweensOf(oldest);
            removeStamp(oldest);
          }

          // Positioning/motion is handled entirely through GSAP's own
          // transform props below — xPercent/yPercent for self-centering,
          // x/y/scale for placement and the pop — rather than a manually-
          // authored `transform` string, so it composes the same way the
          // quickTo-driven transforms elsewhere in this file do, instead
          // of GSAP fighting a static inline transform on first tween.
          const el = document.createElement('div');
          el.style.position = 'absolute';
          el.style.left = '0px';
          el.style.top = '0px';
          el.style.width = `${STAMP_SIZE}px`;
          el.style.height = `${STAMP_SIZE}px`;
          el.style.willChange = 'transform, opacity';

          const img = document.createElement('img');
          img.src = images[imageIndex];
          img.alt = '';
          img.style.display = 'block';
          img.style.width = '100%';
          img.style.height = '100%';
          img.style.objectFit = 'cover';
          img.style.borderRadius = '8px';
          el.appendChild(img);

          imageIndex = (imageIndex + 1) % images.length;
          if (currentSlug) imageCursors.set(currentSlug, imageIndex);

          stage.appendChild(el);
          liveStamps.push(el);

          gsap.set(el, {
            xPercent: -50,
            yPercent: -50,
            x,
            y,
            scale: 0.8,
            opacity: 0,
          });

          gsap.to(el, {
            scale: 1,
            opacity: 1,
            duration: POP_IN_S,
            ease: 'power3.out',
            onComplete: () => {
              gsap.to(el, {
                scale: 0.94,
                opacity: 0,
                duration: POP_OUT_S,
                ease: 'power2.in',
                delay: HOLD_S,
                onComplete: () => removeStamp(el),
              });
            },
          });
        };

        const onMove = (e: MouseEvent) => {
          rawX = e.clientX;
          rawY = e.clientY;
        };
        window.addEventListener('mousemove', onMove);

        // Runs every animation frame while a row is hovered. Eases the
        // trail point toward the raw cursor position, then only spawns a
        // stamp once that smoothed point has actually moved far enough —
        // decoupling spawn cadence from raw mousemove firing (which is
        // frequent, uneven, and reads as "snappy" when used directly).
        const onTick = () => {
          if (!active) return;
          trailX += (rawX - trailX) * FOLLOW_EASE;
          trailY += (rawY - trailY) * FOLLOW_EASE;

          const dx = trailX - lastSpawnX;
          const dy = trailY - lastSpawnY;
          if (Math.hypot(dx, dy) >= SPAWN_DISTANCE) {
            spawnStamp(trailX, trailY);
            lastSpawnX = trailX;
            lastSpawnY = trailY;
          }
        };
        gsap.ticker.add(onTick);

        const start = (slug: string, newImages: string[], x: number, y: number) => {
          if (newImages.length === 0) return;
          currentSlug = slug;
          images = newImages;
          imageIndex = imageCursors.get(slug) ?? 0;
          active = true;
          // Snap the trail point to the entry position so the first stamp
          // lands exactly where the cursor entered — only movement after
          // that gets smoothed.
          rawX = x;
          rawY = y;
          trailX = x;
          trailY = y;
          spawnStamp(x, y);
          lastSpawnX = x;
          lastSpawnY = y;
        };

        const stop = () => {
          active = false;
        };

        trailEngineRef.current = { start, stop };

        return () => {
          window.removeEventListener('mousemove', onMove);
          gsap.ticker.remove(onTick);
          liveStamps.forEach((el) => {
            gsap.killTweensOf(el);
            el.remove();
          });
          liveStamps.length = 0;
          trailEngineRef.current = null;
        };
      });

      return () => mm.revert();
    },
    { scope: listRef, dependencies: [mounted] }
  );

  function handleRowEnter(slug: string, trailImages: string[], x: number, y: number) {
    if (reducedMotionRef.current) return;
    titleXTweens.current.get(slug)?.(12);
    arrowXTweens.current.get(slug)?.(0);
    arrowOpacityTweens.current.get(slug)?.(1);
    trailEngineRef.current?.start(slug, trailImages, x, y);
  }

  function handleRowLeave(slug: string) {
    if (reducedMotionRef.current) return;
    titleXTweens.current.get(slug)?.(0);
    arrowXTweens.current.get(slug)?.(-8);
    arrowOpacityTweens.current.get(slug)?.(0);
    trailEngineRef.current?.stop();
  }

  const count = projects.length;

  return (
    <div ref={listRef} className="px-gutter py-section-spacing">
      <div className="flex items-baseline justify-between border-b border-line pb-2 font-mono">
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
          className="translate-y-8 border-b border-line opacity-0"
        >
          <Link
            href={`/projects/${project.slug}`}
            data-cursor-hover
            onPointerEnter={(e) =>
              handleRowEnter(project.slug, project.trailImages, e.clientX, e.clientY)
            }
            onPointerLeave={() => handleRowLeave(project.slug)}
            className="flex flex-col gap-3 px-2 py-4 sm:flex-row sm:items-center sm:gap-gutter sm:px-4 sm:py-6"
          >
            <span className="font-mono text-label-uppercase text-ink-tertiary sm:w-12 sm:shrink-0">
              {String(i + 1).padStart(2, '0')}
            </span>

            <h3 data-row-title className="text-display-medium flex-1 text-ink">
              {project.title}
            </h3>

            <div className="flex items-center gap-4 sm:shrink-0">
              <div className="text-right font-mono">
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

      {mounted &&
        createPortal(
          <div
            ref={trailStageRef}
            aria-hidden="true"
            className="pointer-events-none fixed inset-0 z-40"
          />,
          document.body
        )}
    </div>
  );
}