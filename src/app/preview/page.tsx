import Link from "next/link";

const VARIANTS = [
  {
    slug: "v1",
    name: "Editorial Swiss",
    blurb: "Strict grid, hairlines, label-style stats, monospaced numerics.",
    accent: "#C41E3A",
  },
  {
    slug: "v2",
    name: "Serif Magazine",
    blurb: "Cream paper, serif display, italic flourishes — print energy.",
    accent: "#7C1D2E",
  },
  {
    slug: "v3",
    name: "Brutalist",
    blurb: "Heavy black borders, big sans, slabs of crimson behind labels.",
    accent: "#DC143C",
  },
  {
    slug: "v4",
    name: "Tactile Board",
    blurb: "Subtle inset board, muted tones, physical-table feel.",
    accent: "#A52A2A",
  },
  {
    slug: "v5",
    name: "Mono Terminal",
    blurb: "Monospace everywhere, > prompt lines, developer-blog vibe.",
    accent: "#FF1744",
  },
  {
    slug: "v6",
    name: "Bold Modern",
    blurb: "Confident Inter, generous spacing, crimson CTAs — SaaS polish.",
    accent: "#DC2626",
  },
];

export default function PreviewIndex() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <header className="mb-12">
        <p className="text-xs uppercase tracking-[0.18em] text-neutral-500">Design previews</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
          Connect Animal — six directions
        </h1>
        <p className="mt-3 max-w-prose text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
          Six interpretations of the same brief: minimal modern, chess-board tile pattern, bold
          crimson primary, stats above the board, light/dark by OS. Each variant also has to host a
          blog later, so the visual system is tested with a sample post at the bottom of every page.
          Pick one to continue with, mix and match, or use as a starting point for a custom
          direction.
        </p>
      </header>

      <ul className="grid gap-3">
        {VARIANTS.map((v) => (
          <li key={v.slug}>
            <Link
              href={`/preview/${v.slug}`}
              className="flex items-center gap-4 rounded-lg border border-neutral-200 p-4 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:hover:border-neutral-700"
            >
              <span
                aria-hidden
                className="h-10 w-10 shrink-0 rounded"
                style={{ backgroundColor: v.accent }}
              />
              <span className="flex-1">
                <span className="block font-medium">
                  {v.slug.toUpperCase()} · {v.name}
                </span>
                <span className="mt-0.5 block text-sm text-neutral-600 dark:text-neutral-400">
                  {v.blurb}
                </span>
              </span>
              <span aria-hidden className="text-neutral-400">
                →
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <footer className="mt-12 border-t border-neutral-200 pt-6 text-sm dark:border-neutral-800">
        <Link
          href="/preview/primitives"
          className="text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100"
        >
          → shadcn primitives smoke test
        </Link>
      </footer>
    </main>
  );
}
