// lib/projects.ts

export interface Project {
  slug: string; // used for /projects/[slug]
  title: string;
  role: string;
  timeframe: string;
  techStack: string[];
  category: string; // short 2-4 word tag shown next to the title in the
  // homepage project list (e.g. "POS System") — distinct from `summary`
  // below, which is a full sentence not currently rendered anywhere in
  // the UI but kept around for possible future use (e.g. meta description).
  org: string; // organization or context behind the project — a client
  // name, an institution, or "Personal Project"/"Undergraduate Thesis"
  // for self-directed work; shown next to `category` in the homepage
  // list's right-aligned meta cluster (e.g. "Lucas Feeds & Poultry
  // Supplies · POS System").
  year: string; // display year or year range for the same meta cluster
  // (e.g. "2024–25"); an em dash ("—") where the timeframe is genuinely
  // unknown rather than a guessed date — see `bababook` below.
  summary: string; // 1-line, for grid cards
  description: string; // longer case-study body
  highlights: string[]; // Problem / Approach / Result
  githubUrl?: string; // omitted where no public repo exists
  liveUrl?: string; // none exist yet, kept for later
  screenshots: string[]; // real screenshots where they exist; a commented
  // stand-in photo where they don't yet — every project keeps at least one
  // entry so card rendering never has to branch on an empty array
  trailImages: string[]; // 3 placeholder images used by the hover-trail
  // effect on the homepage project list. Swap for real crops/stills once
  // available — kept separate from `screenshots` so the two can change
  // independently.
  videoUrl?: string;
  // CvSUHimay and SupplyNest are the two featured on the home page — the
  // stronger technical story and the real-client story, respectively.
  // Revisit if you'd rather feature a different pair once everything has
  // real screenshots.
  featured: boolean;
}

export const projects: Project[] = [
  {
    slug: 'cvsuhimay',
    title: 'CvSUHimay',
    role: 'Full-Stack Developer',
    timeframe: 'Jun 2025 – May 2026',
    techStack: ['React', 'Node.js', 'Express', 'MySQL', 'Tailwind CSS', 'Draco'],
    category: '3D Training Simulator',
    org: 'Undergraduate Thesis',
    year: '2025–26',
    summary:
      'An undergraduate thesis project simulating fish deboning in 3D, with FSM-driven validation, gamified training, and instructor analytics — independently validated at 4.94/5.',
    description:
      "CvSUHimay is a 3D fish deboning training simulator built as an undergraduate thesis with a team of three, where I served as full-stack developer. The core engineering challenge was validation: correctly judging a trainee's deboning technique step-by-step required a robust rules engine, which I architected as a 13-state Mealy-type finite state machine, backed by a REST API over a 21-table MySQL schema with JWT/OAuth authentication. Rendering 3D bone-mesh assets at usable speed on low-end campus computers was a separate bottleneck — 204 individual bone meshes started at roughly 135MB, which I brought down to 344KB (a 99.75% reduction) by batching them into 4 atlas GLBs with Draco compression. On top of the core simulation, I built a gamification layer (XP, 6 rank tiers, 21 badges, a leaderboard) and an instructor-facing analytics dashboard with per-step error tracking and mastery scoring. The finished simulator was evaluated by 10 independent instructors against the ISO 25010 software quality standard, scoring 4.94 out of 5 overall, including perfect marks in functional suitability and security.",
    highlights: [
      "Problem — Judging whether a trainee's fish-deboning technique is correct, step by step, needed a validation engine precise enough to catch errors in real time, not just a checklist.",
      'Approach — Architected a 13-state Mealy-type FSM as the validation core, backed by a REST API over a 21-table MySQL schema with JWT/OAuth auth; separately solved a 3D-performance bottleneck by batching 204 bone meshes into 4 Draco-compressed atlas GLBs, cutting asset size 99.75% (~135MB → 344KB) for low-end campus machines.',
      'Result — Validated by 10 independent instructors at 4.94/5 on the ISO 25010 standard, with perfect 5.00/5 scores in functional suitability and security.',
    ],
    githubUrl: 'https://github.com/var-franklin/CvSUHimay',
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
    trailImages: [
      '/images/trail/cvsuhimay/image1placeholder.jpg',
      '/images/trail/cvsuhimay/image2placeholder.jpg',
      '/images/trail/cvsuhimay/image3placeholder.jpg',
    ],
    videoUrl: undefined,
    featured: true,
  },
  {
    slug: 'supplynest',
    title: 'SupplyNest',
    role: 'Full-Stack Developer',
    timeframe: 'Sep 2024 – Jan 2025',
    techStack: ['React', 'Node.js', 'Express', 'MongoDB', 'Tailwind CSS', 'Chart.js', 'FullCalendar'],
    category: 'POS System',
    org: 'Lucas Feeds & Poultry Supplies',
    year: '2024–25',
    summary:
      'A commissioned MERN point-of-sale system for a poultry and feed supplier, with live digital-scale integration for weight-based pricing and automated low-stock alerts.',
    description:
      "SupplyNest is a dual-role point-of-sale platform I helped build for Lucas Feeds and Poultry Supplies, a real agricultural retail client, as part of a three-person team. The business was still running on manual record-keeping, which made bulk-weight pricing slow and inventory visibility poor. We built a three-tier MERN system with Admin and Cashier roles, including a direct integration with the store's digital weighing scales that auto-calculates bulk pricing from live weight readings, real-time inventory tracking with automated low-stock alerts, Chart.js sales dashboards on a daily/weekly/monthly cadence, and FullCalendar-based delivery and payout reminders on a 5-minute auto-refresh for near-real-time visibility. The trickiest part wasn't the software logic — it was getting several different digital scale models to talk to the system reliably, which took working directly with the scale manufacturers to resolve compatibility and data-transfer issues. We also ran the system through direct client feedback sessions to keep it flexible enough for how varied their day-to-day bulk transactions actually were.",
    highlights: [
      'Problem — A real poultry and feed retailer was running inventory and bulk-weight pricing by hand: slow, error-prone, and with no live visibility into stock or sales.',
      'Approach — Built a three-tier MERN POS system with Admin/Cashier roles, live digital-scale integration for weight-based pricing, automated low-stock alerts, and Chart.js/FullCalendar dashboards; the hardest part was making several different scale models talk to the system reliably, solved by working directly with the manufacturers.',
      'Result — Deployed for daily use at the client\'s shop, replacing manual record-keeping with real-time inventory and sales visibility, refined through direct client feedback sessions.',
    ],
    // Repo is named Supply-Nest (capitalized, hyphenated) on GitHub, even
    // though the slug/title here use the lowercase, unhyphenated form —
    // doesn't matter functionally, just noting so the URL isn't "corrected"
    // to match the slug by accident later.
    githubUrl: 'https://github.com/var-franklin/Supply-Nest',
    liveUrl: undefined,
    screenshots: [
      '/images/projects/cvsuhimay-01-overview.png',
      // TODO: STAND-IN, not a real SupplyNest screenshot — no image files
      // for this project exist yet. Swap for actual screenshots and delete
      // this comment once they're added.
    ],
    trailImages: [
      '/images/trail/supplynest/image1placeholder.jpg',
      '/images/trail/supplynest/image2placeholder.jpg',
      '/images/trail/supplynest/image3placeholder.jpg',
    ],
    videoUrl: undefined,
    featured: true,
  },
  {
    slug: 'bababook',
    title: 'BaBaBook',
    role: 'Full-Stack Developer',
    // Genuinely unknown, not placeholder copy — no dates on the resume or on GitHub.
    timeframe: 'Unknown — no dates found on resume or GitHub',
    techStack: ['React 19', 'Vite', 'Express', 'MongoDB', 'Tailwind CSS', 'Leaflet', 'Google Books API'],
    category: 'E-Book Library Platform',
    org: 'Personal Project',
    year: '—',
    summary:
      'A three-role e-book library platform combining a public book catalog with real library borrowing workflows, library discovery on an interactive map, and reading-progress tracking.',
    description:
      "BaBaBook is a full-stack e-book library platform I built with one teammate, growing out of a research proposal we presented on making library resources more accessible to digital learners. It supports three roles: readers can browse and search books pulled from the Google Books API alongside locally uploaded titles, save titles to a reading list, request to borrow a physical copy from a specific library, track borrow status, and generate a printable borrowing ticket as a PDF; librarians can register a library account (held in a pending state until admin approval), manage their catalog, and approve or reject borrow requests; and admins approve librarian applications and manage user accounts platform-wide. Readers can also find nearby libraries on an interactive Leaflet/OpenStreetMap map with location search, and track their reading progress with bookmarks, annotations, and completion percentage. I was candid in the project's own documentation about what's still rough around the edges — authentication currently relies on a client-stored user object rather than signed tokens, and the Google Books API key is hardcoded rather than environment-configured — both flagged as the first things I'd fix with more time, alongside adding automated tests.",
    highlights: [
      'Problem — Traditional school libraries are limited by physical space and book condition, while students increasingly expect to search, request, and track reading anywhere.',
      'Approach — Built a three-role platform (Reader/Librarian/Admin) combining a Google Books API catalog with a real physical-borrowing workflow, an interactive Leaflet map for library discovery, and PDF borrowing tickets via jsPDF — on React 19, Vite, Express, and MongoDB.',
      'Result — Shipped as a working full-stack platform with a candidly documented punch list (token-based auth, environment-configured API keys, automated tests) for what a production version would need next.',
    ],
    githubUrl: 'https://github.com/var-franklin/BaBaBook',
    liveUrl: undefined,
    screenshots: [
      '/images/projects/cvsuhimay-01-overview.png',
      // TODO: STAND-IN, not a real BaBaBook screenshot — no image files for
      // this project exist yet. Swap for actual screenshots and delete this
      // comment once they're added.
    ],
    trailImages: [
      '/images/trail/bababook/image1placeholder.jpg',
      '/images/trail/bababook/image2placeholder.jpg',
      '/images/trail/bababook/image3placeholder.jpg',
    ],
    videoUrl: undefined,
    featured: false,
  },
  {
    slug: 'odci-record-management',
    title: 'ODCI Record Management System',
    role: 'IT Intern / Team Lead',
    timeframe: 'Jul 2025 – Aug 2025',
    techStack: ['PHP', 'JavaScript'],
    category: 'Document Management System',
    org: 'Cavite State University',
    year: '2025',
    summary:
      "A centralized document management platform I led development of during my IT internship, deployed across six departments at my university's Naic campus.",
    description:
      'During my IT internship in Cavite State University – Naic Campus\'s IT Department, I led a team of three in building the ODCI Record Management System, a centralized platform for managing departmental documents and records. It replaced a more fragmented, department-by-department approach to recordkeeping with a single system deployed across six departments campus-wide. As team lead, I was responsible for coordinating the build alongside my own hands-on development work in PHP and JavaScript.',
    highlights: [
      'Problem — Departmental records across the Naic campus were being managed separately by each department, with no centralized system for document handling.',
      'Approach — Led a three-person team building a centralized document management platform in PHP and JavaScript, while also contributing hands-on development.',
      'Result — Deployed campus-wide across six departments during a two-month internship.',
    ],
    githubUrl: undefined, // institutional project — no public repo exists
    liveUrl: undefined,
    screenshots: [
      '/images/projects/odci-01-login.png',
      '/images/projects/odci-02-dashboard.png',
      '/images/projects/odci-03-department-folders.png',
      '/images/projects/odci-04-social-feed.png',
      '/images/projects/odci-05-tracker.png',
      '/images/projects/odci-06-admin-dashboard.png',
    ],
    trailImages: [
      '/images/trail/odci-record-management/image1placeholder.jpg',
      '/images/trail/odci-record-management/image2placeholder.jpg',
      '/images/trail/odci-record-management/image3placeholder.jpg',
    ],
    videoUrl: undefined,
    featured: false,
  },
  {
    slug: 'lab-manager',
    title: 'Lab Manager',
    role: 'Full-Stack Developer — Web System',
    timeframe: 'Jan 2025',
    techStack: ['React', 'Vite', 'Node.js', 'Express', 'MongoDB', 'CSS'],
    category: 'Lab Equipment System',
    org: 'Manuel S. Enverga University Foundation',
    year: '2025',
    summary:
      'A commissioned MERN system for tracking school lab equipment — availability, room assignment, and maintenance status — in real time across three roles.',
    description:
      "Lab Manager is a laboratory equipment management system I was commissioned to build, as the web half of a two-person freelance engagement — a teammate built a companion mobile app under the same contract, covering QR-code equipment scanning; this project covers the web system, which I built solo. It was commissioned by students at Manuel S. Enverga University Foundation for their school's lab. The core challenge was accuracy: a single equipment type can have units that are simultaneously free, checked out to a specific room, and pulled for maintenance, and all three states have to stay in sync rather than drift apart. I built the system around careful file and data organization and disciplined status tracking across the platform's three roles — Admin, Faculty, and Technician — with testing focused specifically on confirming that status logic held up correctly before considering any feature done. The whole engagement ran about a month, delivered as a fixed-scope freelance contract and handed off as source code on full payment.",
    highlights: [
      'Problem — Lab equipment status isn\'t a simple in/out binary: a single item type can have units simultaneously free, distributed to a specific room, and under maintenance, and all three have to stay accurate together.',
      'Approach — Built the web half of a two-person freelance engagement (a teammate handled a companion mobile app), focused on careful data organization and disciplined status tracking across three roles — Admin, Faculty, and Technician.',
      'Result — Delivered solo on the web side within a one-month, fixed-scope freelance contract for Manuel S. Enverga University Foundation; handed off as source code on full payment.',
    ],
    githubUrl: 'https://github.com/var-franklin/Lab-Manager',
    liveUrl: undefined,
    screenshots: [
      '/images/projects/cvsuhimay-01-overview.png',
      // TODO: STAND-IN, not a real Lab Manager screenshot — purely
      // handed-off source code at this point, no screenshots exist. Swap
      // for actual screenshots if any become available.
    ],
    trailImages: [
      '/images/trail/lab-manager/image1placeholder.jpg',
      '/images/trail/lab-manager/image2placeholder.jpg',
      '/images/trail/lab-manager/image3placeholder.jpg',
    ],
    videoUrl: undefined,
    featured: false,
  },
];