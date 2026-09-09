//file path: components/sections/about/About.tsx

'use client';

import { useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { SplitText } from 'gsap/SplitText';

/**
 * Content swap on the bio block, per the new copy: opening thesis line,
 * a CS-grad/curiosity paragraph, the uncle's-shop origin story, the
 * plan-build-reorganize process line, and a closing "who I want to
 * work with" line. The old CvSUHimay-naming sentence and the hobbies
 * paragraph are gone — not an oversight, the new copy doesn't include
 * them.
 *
 * Signature treatment moved: the display-scale SplitText word-flip
 * used to sit on the uncle's-shop sentence, pulled out mid-paragraph.
 * It now sits on line one, "I build digital products from idea to
 * implementation." — it's the boldest single sentence in the section
 * now, and it opens the block instead of interrupting it, so the flip
 * line no longer needs bio lines both before and after it. Everything
 * else keeps the line-mask + translateY reveal already established in
 * this file (and in Hero.tsx before it). No opacity anywhere, same as
 * before.
 *
 * bioLines goes from 3 (hand-indexed around the old flip line's
 * position) to 4, running in a single loop after the flip line instead
 * of being split before/after it — simpler now that the flip line is
 * first rather than embedded.
 *
 */
export default function About() {
  const sectionRef = useRef<HTMLElement>(null);

  // Runs the section's single entrance timeline once it scrolls into
  // view: photo clip-path wipe, the flip-line thesis statement flipping
  // in on its words, then the four bio lines settling in sequence,
  // then Tech Stack's category blocks and Education settling with a
  // light stagger.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const section = sectionRef.current;
        if (!section) return;

        const photoFrame = section.querySelector<HTMLElement>('.about-photo-frame');
        const flipTarget = section.querySelector<HTMLElement>('.about-flip-line');
        const bioLines = gsap.utils.toArray<HTMLElement>('.about-bio-line', section);
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

        // Flips in early — it's the opening statement now, not a
        // mid-paragraph interruption, so it doesn't wait on a first
        // bio line to clear before it can start. rotateY capped at
        // -85deg rather than a rounder -90/-100 for the same reason as
        // before: past 90deg the element's back face shows (mirrored
        // text) without backface-visibility handling, which this
        // codebase doesn't set up elsewhere.
        if (split) {
          tl.from(
            split.words,
            {
              rotateY: -85,
              transformPerspective: 600,
              duration: 0.6,
              stagger: 0.025,
            },
            0.2
          );
        }components\sections\about\About.tsx

        // Four bio lines, looped with a tight stagger instead of
        // hand-indexed — the old bioLines[0]/[1]/[2] indexing existed
        // because the flip line split them into a before/after group.
        // That's gone now that the flip line is first, so a loop is
        // both simpler and more robust if the copy gains or loses a
        // line later.
        bioLines.forEach((line, i) => {
          tl.from(line, { yPercent: 105, duration: 0.8 }, 0.9 + i * 0.1);
        });

        const bioEnd = 0.9 + bioLines.length * 0.1;

        categoryBlocks.forEach((block, i) => {
          tl.from(block, { yPercent: 35, duration: 0.7 }, bioEnd + 0.25 + i * 0.06);
        });

        if (educationBlock) {
          tl.from(
            educationBlock,
            { yPercent: 30, duration: 0.7 },
            bioEnd + 0.25 + categoryBlocks.length * 0.06 + 0.1
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
          instead of a 50/50 — a small formal headshot doesn't need
          equal billing against the type this section is built around.
          Single column on mobile. Unchanged from before. */}
      <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-12 md:items-start">
        <div className="md:col-span-4">
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
            <p className="about-flip-line text-display-medium text-ink">
              I build digital products from idea to implementation.
            </p>

            <div className="overflow-hidden">
              <p className="about-bio-line text-body-large text-ink-secondary">
                I&apos;m a Computer Science graduate who builds digital
                experiences through full-stack applications, interactive
                interfaces, and experiments that satisfy my curiosity. I
                like understanding how things work, but I&apos;m even
                more interested in seeing what I can make with that
                understanding.
              </p>
            </div>

            <div className="overflow-hidden">
              <p className="about-bio-line text-body-large text-ink-secondary">
                I started messing with computers early, thanks to my
                uncle&apos;s computer shop. Whenever a machine
                wasn&apos;t busy, I was usually there, exploring it,
                experimenting with it, and figuring out what I could
                make it do.
              </p>
            </div>

            <div className="overflow-hidden">
              <p className="about-bio-line text-body-large text-ink-secondary">
                That curiosity eventually became a process that
                hasn&apos;t changed much since: get curious, plan it
                out, build it, learn from what the build teaches me,
                reorganize, and build again.
              </p>
            </div>

            <div className="overflow-hidden">
              <p className="about-bio-line text-body-large text-ink-secondary">
                I&apos;m looking to work with people who have a problem
                worth solving, an idea worth building, or a digital
                experience worth making better.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/*
        Tech Stack — unchanged. Content, structure, and motion are
        exactly as before; this section wasn't part of the copy swap.
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
        Education — unchanged.
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