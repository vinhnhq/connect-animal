import { BLOG_PREVIEW, COLS, SAMPLE_BOARD, SELECTED, STATS } from "../_data";

// V4 — Tactile Board.
// Subtle inset board with soft shadow, muted dual-tone, crimson restrained to
// a small accent pip. Feels like a quiet, well-made physical board game.

const ACCENT = "#A52A2A";
const LIGHT_BG = "#F5F1EC";
const DARK_BG = "#1A1816";
const SQ_LIGHT = "#E5DDD0";
const SQ_DARK = "#B9A989";

export default function V4() {
  return (
    <div
      className="min-h-screen text-stone-900 dark:text-stone-100"
      style={{ backgroundColor: LIGHT_BG }}
    >
      <style>{`
        @media (prefers-color-scheme: dark) {
          .v4-root { background-color: ${DARK_BG} !important; }
        }
      `}</style>
      <div className="v4-root mx-auto max-w-3xl px-6 py-12">
        <header className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span
                aria-hidden
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: ACCENT }}
              />
              <h1 className="text-lg font-medium tracking-tight">Connect Animal</h1>
            </div>
            <p className="mt-1 text-xs text-stone-500">Solo · Medium board · Easy AI</p>
          </div>

          <dl className="flex items-center gap-6 text-right">
            <Stat label="Time" value={STATS.timeLabel} />
            <Stat label="You" value={String(STATS.human)} />
            <Stat label="AI" value={String(STATS.computer)} />
            <div className="flex items-center gap-2 text-xs">
              <span
                aria-hidden
                className="inline-block h-1.5 w-1.5 animate-pulse rounded-full"
                style={{ backgroundColor: ACCENT }}
              />
              {STATS.ai}
            </div>
          </dl>
        </header>

        <main className="mt-10">
          <div
            className="rounded-2xl p-5"
            style={{
              backgroundColor: "rgba(0,0,0,0.04)",
              boxShadow:
                "inset 0 1px 0 rgba(255,255,255,0.6), inset 0 -1px 0 rgba(0,0,0,0.08), 0 10px 30px -10px rgba(0,0,0,0.15)",
            }}
          >
            <Board />
          </div>

          <div className="mt-6 flex items-center justify-between">
            <p className="text-xs text-stone-500">Click a tile, then a matching tile.</p>
            <div className="flex gap-2 text-sm">
              <button
                type="button"
                className="rounded-md border border-stone-300 bg-white/60 px-3 py-1.5 hover:bg-white dark:border-stone-700 dark:bg-stone-900/40 dark:hover:bg-stone-900"
              >
                Hint
              </button>
              <button
                type="button"
                className="rounded-md border border-stone-300 bg-white/60 px-3 py-1.5 hover:bg-white dark:border-stone-700 dark:bg-stone-900/40 dark:hover:bg-stone-900"
              >
                Shuffle
              </button>
              <button
                type="button"
                className="rounded-md px-3 py-1.5 text-white shadow-sm"
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

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-[10px] uppercase tracking-[0.2em] text-stone-500">{label}</span>
      <span className="font-mono text-base tabular-nums">{value}</span>
    </div>
  );
}

function Board() {
  return (
    <div
      role="grid"
      aria-label="Game board"
      className="overflow-hidden rounded-lg"
      style={{
        boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.08), inset 0 2px 6px rgba(0,0,0,0.18)",
      }}
    >
      <div className="grid" style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)` }}>
        {SAMPLE_BOARD.map((cell) => {
          const isLight = (cell.col + cell.row) % 2 === 0;
          const isSelected = cell.col === SELECTED.col && cell.row === SELECTED.row;
          return (
            <div
              key={`${cell.col}-${cell.row}`}
              role="gridcell"
              className="relative flex aspect-square items-center justify-center text-2xl"
              style={{
                backgroundColor: isLight ? SQ_LIGHT : SQ_DARK,
                boxShadow: isSelected
                  ? `inset 0 0 0 3px ${ACCENT}, inset 0 0 0 5px white`
                  : undefined,
              }}
            >
              <span className="leading-none drop-shadow-sm">{cell.animal}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function BlogTeaser() {
  return (
    <section className="mt-16">
      <p className="text-[10px] uppercase tracking-[0.2em] text-stone-500">Recently</p>
      <h2 className="mt-2 text-xl font-medium tracking-tight">{BLOG_PREVIEW.title}</h2>
      <time className="mt-1 block text-xs text-stone-500">{BLOG_PREVIEW.date}</time>
      <p className="mt-3 max-w-prose text-sm leading-relaxed text-stone-700 dark:text-stone-300">
        {BLOG_PREVIEW.body}
      </p>
    </section>
  );
}
