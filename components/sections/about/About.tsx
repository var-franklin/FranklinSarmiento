//file path: components/sections/about/About.tsx

import Image from 'next/image';

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

      <div className="mt-8 space-y-4">
        <p>
          I build software across the whole stack: interfaces people
          click through, and the backend systems quietly running
          underneath them. Most of what I build ends up in the hands of
          real organizations, not just class assignments. Most recently,
          that&apos;s CvSUHimay, my thesis project.
        </p>
        <p>
          I got into computers young, watching my uncle run his own
          computer shop and letting me loose on whatever machine
          wasn&apos;t busy at the time. That curiosity turned into a
          computer science degree, and eventually into actually shipping
          software people use.
        </p>
        <p>
          Outside of code, I play guitar for my church&apos;s praise and
          worship team, and I&apos;m working through a backlog of anime
          and manga I doubt I&apos;ll ever finish.
        </p>
      </div>

      {/*
        Skills and Education weren't part of this round's brainstorm —
        only the bio narrative got finalized — so these are left exactly
        as placeholders rather than guessed at. See note below re: whether
        "Skills" should even live inside About.tsx given the Hero → About
        → Skills → Projects flow you described.
      */}
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