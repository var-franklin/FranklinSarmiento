//file path: components/sections/about/About.tsx

import Image from 'next/image';

export default function About() {
  return (
    <section id="about">
      {/* Was a bare <h2> with no size/weight class at all — under
          Tailwind's preflight reset that renders identically to body
          text, so this heading had no visual hierarchy before. Added
          `text-display-section`, the same scale CTA's closing heading
          now uses, so the two top-level section headings read
          consistently. */}
      <h2 className="text-display-section">About</h2>

      {/* relative + aspect-ratio kept: next/image `fill` requires a
          positioned, sized parent to render at all. */}
      <div className="relative aspect-[3/4] w-48">
        <Image
          src="/images/personal/formal-picture.jpg"
          alt="Franklin Sarmiento"
          fill
          sizes="192px"
        />
      </div>

      <div>
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
        Tech Stack — replaces the earlier "Skills" placeholder.
        Content is merged from three sources, all confirmed in conversation:
          1. Resume (Languages / Frameworks / Databases / Tools blocks).
          2. GitHub README badges (var-franklin/var-franklin) — included
             in full per explicit instruction, even though several entries
             (Oracle, Firebase, Google Cloud, WordPress, Apache, NodeMon,
             Postman, Bootstrap, Vite, Python) do not appear anywhere in
             the resume or in the CvSUHimay/SupplyNest project bullets.
             These are self-reported via badge generator, not independently
             verified against shipped project code — flagging this here
             so it isn't mistaken for a verified claim later.
          3. This site's own build stack (Next.js, TypeScript, GSAP) —
             not on the resume or GitHub README, added because the user
             confirmed they should count as claimed skills.
        Education directly below is untouched — still a placeholder,
        out of scope for this change.

        Font: the field-name spans below ("Languages:", "Frameworks &
        Libraries:", etc.) get `font-mono` — they're the same label-tier
        text as the site's eyebrows/nav links/meta text, just set inline
        instead of standalone. The values after each label stay on the
        default Geist Sans (no class needed, inherited from <body>).
      */}
      <h3 className="text-display-medium">Tech Stack</h3>
      <div>
        <p>
          <span className="font-mono">Languages:</span> JavaScript,
          TypeScript, Java, Python, PHP, SQL, HTML5, CSS3
        </p>
        <p>
          <span className="font-mono">Frameworks &amp; Libraries:</span>{' '}
          React, Next.js, Node.js, Express.js, GSAP, Tailwind CSS,
          Bootstrap, Vite, Chart.js, FullCalendar
        </p>
        <p>
          <span className="font-mono">Databases:</span> MySQL, MongoDB,
          Oracle
        </p>
        <p>
          <span className="font-mono">Tools &amp; Platforms:</span> Git
          &amp; GitHub, VS Code, XAMPP, Postman, Apache, NodeMon, RESTful
          APIs &amp; AJAX, JWT/OAuth, Draco, Cisco Packet Tracer,
          SketchUp, WordPress
        </p>
        <p>
          <span className="font-mono">Cloud &amp; Hosting:</span>{' '}
          Vercel, Firebase, Google Cloud
        </p>
      </div>

      {/*
        Education — content finalized in conversation:
          - Institution shortened to "Cavite State University" (dropping
            "– Naic Campus") per explicit instruction, even after being
            flagged that CvSU is a multi-campus system.
          - "Magna Cum Laude" stated outright, "Candidate" dropped, per
            explicit instruction — flagged that expected graduation is
            September 2026 and the honor is not yet conferred; decision
            to publish it as a completed honor was made anyway.
          - Dean's Lister (2022–2026) and expected graduation date
            omitted per explicit instruction — honors line only.
      */}
      <h3 className="text-display-medium">Education</h3>
      <div>
        <p>
          <span className="font-mono">Institution:</span> Cavite State
          University
        </p>
        <p>
          <span className="font-mono">Degree:</span> BS Computer Science
        </p>
        <p>
          <span className="font-mono">Honors:</span> Magna Cum Laude
        </p>
      </div>
      <a href="/resume.pdf" data-cursor-hover download>
        Download resume
      </a>
    </section>
  );
}