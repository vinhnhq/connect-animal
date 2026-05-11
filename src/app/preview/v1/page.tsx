import { BLOG_PREVIEW, COLS, SAMPLE_BOARD, SELECTED, STATS } from "../_data";

// V1 — Editorial Swiss.
// Strict grid, hairline rules, label-style stats with small-caps, monospaced
// digits. Crimson appears only on the CTA fill and one accent rule.

const ACCENT = "#C41E3A";

export default function V1() {
  return (
    <div className="min-h-screen bg-white text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
      <div className="mx-auto max-w-3xl px-6 py-12">
        <header className="border-t border-neutral-900 pt-4 dark:border-neutral-100">
          <div className="flex items-baseline justify-between">
            <h1 className="text-lg font-medium tracking-tight">Connect Animal</h1>
            <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-500">
              Solo · Medium · vs. Easy AI
            </span>
          </div>

          <dl className="mt-6 grid grid-cols-3 gap-px border border-neutral-200 bg-neutral-200 dark:border-neutral-800 dark:bg-neutral-800">
            <Stat label="Time" value={STATS.timeLabel} />
            <Stat label="Score" value={`${STATS.human} — ${STATS.computer}`} />
            <Stat label="AI" value={STATS.ai} accent />
          </dl>
        </header>

        <main className="mt-10">
          <Board />
          <div className="mt-6 flex items-center justify-between border-t border-neutral-200 pt-4 dark:border-neutral-800">
            <p className="text-xs text-neutral-500">
              Tap a tile to select. Match pairs along paths with ≤ 2 turns.
            </p>
            <div className="flex gap-2 text-xs">
              <button
                type="button"
                className="border border-neutral-300 px-3 py-1.5 hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-900"
              >
                Hint
              </button>
              <button
                type="button"
                className="border border-neutral-300 px-3 py-1.5 hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-900"
              >
                Shuffle
              </button>
              <button
                type="button"
                className="px-3 py-1.5 text-white"
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
    <div className="flex flex-col bg-white p-4 dark:bg-neutral-950">
      <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-500">{label}</span>
      <span
        className="mt-2 font-mono text-xl tabular-nums"
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
      className="grid border border-neutral-900 dark:border-neutral-100"
      style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)` }}
    >
      {SAMPLE_BOARD.map((cell) => {
        const isLight = (cell.col + cell.row) % 2 === 0;
        const isSelected = cell.col === SELECTED.col && cell.row === SELECTED.row;
        return (
          <div
            key={`${cell.col}-${cell.row}`}
            role="gridcell"
            className="relative flex aspect-square items-center justify-center text-2xl"
            style={{
              backgroundColor: isLight ? "transparent" : "rgb(243 244 246 / 1)",
              outline: isSelected ? `2px solid ${ACCENT}` : undefined,
              outlineOffset: isSelected ? "-2px" : undefined,
            }}
          >
            <span className="leading-none">{cell.animal}</span>
          </div>
        );
      })}
    </div>
  );
}

function BlogTeaser() {
  return (
    <section className="mt-16 border-t border-neutral-200 pt-8 dark:border-neutral-800">
      <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-500">
        From the journal
      </span>
      <h2 className="mt-3 text-xl font-medium tracking-tight">{BLOG_PREVIEW.title}</h2>
      <time className="mt-1 block font-mono text-xs text-neutral-500">{BLOG_PREVIEW.date}</time>
      <p className="mt-4 max-w-prose text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
        {BLOG_PREVIEW.body}
      </p>
      <a
        href="#"
        className="mt-3 inline-block text-xs uppercase tracking-[0.18em]"
        style={{ color: ACCENT }}
      >
        Read →
      </a>
    </section>
  );
}
