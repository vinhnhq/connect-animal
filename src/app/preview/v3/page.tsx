import { BLOG_PREVIEW, COLS, SAMPLE_BOARD, SELECTED, STATS } from "../_data";

// V3 — Brutalist (dialed down). Locked design system. See storybook.
// Mobile-first: scales from 320px up; tiles never drop below ~40px tap target
// on the smallest phones (8 cols × 320 - padding ≈ 36–40 px). Buttons span
// full width on mobile so they remain thumb-reachable.

const ACCENT = "#DC143C";

export default function V3() {
  return (
    <div className="min-h-screen bg-white text-black dark:bg-black dark:text-white">
      <div className="mx-auto max-w-4xl px-3 py-6 sm:px-4 sm:py-8">
        <header className="border-y-[3px] border-black py-4 sm:py-6 dark:border-white">
          <h1 className="text-3xl font-medium uppercase leading-[0.95] tracking-tight sm:text-5xl">
            Connect
            <br />
            <span style={{ color: ACCENT }}>Animal</span>
          </h1>
        </header>

        <section className="mt-4 grid grid-cols-3 divide-x-[3px] divide-black border-x-[3px] border-b-[3px] border-black sm:mt-6 dark:divide-white dark:border-white">
          <Stat label="Time" value={STATS.timeLabel} />
          <Stat label="Score" value={`${STATS.human}-${STATS.computer}`} />
          <Stat label="AI" value={STATS.ai} accent />
        </section>

        <main className="mt-6 sm:mt-8">
          <Board />
          <div className="mt-4 grid grid-cols-2 gap-2 sm:mt-6 sm:flex sm:flex-wrap sm:gap-3">
            <button
              type="button"
              className="border-[3px] border-black bg-white px-4 py-2.5 text-sm font-medium uppercase tracking-wider hover:bg-black hover:text-white sm:px-5 sm:py-2 dark:border-white dark:bg-black dark:hover:bg-white dark:hover:text-black"
            >
              Hint
            </button>
            <button
              type="button"
              className="border-[3px] border-black bg-white px-4 py-2.5 text-sm font-medium uppercase tracking-wider hover:bg-black hover:text-white sm:px-5 sm:py-2 dark:border-white dark:bg-black dark:hover:bg-white dark:hover:text-black"
            >
              Shuffle
            </button>
            <button
              type="button"
              className="col-span-2 border-[3px] border-black px-4 py-2.5 text-sm font-medium uppercase tracking-wider text-white sm:col-span-1 sm:px-5 sm:py-2 dark:border-white"
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
    <div className="flex min-w-0 flex-col">
      <span
        className="px-2 py-1 text-[9px] font-medium uppercase tracking-[0.18em] text-white sm:px-3 sm:text-[10px] sm:tracking-[0.2em]"
        style={{ backgroundColor: accent ? ACCENT : "black" }}
      >
        {label}
      </span>
      <span className="truncate px-2 py-2 font-mono text-base tabular-nums sm:px-3 sm:py-3 sm:text-2xl">
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
            className="relative flex aspect-square items-center justify-center border border-black/30 text-xl sm:text-3xl dark:border-white/30"
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
    <section className="mt-12 border-t-[3px] border-black pt-6 sm:mt-16 dark:border-white">
      <span
        className="inline-block px-2 py-0.5 text-xs font-medium uppercase tracking-[0.2em] text-white"
        style={{ backgroundColor: ACCENT }}
      >
        Posts
      </span>
      <h2 className="mt-3 text-xl font-medium leading-snug tracking-tight sm:text-2xl">
        {BLOG_PREVIEW.title}
      </h2>
      <time className="mt-2 block font-mono text-xs uppercase tracking-[0.18em] text-neutral-500">
        {BLOG_PREVIEW.date}
      </time>
      <p className="mt-4 max-w-prose text-sm leading-relaxed sm:text-base">{BLOG_PREVIEW.body}</p>
    </section>
  );
}
