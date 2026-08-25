'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

const LINKS = [
  { href: '/', label: 'Home' },
  { href: '/projects', label: 'Projects' },
  // '/about' left out on purpose — your baseline doc still has "separate
  // page vs. home section" open. Add it once that's decided.
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
    <nav
      ref={navRef}
      className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-6 py-4 transition-colors data-[scrolled=true]:backdrop-blur-md"
    >
      <Link href="/" data-cursor-hover className="font-medium">
        Franklin Sarmiento
      </Link>
      <ul className="flex gap-6">
        {LINKS.map((link) => {
          const isActive = pathname === link.href;
          return (
            <li key={link.href}>
              <Link
                href={link.href}
                data-cursor-hover
                aria-current={isActive ? 'page' : undefined}
                className={isActive ? 'opacity-100' : 'opacity-70 hover:opacity-100'}
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