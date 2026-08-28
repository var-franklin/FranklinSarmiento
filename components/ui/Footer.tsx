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
    <footer>
      <a href="mailto:franklin.yan.sarmiento@gmail.com" data-cursor-hover>
        franklin.yan.sarmiento@gmail.com
      </a>
      <div>
        <a href="https://github.com/var-franklin" data-cursor-hover>
          [GitHub]
        </a>
        <a
          href="https://www.linkedin.com/in/franklinsarmiento/"
          data-cursor-hover
          target="_blank"
          rel="noopener noreferrer"
        >
          [LinkedIn]
        </a>
      </div>
    </footer>
  );
}
