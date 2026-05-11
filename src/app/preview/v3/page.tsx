import { BLOG_PREVIEW, COLS, SAMPLE_BOARD, SELECTED, STATS } from "../_data";

// V3 — Brutalist.
// Thick black borders, big chunky type, crimson blocks behind labels.
// Slightly off-grid so it feels human, not generated.

const ACCENT = "#DC143C";

export default function V3() {
  return (
    <div className="min-h-screen bg-white text-black dark:bg-black dark:text-white">
      <div className="mx-auto max-w-4xl px-4 py-8">
        <header className="border-y-[3px] border-black py-6 dark:border-white">
          <h1 className="text-5xl font-medium uppercase leading-[0.95] tracking-tight">
            Connect
            <br />
            <span style={{ color: ACCENT }}>Animal</span>
          </h1>
        </header>

        <section className="mt-6 grid grid-cols-[1fr_1fr_1fr] divide-x-[3px] divide-black border-x-[3px] border-b-[3px] border-black dark:divide-white dark:border-white">
          <Stat label="Time" value={STATS.timeLabel} />
          <Stat label="Score" value={`${STATS.human}-${STATS.computer}`} />
          <Stat label="AI" value={STATS.ai} accent />
        </section>

        <main className="mt-8">
          <Board />
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              type="button"
              className="border-[3px] border-black bg-white px-5 py-2 text-sm font-medium uppercase tracking-wider hover:bg-black hover:text-white dark:border-white dark:bg-black dark:hover:bg-white dark:hover:text-black"
            >
              Hint
            </button>
            <button
              type="button"
              className="border-[3px] border-black bg-white px-5 py-2 text-sm font-medium uppercase tracking-wider hover:bg-black hover:text-white dark:border-white dark:bg-black dark:hover:bg-white dark:hover:text-black"
            >
              Shuffle
            </button>
            <button
              type="button"
              className="border-[3px] border-black px-5 py-2 text-sm font-medium uppercase tracking-wider text-white dark:border-white"
              style={{ backgroundColor: ACCENT }}
            >
              ▶ New game
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
    <div className="flex flex-col">
      <span
        className="px-3 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-white"
        style={{ backgroundColor: accent ? ACCENT : "black" }}
      >
        {label}
      </span>
      <span className="px-3 py-3 font-mono text-2xl tabular-nums">{value}</span>
    </div>
  );
}

function Board() {
  return (
    <div
      role="grid"
      aria-label="Game board"
      className="grid border-[3px] border-black dark:border-white"
      style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)` }}
    >
      {SAMPLE_BOARD.map((cell) => {
        const isLight = (cell.col + cell.row) % 2 === 0;
        const isSelected = cell.col === SELECTED.col && cell.row === SELECTED.row;
        return (
          <div
            key={`${cell.col}-${cell.row}`}
            role="gridcell"
            className="relative flex aspect-square items-center justify-center border border-black/30 text-3xl dark:border-white/30"
            style={{
              backgroundColor: isSelected ? ACCENT : isLight ? "#FFFFFF" : "#000000",
              color: isLight && !isSelected ? "#000" : "#FFF",
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
    <section className="mt-16 border-t-[3px] border-black pt-6 dark:border-white">
      <span
        className="inline-block px-2 py-0.5 text-xs font-medium uppercase tracking-[0.2em] text-white"
        style={{ backgroundColor: ACCENT }}
      >
        Posts
      </span>
      <h2 className="mt-3 text-2xl font-medium leading-snug tracking-tight">
        {BLOG_PREVIEW.title}
      </h2>
      <time className="mt-2 block font-mono text-xs uppercase tracking-[0.18em] text-neutral-500">
        {BLOG_PREVIEW.date}
      </time>
      <p className="mt-4 max-w-prose text-base leading-relaxed">{BLOG_PREVIEW.body}</p>
    </section>
  );
}
