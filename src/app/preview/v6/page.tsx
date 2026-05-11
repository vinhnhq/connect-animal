import { BLOG_PREVIEW, COLS, SAMPLE_BOARD, SELECTED, STATS } from "../_data";

// V6 — Bold Modern.
// Confident SaaS polish: large display title, generous spacing, near-invisible
// chess pattern, crimson reserved for primary number and CTA. Linear/Vercel
// energy. Light by default with a warm neutral palette.

const ACCENT = "#DC2626";

export default function V6() {
  return (
    <div className="min-h-screen bg-[#FAFAF9] text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
      <div className="mx-auto max-w-4xl px-6 py-16">
        <header className="flex items-end justify-between gap-8">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-500">
              In progress
            </p>
            <h1 className="mt-2 text-4xl font-semibold tracking-tight">Connect Animal</h1>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
              Medium · Easy AI · 14 pairs remaining
            </p>
          </div>

          <div className="flex items-end gap-8">
            <Stat label="Time" value={STATS.timeLabel} />
            <Stat label="You" value={String(STATS.human)} accent />
            <Stat label="AI" value={String(STATS.computer)} />
          </div>
        </header>

        <div className="mt-4 flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
          <span
            aria-hidden
            className="inline-block h-1.5 w-1.5 animate-pulse rounded-full"
            style={{ backgroundColor: ACCENT }}
          />
          <span>{STATS.ai}</span>
        </div>

        <main className="mt-10">
          <Board />
          <div className="mt-6 flex items-center justify-between">
            <p className="text-sm text-neutral-500">
              Tap two matching tiles connected by a ≤ 2-turn path.
            </p>
            <div className="flex items-center gap-2 text-sm">
              <button
                type="button"
                className="rounded-md border border-neutral-200 bg-white px-3.5 py-1.5 font-medium shadow-sm transition-colors hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:bg-neutral-800"
              >
                Hint
              </button>
              <button
                type="button"
                className="rounded-md border border-neutral-200 bg-white px-3.5 py-1.5 font-medium shadow-sm transition-colors hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:bg-neutral-800"
              >
                Shuffle
              </button>
              <button
                type="button"
                className="rounded-md px-3.5 py-1.5 font-medium text-white shadow-sm transition-transform hover:scale-[1.02]"
                style={{ backgroundColor: ACCENT }}
              >
                New game
              </button>
            </div>
          </div>
        </main>

        <BlogTeaser />
      </div>
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex flex-col items-end">
      <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-neutral-500">
        {label}
      </span>
      <span
        className="mt-1 text-3xl font-semibold tabular-nums"
        style={accent ? { color: ACCENT } : undefined}
      >
        {value}
      </span>
    </div>
  );
}

function Board() {
  return (
    <div
      role="grid"
      aria-label="Game board"
      className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
    >
      <div className="grid" style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)` }}>
        {SAMPLE_BOARD.map((cell) => {
          const isLight = (cell.col + cell.row) % 2 === 0;
          const isSelected = cell.col === SELECTED.col && cell.row === SELECTED.row;
          return (
            <div
              key={`${cell.col}-${cell.row}`}
              role="gridcell"
              className="relative flex aspect-square items-center justify-center text-2xl transition-transform hover:scale-105"
              style={{
                backgroundColor: isLight ? "transparent" : "rgba(0,0,0,0.025)",
                boxShadow: isSelected ? `inset 0 0 0 2.5px ${ACCENT}` : undefined,
              }}
            >
              <span className="leading-none">{cell.animal}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function BlogTeaser() {
  return (
    <section className="mt-20 grid grid-cols-[auto_1fr] items-baseline gap-x-6 gap-y-2 border-t border-neutral-200 pt-10 dark:border-neutral-800">
      <p className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-500">Writing</p>
      <div>
        <h2 className="text-xl font-semibold tracking-tight">{BLOG_PREVIEW.title}</h2>
        <time className="mt-1 block text-xs text-neutral-500">{BLOG_PREVIEW.date}</time>
        <p className="mt-3 max-w-prose text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
          {BLOG_PREVIEW.body}
        </p>
        <a href="#" className="mt-3 inline-block text-sm font-medium" style={{ color: ACCENT }}>
          Read post →
        </a>
      </div>
    </section>
  );
}
