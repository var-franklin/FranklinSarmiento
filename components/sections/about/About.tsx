//file path: components/sections/about/About.tsx

'use client';

import { useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { SplitText } from 'gsap/SplitText';

/**
 * Full restyle + motion pass, replacing the unstyled draft this section
 * shipped as (bare <section>, no size classes anywhere, prose Tech
 * Stack, static photo, zero GSAP). Grounded in the About.tsx audit run
 * against globals.css's actual tokens and Hero.tsx/ScrollCue.tsx's
 * actual motion pattern — not generic advice.
 *
 * Bold move (locked): the type, not the photo. The uncle's-computer-shop
 * sentence is pulled out of its original paragraph and set at display
 * scale with a Y-axis word flip as it scrolls into view — nabilissa's
 * two hallmark traits (large-scale type, Y-axis rotation) landing on one
 * element rather than splitting across two. Everything else in the
 * section settles quietly in the same timeline: no per-element flourish
 * competing with it.
 *
 * No opacity anywhere in this file's motion, including the "quiet"
 * settles — opacity transitions are off the table project-wide, GSAP or
 * otherwise. Reveals use clip-path (photo) or an overflow-hidden mask +
 * translateY (bio lines, category blocks), same family of technique
 * Hero.tsx's line-mask reveal already uses, just applied to
 * paragraph/block-sized content instead of single text lines.
 */
export default function About() {
  const sectionRef = useRef<HTMLElement>(null);

  // Runs the section's single entrance timeline once it scrolls into
  // view: photo clip-path wipe, bio lines settling in, the pulled
  // sentence flipping in on its words, then Tech Stack's five category
  // blocks and Education settling with a light stagger. No ScrollTrigger
  // precedent exists elsewhere in this codebase (Hero/ScrollCue both
  // gate on the intro-complete event instead, since they're above the
  // fold) — the trigger config below is authored fresh for this section.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const section = sectionRef.current;
        if (!section) return;

        const photoFrame = section.querySelector<HTMLElement>('.about-photo-frame');
        const bioLines = gsap.utils.toArray<HTMLElement>('.about-bio-line', section);
        const flipTarget = section.querySelector<HTMLElement>('.about-flip-line');
        const categoryBlocks = gsap.utils.toArray<HTMLElement>('.about-category', section);
        const educationBlock = section.querySelector<HTMLElement>('.about-education');

        // SplitText mutates the DOM (wraps each word in its own span) —
        // has to be created before the timeline references split.words,
        // and reverted explicitly on cleanup since useGSAP's automatic
        // revert covers GSAP tweens/ScrollTriggers, not SplitText's own
        // markup changes.
        const split = flipTarget ? new SplitText(flipTarget, { type: 'words' }) : null;

        const tl = gsap.timeline({
          defaults: { ease: 'expo.out' },
          scrollTrigger: {
            trigger: section,
            start: 'top 70%',
            once: true,
          },
        });

        if (photoFrame) {
          tl.fromTo(
            photoFrame,
            { clipPath: 'inset(0% 0% 100% 0%)' },
            { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.9 },
            0
          );
        }

        if (bioLines[0]) tl.from(bioLines[0], { yPercent: 105, duration: 0.8 }, 0.1);

        if (split) {
          // rotateY capped at -85deg rather than a rounder -90/-100 —
          // past 90deg the element's back face starts showing (mirrored
          // text) without backface-visibility handling, which this
          // codebase doesn't set up elsewhere. Staying under 90 sidesteps
          // that instead of adding a new CSS concern for one element.
          tl.from(
            split.words,
            {
              rotateY: -85,
              transformPerspective: 600,
              duration: 0.6,
              stagger: 0.025,
            },
            0.35
          );
        }

        if (bioLines[1]) tl.from(bioLines[1], { yPercent: 105, duration: 0.8 }, 0.75);
        if (bioLines[2]) tl.from(bioLines[2], { yPercent: 105, duration: 0.8 }, 0.85);

        categoryBlocks.forEach((block, i) => {
          tl.from(block, { yPercent: 35, duration: 0.7 }, 1.0 + i * 0.06);
        });

        if (educationBlock) {
          tl.from(
            educationBlock,
            { yPercent: 30, duration: 0.7 },
            1.0 + categoryBlocks.length * 0.06 + 0.1
          );
        }

        return () => {
          tl.kill();
          split?.revert();
        };
      });

      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="about"
      className="px-gutter py-section-spacing"
    >
      <h2 className="text-display-section text-ink">About</h2>

      {/* Asymmetric split (4/12 photo, 7/12 bio, col 5 left as a gap)
          instead of the flagged 50/50 — a small formal headshot doesn't
          need equal billing against the type this section is actually
          built around. Single column on mobile. */}
      <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-12 md:items-start">
        <div className="md:col-span-4">
          {/* overflow-hidden here does double duty: it's the mask for
              the clip-path reveal below, and it's also why `fill` still
              needs a positioned, sized parent — aspect-[3/4] + w-full
              reserve that box before the image loads. */}
          <div className="about-photo-frame relative aspect-[3/4] w-full max-w-xs overflow-hidden">
            <Image
              src="/images/personal/formal-picture.jpg"
              alt="Franklin Sarmiento"
              fill
              sizes="(min-width: 768px) 33vw, 80vw"
              className="object-cover"
            />
          </div>
        </div>

        <div className="md:col-span-7 md:col-start-6">
          <div className="max-w-[62ch] space-y-6">
            {/* Bio paragraphs at ink-secondary — deliberately quieter
                than the flip line below, so that line reads as the
                section's one bold move rather than one voice among
                several equally loud ones (Finding 4: this section had
                zero color hierarchy before). Copy is untouched; only the
                original second paragraph is split across two <p> tags so
                its first sentence can carry its own display-scale
                treatment — same words, no rewording, no trimming. */}
            <div className="overflow-hidden">
              <p className="about-bio-line text-body-large text-ink-secondary">
                I build software across the whole stack: interfaces
                people click through, and the backend systems quietly
                running underneath them. Most of what I build ends up in
                the hands of real organizations, not just class
                assignments. Most recently, that&apos;s CvSUHimay, my
                thesis project.
              </p>
            </div>

            <p className="about-flip-line text-display-medium text-ink">
              I got into computers young, watching my uncle run his own
              computer shop and letting me loose on whatever machine
              wasn&apos;t busy at the time.
            </p>

            <div className="overflow-hidden">
              <p className="about-bio-line text-body-large text-ink-secondary">
                That curiosity turned into a computer science degree, and
                eventually into actually shipping software people use.
              </p>
            </div>

            <div className="overflow-hidden">
              <p className="about-bio-line text-body-large text-ink-secondary">
                Outside of code, I play guitar for my church&apos;s
                praise and worship team, and I&apos;m working through a
                backlog of anime and manga I doubt I&apos;ll ever finish.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/*
        Tech Stack — content unchanged from the resume/GitHub-README/
        build-stack merge already agreed on. Structural change only:
        five comma-joined <p> tags become five discrete category blocks,
        each a label above a plain <ul> — list semantics are actually
        correct for this content, and it's what lets each category move
        as its own unit below instead of animating a wall of prose.
        No numbering — the categories aren't a sequence, nothing orders
        Languages before Databases.
      */}
      <div className="mt-16">
        <h3 className="text-display-medium text-ink">Tech Stack</h3>

        <div className="mt-6 grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          <div className="overflow-hidden">
            <div className="about-category">
              <span className="block font-mono text-label-uppercase uppercase text-ink-secondary">
                Languages
              </span>
              <ul className="mt-2 text-body-regular text-ink">
                <li>JavaScript</li>
                <li>TypeScript</li>
                <li>Java</li>
                <li>Python</li>
                <li>PHP</li>
                <li>SQL</li>
                <li>HTML5</li>
                <li>CSS3</li>
              </ul>
            </div>
          </div>

          <div className="overflow-hidden">
            <div className="about-category">
              <span className="block font-mono text-label-uppercase uppercase text-ink-secondary">
                Frameworks &amp; Libraries
              </span>
              <ul className="mt-2 text-body-regular text-ink">
                <li>React</li>
                <li>Next.js</li>
                <li>Node.js</li>
                <li>Express.js</li>
                <li>GSAP</li>
                <li>Tailwind CSS</li>
                <li>Bootstrap</li>
                <li>Vite</li>
                <li>Chart.js</li>
                <li>FullCalendar</li>
              </ul>
            </div>
          </div>

          <div className="overflow-hidden">
            <div className="about-category">
              <span className="block font-mono text-label-uppercase uppercase text-ink-secondary">
                Databases
              </span>
              <ul className="mt-2 text-body-regular text-ink">
                <li>MySQL</li>
                <li>MongoDB</li>
                <li>Oracle</li>
              </ul>
            </div>
          </div>

          <div className="overflow-hidden">
            <div className="about-category">
              <span className="block font-mono text-label-uppercase uppercase text-ink-secondary">
                Tools &amp; Platforms
              </span>
              <ul className="mt-2 text-body-regular text-ink">
                <li>Git &amp; GitHub</li>
                <li>VS Code</li>
                <li>XAMPP</li>
                <li>Postman</li>
                <li>Apache</li>
                <li>NodeMon</li>
                <li>RESTful APIs &amp; AJAX</li>
                <li>JWT/OAuth</li>
                <li>Draco</li>
                <li>Cisco Packet Tracer</li>
                <li>SketchUp</li>
                <li>WordPress</li>
              </ul>
            </div>
          </div>

          <div className="overflow-hidden">
            <div className="about-category">
              <span className="block font-mono text-label-uppercase uppercase text-ink-secondary">
                Cloud &amp; Hosting
              </span>
              <ul className="mt-2 text-body-regular text-ink">
                <li>Vercel</li>
                <li>Firebase</li>
                <li>Google Cloud</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/*
        Education — content and label:value structure unchanged (still
        Institution / Degree / Honors, still the exact wording locked in
        the prior pass, including "Magna Cum Laude" stated outright).
        Kept quieter than Tech Stack per direction: heading takes
        ink-secondary instead of full ink, and it settles as one block
        rather than getting its own per-line stagger — three facts don't
        carry the same structural weight as five category lists, and the
        motion/color here says so instead of the old identical h3+div
        treatment erasing the difference.
      */}
      <div className="about-education mt-12">
        <h3 className="text-display-medium text-ink-secondary">Education</h3>
        <div className="mt-4 space-y-2">
          <p className="text-body-regular text-ink">
            <span className="font-mono text-label-uppercase uppercase text-ink-secondary">
              Institution:
            </span>{' '}
            Cavite State University
          </p>
          <p className="text-body-regular text-ink">
            <span className="font-mono text-label-uppercase uppercase text-ink-secondary">
              Degree:
            </span>{' '}
            BS Computer Science
          </p>
          <p className="text-body-regular text-ink">
            <span className="font-mono text-label-uppercase uppercase text-ink-secondary">
              Honors:
            </span>{' '}
            Magna Cum Laude
          </p>
        </div>
      </div>

      <a
        href="/resume.pdf"
        data-cursor-hover
        download
        className="mt-12 inline-block text-body-regular text-ink underline decoration-ink-ghost underline-offset-4"
      >
        Download resume
      </a>
    </section>
  );
}