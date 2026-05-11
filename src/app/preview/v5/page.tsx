import { BLOG_PREVIEW, COLS, SAMPLE_BOARD, SELECTED, STATS } from "../_data";

// V5 — Mono Terminal.
// Monospace everywhere. AI status as a `> prompt` line with blinking caret.
// Crimson is the "error/highlight" terminal color. Very dev-blog.

const ACCENT = "#FF1744";

export default function V5() {
  return (
    <div
      className="min-h-screen bg-white text-neutral-900 dark:bg-[#0B0B0E] dark:text-neutral-200"
      style={{ fontFamily: 'ui-monospace, "JetBrains Mono", "SF Mono", Menlo, monospace' }}
    >
      <style>{`
        @keyframes v5-blink { 0%, 49% { opacity: 1; } 50%, 100% { opacity: 0; } }
        .v5-caret { animation: v5-blink 1s steps(1, end) infinite; }
      `}</style>

      <div className="mx-auto max-w-3xl px-6 py-12">
        <header>
          <p className="text-xs text-neutral-500">$ connect-animal --start</p>
          <h1 className="mt-2 text-2xl tracking-tight">
            <span style={{ color: ACCENT }}>{">"}</span> Connect_Animal
          </h1>
          <div className="mt-6 space-y-1 text-sm leading-relaxed">
            <Line k="time" v={STATS.timeLabel} />
            <Line k="score.human" v={String(STATS.human)} />
            <Line k="score.computer" v={String(STATS.computer)} />
            <Line k="ai.status" v={STATS.ai} accent />
          </div>
        </header>

        <main className="mt-10">
          <p className="mb-3 text-xs text-neutral-500">{"// 8x6 board, 14 pairs remaining"}</p>
          <Board />
          <p className="mt-4 text-xs text-neutral-500">
            <span style={{ color: ACCENT }} className="v5-caret">
              ▍
            </span>{" "}
            select tile · &lt;space&gt; confirm · /hint /shuffle
          </p>

          <div className="mt-4 flex gap-2 text-sm">
            <button
              type="button"
              className="border border-current/30 px-3 py-1 hover:bg-neutral-100 dark:hover:bg-white/5"
            >
              /hint
            </button>
            <button
              type="button"
              className="border border-current/30 px-3 py-1 hover:bg-neutral-100 dark:hover:bg-white/5"
            >
              /shuffle
            </button>
            <button
              type="button"
              className="px-3 py-1 text-white"
              style={{ backgroundColor: ACCENT }}
            >
              /new
            </button>
          </div>
        </main>

        <BlogTeaser />
      </div>
    </div>
  );
}

function Line({ k, v, accent }: { k: string; v: string; accent?: boolean }) {
  return (
    <div className="flex">
      <span className="w-40 text-neutral-500">{k}</span>
      <span className="text-neutral-400">=&nbsp;</span>
      <span style={accent ? { color: ACCENT } : undefined}>{v}</span>
    </div>
  );
}

function Board() {
  return (
    <div
      role="grid"
      aria-label="Game board"
      className="grid border border-neutral-300 dark:border-neutral-800"
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
              backgroundColor: isLight ? "rgba(0,0,0,0.02)" : "rgba(0,0,0,0.06)",
              boxShadow: isSelected ? `inset 0 0 0 2px ${ACCENT}` : undefined,
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
    <section className="mt-16 border-t border-dashed border-neutral-300 pt-6 dark:border-neutral-800">
      <p className="text-xs text-neutral-500">$ cat ./posts/latest.md</p>
      <h2 className="mt-2 text-base">
        <span style={{ color: ACCENT }}>#</span> {BLOG_PREVIEW.title}
      </h2>
      <time className="mt-1 block text-xs text-neutral-500">{`// ${BLOG_PREVIEW.date}`}</time>
      <p className="mt-3 max-w-prose text-sm leading-7 text-neutral-700 dark:text-neutral-400">
        {BLOG_PREVIEW.body}
      </p>
    </section>
  );
}
