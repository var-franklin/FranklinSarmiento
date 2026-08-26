//file path: app/page.tsx

import Link from 'next/link';
import Hero from '@/components/sections/hero/Hero';
import About from '@/components/sections/about/About';
import ProjectGrid from '@/components/sections/projects/ProjectGrid';
import CTA from '@/components/sections/cta/CTA';

export default function Home() {
  return (
    <main>
      <Hero />

      <About />

      <section className="mx-auto max-w-6xl px-6 py-24">
        <h2 className="text-3xl font-medium">Featured Projects</h2>

        <div className="mt-10">
          <ProjectGrid variant="featured" />
        </div>

        <Link
          href="/projects"
          data-cursor-hover
          className="mt-10 inline-block underline underline-offset-4"
        >
          View all projects
        </Link>
      </section>

      <CTA />
    </main>
  );
}