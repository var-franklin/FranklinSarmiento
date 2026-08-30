//file path: components/ui/Nav.tsx

'use client';

import { useRef, type MouseEvent, type PointerEvent as ReactPointerEvent } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { scrollToSection } from '@/lib/scrollToSection';

// "Projects" no longer routes to a /projects page (removed — the home page
// now lists every project). sectionId marks it as an in-page scroll target
// instead of a normal route.
const LINKS: { href: string; label: string; sectionId?: string }[] = [
  { href: '/', label: 'Home' },
  { href: '/#projects', label: 'Projects', sectionId: 'projects' },
];

/**
 * Text-link component per franklinsarmiento-DESIGN.md's Components
 * section: rest is ink-secondary/ink, hover draws an ink underline in
 * from whichever side the cursor actually approached (not a fixed
 * direction), active/pressed snaps the underline to full width
 * instantly with no easing, and the current page keeps a permanent
 * underline at rest so nav state is never hover-only information.
 *
 * This is also the doc's "cursor-reactive hover, not a custom cursor"
 * component in practice: the native cursor is never touched, individual
 * elements react to pointer position instead. It replaces the old
 * global Cursor.tsx dot (see CHANGE-NOTES.md) — that component hid
 * nothing here since it was never mounted in layout.tsx, but its
 * data-cursor-hover contract is gone now that hover lives per-element.
 *
 * Mouse-only (pointerType check) and the sliding underline is skipped
 * entirely under prefers-reduced-motion, since it's a transform and the
 * doc's reduced-motion definition explicitly cuts transforms rather than
 * just slowing them down. The color change on hover/focus is a plain
 * CSS transition, not a transform, so reduced-motion users still get
 * immediate feedback — just without the directional slide.
 *
 * introTarget: opt-in flag that stamps a bare data-intro-target attribute
 * on the anchor. IntroSplash.tsx reads that attribute's bounding box to
 * Flip its splash name down onto whichever of the two name instances
 * (desktop "Franklin Sarmiento" or mobile "FS") is actually visible. It
 * carries no visual or behavioral change on its own — Nav's markup,
 * styling, and both name instances stay exactly as they already were.
 */
function NavAnchor({
  href,
  label,
  className,
  isActive = false,
  scroll = true,
  onClick,
  introTarget = false,
}: {
  href: string;
  label: string;
  className: string;
  isActive?: boolean;
  scroll?: boolean;
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
  introTarget?: boolean;
}) {
  const linkRef = useRef<HTMLAnchorElement>(null);
  const underlineRef = useRef<HTMLSpanElement>(null);

  const { contextSafe } = useGSAP({ scope: linkRef });

  const prefersReducedMotion = () =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const approachSide = (event: ReactPointerEvent<HTMLAnchorElement>) => {
    const el = linkRef.current;
    if (!el) return 'left';
    const rect = el.getBoundingClientRect();
    return event.clientX - rect.left < rect.width / 2 ? 'left' : 'right';
  };

  const handleEnter = contextSafe((event: ReactPointerEvent<HTMLAnchorElement>) => {
    if (event.pointerType !== 'mouse' || prefersReducedMotion()) return;
    const underline = underlineRef.current;
    if (!underline) return;
    gsap.set(underline, { transformOrigin: approachSide(event) });
    gsap.to(underline, { scaleX: 1, duration: 0.25, ease: 'power2.out' }); // duration-fast / ease-standard
  });

  const handleLeave = contextSafe((event: ReactPointerEvent<HTMLAnchorElement>) => {
    if (event.pointerType !== 'mouse' || prefersReducedMotion()) return;
    const underline = underlineRef.current;
    if (!underline) return;
    gsap.set(underline, { transformOrigin: approachSide(event) });
    gsap.to(underline, { scaleX: isActive ? 1 : 0, duration: 0.25, ease: 'power2.out' });
  });

  const handleDown = contextSafe((event: ReactPointerEvent<HTMLAnchorElement>) => {
    if (event.pointerType !== 'mouse') return;
    const underline = underlineRef.current;
    if (!underline) return;
    gsap.set(underline, { scaleX: 1 }); // active/pressed: snap instantly, per doc
  });

  return (
    <Link
      ref={linkRef}
      href={href}
      scroll={scroll}
      onClick={onClick}
      onPointerEnter={handleEnter}
      onPointerLeave={handleLeave}
      onPointerDown={handleDown}
      aria-current={isActive ? 'page' : undefined}
      data-intro-target={introTarget ? '' : undefined}
      className={`relative inline-block ${className}`}
    >
      {label}
      <span
        ref={underlineRef}
        aria-hidden="true"
        className={`pointer-events-none absolute inset-x-0 -bottom-0.5 h-px origin-left bg-ink ${
          isActive ? 'scale-x-100' : 'scale-x-0'
        }`}
      />
    </Link>
  );
}

export default function Nav() {
  const navRef = useRef<HTMLElement>(null);
  const pathname = usePathname();

  useGSAP(() => {
    const nav = navRef.current;
    if (!nav) return;

    let lastY = 0;

    const trigger = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => {
        const y = self.scroll();

        // Background/hairline state is a threshold toggle, not motion, so
        // it updates for every visitor regardless of reduced-motion.
        nav.dataset.scrolled = String(y > 80);

        // The hide-on-scroll-down translate IS motion — it's the only
        // part gated behind the reduced-motion check.
        if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          const scrollingDown = y > lastY && y > 80;
          gsap.to(nav, {
            yPercent: scrollingDown ? -100 : 0,
            duration: 0.5, // duration-base
            ease: 'power2.out', // ease-standard
            overwrite: 'auto',
          });
        }

        lastY = y;
      },
    });

    return () => trigger.kill();
  });

  return (
    // fixed/inset-x-0/top-0/z-50 kept: the hide-on-scroll animation above
    // translates this element via yPercent, which only has a visible
    // effect if the nav is taken out of normal document flow. The border
    // is always rendered (transparent at rest) so the scrolled state
    // never shifts layout — only its color changes.
    <nav
      ref={navRef}
      className="fixed inset-x-0 top-0 z-50 flex items-center justify-between border-b border-transparent px-gutter py-4 transition-[background-color,border-color,backdrop-filter] duration-[250ms] ease-out data-[scrolled=true]:border-line data-[scrolled=true]:bg-background-base/90 data-[scrolled=true]:backdrop-blur-md"
    >
      {/* Two instances, one hidden per breakpoint via display:none, so only
          one is ever in the DOM's accessibility tree at a time — "FS" is a
          space-constrained mobile fallback, not new content. Both carry
          introTarget: IntroSplash finds whichever one is actually visible
          (offsetParent !== null) and Flips onto that one. */}
      <NavAnchor
        href="/"
        label="Franklin Sarmiento"
        introTarget
        className="hidden text-body-regular font-semibold tracking-tight uppercase text-ink sm:inline-block"
      />
      <NavAnchor
        href="/"
        label="FS"
        introTarget
        className="text-body-regular font-semibold tracking-tight text-ink sm:hidden"
      />

      <ul className="flex items-center gap-6">
        {LINKS.map((link) => {
          const isActive = link.sectionId ? false : pathname === link.href;

          const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
            if (!link.sectionId) return;
            if (pathname !== '/') return; // let Link navigate to "/#projects";
            // HashScrollHandler takes it from there once we land on "/".

            event.preventDefault();
            scrollToSection(link.sectionId);
          };

          return (
            <li key={link.href}>
              <NavAnchor
                href={link.href}
                label={link.label}
                scroll={!link.sectionId}
                onClick={handleClick}
                isActive={isActive}
                className="text-nav-link uppercase text-ink-secondary transition-colors duration-[250ms] ease-out hover:text-ink focus-visible:text-ink"
              />
            </li>
          );
        })}
      </ul>
    </nav>
  );
}