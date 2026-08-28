//file path: components/sections/cta/CTA.tsx

/**
 * Closing "get in touch" section, between Featured Projects and the
 * Footer. This is deliberately not a duplicate of the Footer's email link
 * — it's the bigger, purpose-built version that closes out the home page.
 * The Footer's smaller link stays as a persistent fallback on every route,
 * including /projects and /projects/[slug], which don't render this
 * section at all.
 *
 * No subtext — headline + button only, matching the Hero's standalone,
 * unexplained confidence rather than a headline/subtext/button structure.
 */
export default function CTA() {
  return (
    <section>
      <h2>Have something in mind?</h2>

      <a href="mailto:franklin.yan.sarmiento@gmail.com" data-cursor-hover>
        Let&apos;s Talk.
      </a>
    </section>
  );
}
