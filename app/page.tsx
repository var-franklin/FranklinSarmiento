//file path: app/page.tsx

import Hero from '@/components/sections/hero/Hero';
import About from '@/components/sections/about/About';
import ProjectGrid from '@/components/sections/projects/ProjectGrid';
import CTA from '@/components/sections/cta/CTA';

export default function Home() {
  return (
    <main>
      <Hero />

      <About />

      <section id="projects" className="mx-auto max-w-6xl px-6 py-24">
        <h2 className="text-3xl font-medium">Projects</h2>

        <div className="mt-10">
          <ProjectGrid />
        </div>
      </section>

      <CTA />
    </main>
  );
}