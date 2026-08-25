// lib/projects.ts
//
// Typed project data for the /projects routes and the home page's projects
// section — both render this same array, unfiltered.
//
// Per content-structure-plan.md: structural fields (tech stack, dates, role,
// links) are real where known. Narrative/marketing prose fields (summary,
// description, highlights) are literal placeholders until real copy is
// written — do not treat the bracketed text as content, it's a slot to fill.
//
// Screenshot paths point at real files in public/images/projects/, which
// are flat (e.g. "cvsuhimay-01-overview.png") — don't reintroduce a nested
// "/images/projects/<slug>/N.jpg" pattern here, that's not what's on disk.
//
export interface Project {
  slug: string; // used for /projects/[slug]
  title: string;
  role: string;
  timeframe: string;
  techStack: string[];
  summary: string; // 1-line placeholder for grid cards
  description: string; // longer placeholder for the case study body
  highlights: string[]; // Problem / Approach / Result — placeholder text, real shape
  githubUrl?: string; // omitted where no public repo exists, or the URL hasn't been supplied yet
  liveUrl?: string; // none exist yet, kept for later
  screenshots: string[]; // real screenshots where they exist; a commented
  // stand-in photo where they don't yet — every project keeps at least one
  // entry so card rendering never has to branch on an empty array
  videoUrl?: string;
}

export const projects: Project[] = [
  {
    slug: 'cvsuhimay',
    title: 'CvSUHimay',
    role: 'Full-Stack Developer',
    timeframe: 'Jun 2025 – May 2026',
    techStack: ['React', 'Node.js', 'Express', 'MySQL', 'Tailwind CSS'],
    summary: '[placeholder summary]',
    description: '[placeholder description]',
    highlights: [
      '[Problem — placeholder]',
      '[Approach — placeholder]',
      '[Result — placeholder]',
    ],
    githubUrl: undefined, // TODO: paste the CvSUHimay repo URL — a public repo was confirmed found
    liveUrl: undefined,
    screenshots: [
      '/images/projects/cvsuhimay-01-overview.png',
      '/images/projects/cvsuhimay-02-login.png',
      '/images/projects/cvsuhimay-03-dashboard.png',
      '/images/projects/cvsuhimay-04-simulator.png',
      '/images/projects/cvsuhimay-05-3d-simulation.png',
      // cvsuhimay-1.png intentionally excluded — confirmed a duplicate of
      // -01-overview.png, not a sixth distinct screenshot.
    ],
    videoUrl: undefined,
  },
  {
    slug: 'supplynest',
    title: 'SupplyNest',
    role: 'Full-Stack Developer',
    timeframe: 'Sep 2024 – Jan 2025',
    techStack: ['React', 'Node.js', 'Express', 'MongoDB', 'Tailwind CSS', 'Chart.js'],
    summary: '[placeholder summary]',
    description: '[placeholder description]',
    highlights: [
      '[Problem — placeholder]',
      '[Approach — placeholder]',
      '[Result — placeholder]',
    ],
    githubUrl: undefined, // TODO: you confirmed a URL exists for this one — send it and I'll drop it in
    liveUrl: undefined,
    screenshots: [
      '/images/projects/cvsuhimay-01-overview.png',
      // TODO: STAND-IN, not a real SupplyNest screenshot — no image files
      // for this project exist yet. Swap for actual screenshots and delete
      // this comment once they're added.
    ],
    videoUrl: undefined,
  },
  {
    slug: 'bababook',
    title: 'BaBaBook',
    role: 'Full-Stack Developer',
    // Genuinely unknown, not placeholder copy — no dates on the resume or on GitHub.
    timeframe: 'Unknown — no dates found on resume or GitHub',
    techStack: ['React 19', 'Vite', 'Express', 'MongoDB', 'Tailwind CSS', 'Leaflet'],
    summary: '[placeholder summary]',
    description: '[placeholder description]',
    highlights: [
      '[Problem — placeholder]',
      '[Approach — placeholder]',
      '[Result — placeholder]',
    ],
    githubUrl: undefined, // TODO: paste the BaBaBook repo URL — a public repo was confirmed found
    liveUrl: undefined,
    screenshots: [
      '/images/projects/cvsuhimay-01-overview.png',
      // TODO: STAND-IN, not a real BaBaBook screenshot — no image files for
      // this project exist yet. Swap for actual screenshots and delete this
      // comment once they're added.
    ],
    videoUrl: undefined,
  },
  {
    slug: 'odci-record-management',
    title: 'ODCI Record Management System',
    role: 'IT Intern / Team Lead',
    timeframe: 'Jul 2025 – Aug 2025',
    techStack: ['PHP', 'JavaScript'],
    summary: '[placeholder summary]',
    description: '[placeholder description]',
    highlights: [
      '[Problem — placeholder]',
      '[Approach — placeholder]',
      '[Result — placeholder]',
    ],
    githubUrl: undefined, // institutional project — a public repo is unlikely to exist, not just unconfirmed
    liveUrl: undefined,
    screenshots: [
      '/images/projects/odci-01-login.png',
      '/images/projects/odci-02-dashboard.png',
      '/images/projects/odci-03-department-folders.png',
      '/images/projects/odci-04-social-feed.png',
      '/images/projects/odci-05-tracker.png',
      '/images/projects/odci-06-admin-dashboard.png',
    ],
    videoUrl: undefined,
  },
  {
    slug: 'lab-manager',
    title: 'Lab Manager',
    // Everything below is a genuine unknown, not marketing placeholder text —
    // nothing about this project has been supplied beyond its name. Replace
    // as soon as real details exist; don't treat these strings as content.
    role: 'Unknown — no information provided yet',
    timeframe: 'Unknown — no information provided yet',
    techStack: [],
    summary: '[placeholder summary]',
    description: '[placeholder description]',
    highlights: [
      '[Problem — placeholder]',
      '[Approach — placeholder]',
      '[Result — placeholder]',
    ],
    githubUrl: undefined,
    liveUrl: undefined,
    screenshots: [
      '/images/projects/cvsuhimay-01-overview.png',
      // TODO: STAND-IN, not a real Lab Manager screenshot — nothing about
      // this project exists yet beyond its name. Swap for actual
      // screenshots once there's anything to show.
    ],
    videoUrl: undefined,
  },
];