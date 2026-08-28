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

      <section id="projects">
        <h2>Projects</h2>

        <div>
          <ProjectGrid />
        </div>
      </section>

      <CTA />
    </main>
  );
}
