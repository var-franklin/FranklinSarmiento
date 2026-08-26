//file path: app/projects/page.tsx

import ProjectGrid from '@/components/sections/projects/ProjectGrid';

export default function ProjectsPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-24">
      <h1 className="text-3xl font-medium">Projects</h1>

      <div className="mt-10">
        <ProjectGrid />
      </div>
    </main>
  );
}