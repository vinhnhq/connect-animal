import { BLOG_PREVIEW, COLS, SAMPLE_BOARD, SELECTED, STATS } from "../_data";

// V2 — Serif Magazine.
// Warm cream paper, serif display headings, italic flourishes, stats as a
// box-score. Crimson is a deep wine tone used sparingly.

const ACCENT = "#7C1D2E";
const PAPER_LIGHT = "#FAF5EE";
const PAPER_DARK = "#1B1714";

export default function V2() {
  return (
    <div
      className="min-h-screen text-stone-900 dark:text-stone-100"
      style={
        {
          backgroundColor: PAPER_LIGHT,
          "--paper-dark": PAPER_DARK,
        } as React.CSSProperties
      }
    >
      <div
        className="mx-auto max-w-3xl px-6 py-12"
        style={{ fontFamily: '"Iowan Old Style", "Apple Garamond", Georgia, serif' }}
      >
        <header className="text-center">
          <p
            className="text-[10px] uppercase tracking-[0.3em] text-stone-500"
            style={{ fontFamily: "system-ui, sans-serif" }}
          >
            Volume I · No. 1
          </p>
          <h1 className="mt-3 text-5xl font-normal italic" style={{ color: ACCENT }}>
            Connect Animal
          </h1>
          <p className="mt-2 text-sm italic text-stone-600 dark:text-stone-400">
            a small game of paths & patience
          </p>
          <div className="mx-auto mt-6 h-px w-24 bg-stone-300" />
        </header>

        <section
          className="mt-8 flex justify-center divide-x divide-stone-300 text-center dark:divide-stone-700"
          style={{ fontFamily: "system-ui, sans-serif" }}
        >
          <Stat label="Time" value={STATS.timeLabel} />
          <Stat label="Player" value={String(STATS.human)} />
          <Stat label="Machine" value={String(STATS.computer)} />
          <Stat label="AI" value={STATS.ai} accent />
        </section>

        <main className="mt-10">
          <Board />
          <p className="mt-6 text-center text-xs italic text-stone-600 dark:text-stone-400">
            Match a pair connected by no more than two turns.
          </p>
          <div
            className="mt-4 flex items-center justify-center gap-3 text-sm"
            style={{ fontFamily: "system-ui, sans-serif" }}
          >
            <button
              type="button"
              className="border border-stone-400 px-4 py-1.5 italic hover:bg-stone-200 dark:hover:bg-stone-800"
            >
              Hint
            </button>
            <button
              type="button"
              className="border border-stone-400 px-4 py-1.5 italic hover:bg-stone-200 dark:hover:bg-stone-800"
            >
              Shuffle
            </button>
            <button
              type="button"
              className="px-4 py-1.5 text-stone-50"
              style={{ backgroundColor: ACCENT }}
            >
              New game
            </button>
          </div>
        </main>

        <BlogTeaser />
      </div>
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="px-6">
      <div className="text-[10px] uppercase tracking-[0.2em] text-stone-500">{label}</div>
      <div
        className="mt-1 text-lg tabular-nums"
        style={
          accent
            ? { color: ACCENT, fontStyle: "italic" }
            : { fontFamily: '"Iowan Old Style", Georgia, serif' }
        }
      >
        {value}
      </div>
    </div>
  );
}

function Board() {
  return (
    <div
      role="grid"
      aria-label="Game board"
      className="overflow-hidden rounded-sm shadow-[0_1px_0_rgba(0,0,0,0.08),0_8px_24px_rgba(91,38,38,0.08)]"
    >
      <div className="grid" style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)` }}>
        {SAMPLE_BOARD.map((cell) => {
          const isLight = (cell.col + cell.row) % 2 === 0;
          const isSelected = cell.col === SELECTED.col && cell.row === SELECTED.row;
          return (
            <div
              key={`${cell.col}-${cell.row}`}
              role="gridcell"
              className="flex aspect-square items-center justify-center text-2xl"
              style={{
                backgroundColor: isLight ? "#F4ECDF" : "#E8DCC4",
                boxShadow: isSelected ? `inset 0 0 0 3px ${ACCENT}` : undefined,
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
    <section className="mt-16 border-t border-stone-300 pt-8 text-center dark:border-stone-700">
      <p
        className="text-[10px] uppercase tracking-[0.3em] text-stone-500"
        style={{ fontFamily: "system-ui, sans-serif" }}
      >
        From the editor
      </p>
      <h2 className="mt-3 text-2xl italic" style={{ color: ACCENT }}>
        {BLOG_PREVIEW.title}
      </h2>
      <time
        className="mt-1 block text-xs uppercase tracking-[0.18em] text-stone-500"
        style={{ fontFamily: "system-ui, sans-serif" }}
      >
        {BLOG_PREVIEW.date}
      </time>
      <p className="mx-auto mt-5 max-w-prose text-base leading-7 text-stone-700 first-letter:float-left first-letter:mr-2 first-letter:text-4xl first-letter:font-medium first-letter:italic dark:text-stone-300">
        {BLOG_PREVIEW.body}
      </p>
    </section>
  );
}
