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
 *
 * Font: `text-display-section` added to the heading below — it had no
 * size/weight class at all before, so despite being a closing headline it
 * was rendering at plain body scale. Matches the scale About's top-level
 * heading now uses, so both major section headings read consistently.
 */
export default function CTA() {
  return (
    <section>
      <h2 className="text-display-section">Have something in mind?</h2>

      <a href="mailto:franklin.yan.sarmiento@gmail.com" data-cursor-hover>
        Let&apos;s Talk.
      </a>
    </section>
  );
}