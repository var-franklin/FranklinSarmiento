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
    <main className="mx-auto max-w-3xl px-6 py-24">
      <h1 className="text-3xl font-medium">{project.title}</h1>

      <p className="mt-2 text-sm text-black/60 dark:text-white/60">
        {project.role} · {project.timeframe}
      </p>

      {project.techStack.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-2">
          {project.techStack.map((tech) => (
            <li
              key={tech}
              className="rounded-full border border-black/10 px-2 py-0.5 text-xs text-black/70 dark:border-white/10 dark:text-white/70"
            >
              {tech}
            </li>
          ))}
        </ul>
      )}

      <p className="mt-6">{project.description}</p>

      {project.highlights.length > 0 && (
        <ul className="mt-6 list-disc space-y-2 pl-5">
          {project.highlights.map((point, i) => (
            <li key={i}>{point}</li>
          ))}
        </ul>
      )}

      {project.screenshots.length > 0 && (
        <div className="mt-8 flex flex-col gap-4">
          {project.screenshots.map((src) => (
            <div
              key={src}
              className="relative aspect-[4/3] w-full overflow-hidden rounded-md bg-black/5 dark:bg-white/5"
            >
              <Image
                src={src}
                alt={`${project.title} screenshot`}
                fill
                sizes="(min-width: 768px) 768px, 100vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      )}

      {(project.githubUrl || project.liveUrl) && (
        <div className="mt-8 flex gap-6">
          {project.githubUrl && (
            <a href={project.githubUrl} data-cursor-hover className="underline underline-offset-4">
              GitHub
            </a>
          )}
          {project.liveUrl && (
            <a href={project.liveUrl} data-cursor-hover className="underline underline-offset-4">
              Live site
            </a>
          )}
        </div>
      )}
    </main>
  );
}