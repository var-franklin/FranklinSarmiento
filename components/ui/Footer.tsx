//file path: components/ui/Footer.tsx

/**
 * Renders the site-wide footer: email and social link slots.
 * No modal or contact-form logic — full contact functionality is
 * explicitly deferred past this pass per the Backbone Build Plan. Mounted
 * once in app/layout.tsx (same as Nav), so it persists across client-side
 * navigation instead of remounting on every page.
 */
export default function Footer() {
  return (
    <footer className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-12 text-sm text-black/60 dark:text-white/60 sm:flex-row sm:items-center sm:justify-between">
      <a
        href="mailto:franklin.yan.sarmiento@gmail.com"
        data-cursor-hover
        className="hover:text-black dark:hover:text-white"
      >
        franklin.yan.sarmiento@gmail.com
      </a>

      <div className="flex gap-6">
        <a href="#" data-cursor-hover className="hover:text-black dark:hover:text-white">
          [GitHub]
        </a>
        <a href="#" data-cursor-hover className="hover:text-black dark:hover:text-white">
          [LinkedIn]
        </a>
      </div>
    </footer>
  );
}