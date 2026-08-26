//file path: components/sections/hero/Hero.tsx

/**
 * Renders the home page's hero section: a placeholder headline and subhead.
 * Static markup only — no entrance reveal added. The Backbone Build Plan's
 * non-goals scope out "new GSAP effects beyond reusing the pattern already
 * established in ProjectGrid," and a hero-specific reveal would be a new
 * effect, not a reuse of that pattern, so it's left out rather than guessed
 * at. Flag if you want a matching gsap.matchMedia()-gated reveal added here.
 */
export default function Hero() {
  return (
    <section className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-24 sm:py-32">
      <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
        [placeholder headline]
      </h1>
      <p className="max-w-xl text-lg text-black/60 dark:text-white/60">
        [placeholder subhead]
      </p>
    </section>
  );
}