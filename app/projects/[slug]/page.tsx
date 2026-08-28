//file path: app/projects/[slug]/page.tsx

import { notFound } from 'next/navigation';
import Image from 'next/image';
import { projects } from '@/lib/projects';

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    notFound();
  }

  return (
    <main>
      <h1>{project.title}</h1>

      <p>
        {project.role} · {project.timeframe}
      </p>

      {project.techStack.length > 0 && (
        <ul>
          {project.techStack.map((tech) => (
            <li key={tech}>{tech}</li>
          ))}
        </ul>
      )}

      <p>{project.description}</p>

      {project.highlights.length > 0 && (
        <ul>
          {project.highlights.map((point, i) => (
            <li key={i}>{point}</li>
          ))}
        </ul>
      )}

      {project.screenshots.length > 0 && (
        <div>
          {project.screenshots.map((src) => (
            // relative + aspect-ratio kept: next/image `fill` requires a
            // positioned, sized parent to render at all — this is a
            // functional requirement of the Image component, not styling.
            <div key={src} className="relative aspect-[4/3] w-full">
              <Image
                src={src}
                alt={`${project.title} screenshot`}
                fill
                sizes="(min-width: 768px) 768px, 100vw"
              />
            </div>
          ))}
        </div>
      )}

      {(project.githubUrl || project.liveUrl) && (
        <div>
          {project.githubUrl && (
            <a href={project.githubUrl} data-cursor-hover>
              GitHub
            </a>
          )}
          {project.liveUrl && (
            <a href={project.liveUrl} data-cursor-hover>
              Live site
            </a>
          )}
        </div>
      )}
    </main>
  );
}
