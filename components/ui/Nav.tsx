//file path: components/ui/Nav.tsx

'use client';

import { useRef, type MouseEvent } from 'react';
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

export default function Nav() {
  const navRef = useRef<HTMLElement>(null);
  const pathname = usePathname();

  useGSAP(() => {
    const nav = navRef.current;
    if (!nav) return;

    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      let lastY = 0;

      const trigger = ScrollTrigger.create({
        start: 0,
        end: 'max',
        onUpdate: (self) => {
          const y = self.scroll();
          const scrollingDown = y > lastY && y > 80;

          gsap.to(nav, {
            yPercent: scrollingDown ? -100 : 0,
            duration: 0.4,
            ease: 'power2.out',
            overwrite: 'auto',
          });

          nav.dataset.scrolled = String(y > 80);
          lastY = y;
        },
      });

      return () => trigger.kill();
    });

    return () => mm.revert();
  });

  return (
    // fixed/inset-x-0/top-0/z-50 kept: the hide-on-scroll animation above
    // translates this element via yPercent, which only has a visible
    // effect if the nav is taken out of normal document flow.
    <nav ref={navRef} className="fixed inset-x-0 top-0 z-50">
      <Link href="/" data-cursor-hover>
        Franklin Sarmiento
      </Link>
      <ul>
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
              <Link
                href={link.href}
                data-cursor-hover
                scroll={!link.sectionId}
                onClick={handleClick}
                aria-current={isActive ? 'page' : undefined}
              >
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}