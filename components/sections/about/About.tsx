//file path: components/sections/about/About.tsx

import Image from 'next/image';

/**
 * Renders the About section inline on the home page. This used to support
 * a 'preview' | 'full' split tied to a standalone /about route (short
 * blurb + "Read more" on the home page, full content on /about). That
 * route is gone now that the site is Hero / About / Featured Projects /
 * CTA / Footer as a single page — so there's only one shape left, and the
 * variant prop and preview branch go with it.
 */
export default function About() {
  return (
    <section id="about" className="mx-auto max-w-3xl px-6 py-24">
        <h2 className="text-3xl font-medium">About</h2>

        <div className="relative mt-8 aspect-[3/4] w-48 overflow-hidden rounded-md bg-black/5 dark:bg-white/5">
        <Image
          src="/images/personal/formal-picture.jpg"
          alt="Franklin Sarmiento"
          fill
          sizes="192px"
          className="object-cover"
        />
      </div>

      <p className="mt-8">[placeholder bio]</p>

      <h3 className="mt-10 text-xl font-medium">Skills</h3>
      <p className="mt-2">[placeholder skills list]</p>

      <h3 className="mt-10 text-xl font-medium">Education</h3>
      <p className="mt-2">[placeholder education]</p>
      <a href="/resume.pdf"
        data-cursor-hover
        download
        className="mt-10 inline-block underline underline-offset-4"
        > Download resume
      </a>
    </section>
  );
}