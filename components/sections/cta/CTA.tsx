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
    <section className="mx-auto max-w-6xl px-6 py-24 text-center">
      <h2 className="text-3xl font-medium sm:text-4xl">Have something in mind?</h2>

      <a
        href="mailto:franklin.yan.sarmiento@gmail.com"
        data-cursor-hover
        className="mt-8 inline-block rounded-full border border-black/10 px-8 py-3 text-sm font-medium transition-colors hover:bg-black hover:text-white dark:border-white/10 dark:hover:bg-white dark:hover:text-black"
      >
        Let&apos;s Talk.
      </a>
    </section>
  );
}