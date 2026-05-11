import type { ReactNode } from "react";
import { COLS, SAMPLE_BOARD } from "../_data";

// V3 design system — pieces.
// One page, sticky TOC on the left, sections on the right.

const ACCENT = "#DC143C";

const SECTIONS = [
  {
    id: "foundations",
    label: "Foundations",
    items: [
      { id: "color", label: "Color" },
      { id: "type", label: "Typography" },
      { id: "spacing", label: "Spacing" },
      { id: "borders", label: "Borders" },
    ],
  },
  {
    id: "game",
    label: "Game",
    items: [
      { id: "wordmark", label: "Wordmark" },
      { id: "stats", label: "Stats bar" },
      { id: "buttons", label: "Buttons" },
      { id: "tiles", label: "Tile states" },
      { id: "board", label: "Board" },
    ],
  },
  {
    id: "blog",
    label: "Blog",
    items: [
      { id: "post-header", label: "Post header" },
      { id: "prose", label: "Body prose" },
      { id: "blockquote", label: "Blockquote" },
      { id: "code", label: "Code block" },
      { id: "tag", label: "Tag chip" },
      { id: "post-list", label: "Post list" },
      { id: "pagination", label: "Pagination" },
    ],
  },
  {
    id: "misc",
    label: "Misc",
    items: [
      { id: "status-dot", label: "Status dot" },
      { id: "empty", label: "Empty state" },
    ],
  },
];

export default function Storybook() {
  return (
    <div className="min-h-screen bg-white text-black dark:bg-black dark:text-white">
      <div className="mx-auto grid max-w-6xl grid-cols-[220px_1fr] gap-12 px-6 py-12">
        <Toc />
        <Main />
      </div>
    </div>
  );
}

function Toc() {
  return (
    <aside className="sticky top-12 self-start">
      <p className="border-b-[3px] border-black pb-2 text-[10px] font-medium uppercase tracking-[0.2em] dark:border-white">
        Storybook
      </p>
      <nav className="mt-4 space-y-5 text-sm">
        {SECTIONS.map((sec) => (
          <div key={sec.id}>
            <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-neutral-500">
              {sec.label}
            </p>
            <ul className="mt-2 space-y-1">
              {sec.items.map((it) => (
                <li key={it.id}>
                  <a
                    href={`#${it.id}`}
                    className="block hover:underline"
                    style={{ textDecorationColor: ACCENT, textUnderlineOffset: "4px" }}
                  >
                    {it.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}

function Main() {
  return (
    <main className="space-y-16">
      <header className="border-y-[3px] border-black py-6 dark:border-white">
        <p className="text-[10px] font-medium uppercase tracking-[0.2em]">Design system</p>
        <h1 className="mt-2 text-4xl font-medium tracking-tight">
          Connect Animal — <span style={{ color: ACCENT }}>V3 stories</span>
        </h1>
        <p className="mt-3 max-w-prose text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
          The pieces of the V3 design language in isolation, so we can decide what to keep, what to
          tune, and how it will translate to the blog. Same tokens as <code>/preview/v3</code>:
          black/white structure, 3px borders, crimson accent, medium-weight type.
        </p>
      </header>

      <Foundations />
      <Game />
      <Blog />
      <Misc />

      <footer className="border-t-[3px] border-black pt-4 text-xs text-neutral-500 dark:border-white">
        End of storybook · scroll up to revisit
      </footer>
    </main>
  );
}

/* ------------------------------ FOUNDATIONS ------------------------------ */

function Foundations() {
  return (
    <Section
      id="foundations"
      label="Foundations"
      title="Tokens the rest of the system is built from."
    >
      <Story id="color" label="Color">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <Swatch name="ink" hex="#000000" />
          <Swatch name="paper" hex="#FFFFFF" border />
          <Swatch name="crimson" hex={ACCENT} />
          <Swatch name="neutral-500" hex="#737373" />
        </div>
        <Note>
          Crimson is the single accent. Used on the wordmark fragment, primary CTA, label chips
          (replacing black), and on the prose underline. Never on body text.
        </Note>
      </Story>

      <Story id="type" label="Typography">
        <div className="space-y-4">
          <TypeRow
            label="Display · 5xl medium"
            sample="Connect Animal"
            className="text-5xl font-medium tracking-tight"
          />
          <TypeRow
            label="H1 · 3xl medium"
            sample="A post about pure cores"
            className="text-3xl font-medium tracking-tight"
          />
          <TypeRow
            label="H2 · xl medium"
            sample="A subsection title"
            className="text-xl font-medium tracking-tight"
          />
          <TypeRow
            label="Body · base normal"
            sample="The game logic for Connect Animal lives in pure modules."
            className="text-base leading-relaxed"
          />
          <TypeRow
            label="Mono · base tabular"
            sample="02:14 — 3 to 1"
            className="font-mono text-base tabular-nums"
          />
          <TypeRow
            label="Label · 10px uppercase"
            sample="From the journal"
            className="text-[10px] font-medium uppercase tracking-[0.2em]"
          />
        </div>
      </Story>

      <Story id="spacing" label="Spacing scale">
        <div className="flex flex-wrap items-end gap-2">
          {[4, 8, 12, 16, 24, 32, 48, 64].map((px) => (
            <div key={px} className="flex flex-col items-center">
              <div
                className="border border-black dark:border-white"
                style={{ width: px, height: px, backgroundColor: ACCENT }}
              />
              <span className="mt-1 font-mono text-[10px]">{px}</span>
            </div>
          ))}
        </div>
        <Note>
          Spacing follows Tailwind&apos;s 4-px scale. Use 12/16 inside cards, 24/32 between
          sections, 48/64 between page regions.
        </Note>
      </Story>

      <Story id="borders" label="Borders">
        <div className="grid grid-cols-3 gap-4">
          <BorderSample width={1} />
          <BorderSample width={2} />
          <BorderSample width={3} />
        </div>
        <Note>
          1px for dividers inside a card, 2px for tile selection rings, 3px for page architecture
          (top/bottom rules, board frame, button strokes). Never 4+.
        </Note>
      </Story>
    </Section>
  );
}

function Swatch({ name, hex, border }: { name: string; hex: string; border?: boolean }) {
  return (
    <div>
      <div
        className={`h-20 w-full ${border ? "border-[3px] border-black dark:border-white" : ""}`}
        style={{ backgroundColor: hex }}
      />
      <p className="mt-2 font-mono text-xs">{name}</p>
      <p className="font-mono text-[10px] text-neutral-500">{hex}</p>
    </div>
  );
}

function TypeRow({
  label,
  sample,
  className,
}: {
  label: string;
  sample: string;
  className: string;
}) {
  return (
    <div className="grid grid-cols-[180px_1fr] items-baseline gap-6 border-b border-black/10 pb-3 dark:border-white/10">
      <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-neutral-500">
        {label}
      </span>
      <span className={className}>{sample}</span>
    </div>
  );
}

function BorderSample({ width }: { width: number }) {
  return (
    <div
      className="flex h-20 items-center justify-center border-black dark:border-white"
      style={{ borderWidth: width }}
    >
      <span className="font-mono text-xs">{width}px</span>
    </div>
  );
}

/* --------------------------------- GAME --------------------------------- */

function Game() {
  return (
    <Section id="game" label="Game" title="Surfaces that show up on the play screen.">
      <Story id="wordmark" label="Wordmark">
        <div className="border-y-[3px] border-black py-6 dark:border-white">
          <h2 className="text-5xl font-medium uppercase leading-[0.95] tracking-tight">
            Connect
            <br />
            <span style={{ color: ACCENT }}>Animal</span>
          </h2>
        </div>
        <Note>Two-line, structural top/bottom rule, single crimson fragment.</Note>
      </Story>

      <Story id="stats" label="Stats bar">
        <div className="grid grid-cols-3 divide-x-[3px] divide-black border-[3px] border-black dark:divide-white dark:border-white">
          <Stat label="Time" value="02:14" />
          <Stat label="Score" value="3-1" />
          <Stat label="AI" value="Thinking…" accent />
        </div>
      </Story>

      <Story id="buttons" label="Buttons">
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            className="border-[3px] border-black bg-white px-5 py-2 text-sm font-medium uppercase tracking-wider hover:bg-black hover:text-white dark:border-white dark:bg-black dark:hover:bg-white dark:hover:text-black"
          >
            Default
          </button>
          <button
            type="button"
            className="border-[3px] border-black bg-black px-5 py-2 text-sm font-medium uppercase tracking-wider text-white dark:border-white dark:bg-white dark:text-black"
          >
            Inverted
          </button>
          <button
            type="button"
            className="border-[3px] border-black px-5 py-2 text-sm font-medium uppercase tracking-wider text-white dark:border-white"
            style={{ backgroundColor: ACCENT }}
          >
            ▶ Primary
          </button>
          <button
            type="button"
            disabled
            className="border-[3px] border-black/30 bg-white px-5 py-2 text-sm font-medium uppercase tracking-wider text-black/30 dark:border-white/30 dark:bg-black dark:text-white/30"
          >
            Disabled
          </button>
        </div>
        <Note>
          Primary is crimson + black stroke. Default/inverted are the workhorse pair. Disabled drops
          opacity on the stroke and text.
        </Note>
      </Story>

      <Story id="tiles" label="Tile states">
        <div className="grid grid-cols-5 gap-3">
          <TileSample label="Empty" empty />
          <TileSample label="Light" animal="🐱" />
          <TileSample label="Dark" animal="🐶" dark />
          <TileSample label="Selected" animal="🦊" selected />
          <TileSample label="Hinted" animal="🐼" hinted />
        </div>
      </Story>

      <Story id="board" label="Board (8×6)">
        <div
          className="grid border-[3px] border-black dark:border-white"
          style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)` }}
        >
          {SAMPLE_BOARD.map((cell) => {
            const isLight = (cell.col + cell.row) % 2 === 0;
            return (
              <div
                key={`${cell.col}-${cell.row}`}
                className="relative flex aspect-square items-center justify-center border border-black/30 text-2xl dark:border-white/30"
                style={{
                  backgroundColor: isLight ? "#FFFFFF" : "#000000",
                  color: isLight ? "#000" : "#FFF",
                }}
              >
                <span className="leading-none">{cell.animal}</span>
              </div>
            );
          })}
        </div>
        <Note>
          Pure black/white chess pattern, 1px internal seams keep tiles distinct without competing
          with the 3px outer frame.
        </Note>
      </Story>
    </Section>
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

function TileSample({
  label,
  animal,
  empty,
  dark,
  selected,
  hinted,
}: {
  label: string;
  animal?: string;
  empty?: boolean;
  dark?: boolean;
  selected?: boolean;
  hinted?: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="relative flex aspect-square w-full items-center justify-center border border-black/30 text-2xl dark:border-white/30"
        style={{
          backgroundColor: empty ? "#F4F4F4" : dark ? "#000" : "#FFF",
          color: dark ? "#FFF" : "#000",
          boxShadow: selected
            ? `inset 0 0 0 3px ${ACCENT}`
            : hinted
              ? `inset 0 0 0 3px #000, inset 0 0 0 5px ${ACCENT}`
              : undefined,
        }}
      >
        <span className="leading-none">{animal ?? ""}</span>
      </div>
      <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-neutral-500">
        {label}
      </span>
    </div>
  );
}

/* --------------------------------- BLOG --------------------------------- */

function Blog() {
  return (
    <Section id="blog" label="Blog" title="The same system, tuned for reading.">
      <Story id="post-header" label="Post header">
        <article className="border-b-[3px] border-black pb-6 dark:border-white">
          <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-neutral-500">
            Essay · 8 min
          </p>
          <h1 className="mt-3 text-4xl font-medium leading-tight tracking-tight">
            Why functional cores make games portable
          </h1>
          <p className="mt-3 text-sm text-neutral-500">May 11, 2026 · Vinh Nguyen</p>
        </article>
      </Story>

      <Story id="prose" label="Body prose">
        <div className="max-w-[65ch] space-y-5 text-base leading-relaxed">
          <p>
            The game logic for Connect Animal lives in pure modules — no React, no DOM, no clock.
            Same code that runs your tiles will run the v2 multiplayer server. Here&apos;s how the
            boundary stays honest, even under deadline pressure.
          </p>
          <p>
            Every time I&apos;ve let UI imports leak into game logic, the test suite started lying
            and the server port became a rewrite. The fix isn&apos;t discipline — it&apos;s a{" "}
            <a
              href="#"
              className="font-medium underline underline-offset-[3px]"
              style={{ textDecorationColor: ACCENT }}
            >
              lint rule
            </a>{" "}
            that fails the build before code review.
          </p>
          <p>Two boundaries, enforced by tooling, do most of the work. The rest is taste.</p>
        </div>
        <Note>
          Body is 65ch wide, base size, leading-relaxed, font-normal. The single accent is an
          underline color on inline links.
        </Note>
      </Story>

      <Story id="blockquote" label="Blockquote">
        <blockquote className="border-l-[3px] border-black pl-5 dark:border-white">
          <p className="text-lg italic leading-relaxed">
            &ldquo;If the same module can&apos;t run on the server tomorrow, it isn&apos;t portable
            today.&rdquo;
          </p>
          <footer className="mt-2 text-xs uppercase tracking-[0.18em] text-neutral-500">
            — Old colleague, paraphrased
          </footer>
        </blockquote>
      </Story>

      <Story id="code" label="Code block">
        <pre className="overflow-x-auto border-[3px] border-black bg-neutral-50 p-4 font-mono text-sm leading-relaxed dark:border-white dark:bg-neutral-900">
          <code>
            <span className="text-neutral-500">{"// src/lib/game/path.ts"}</span>
            {"\n"}
            <span style={{ color: ACCENT }}>export function</span> findPath(
            {"\n"} from: Position,
            {"\n"} to: Position,
            {"\n"} board: Board,
            {"\n"}): Maybe&lt;Path&gt; {"{"}
            {"\n"} {/* ... */}
            {"\n"}
            {"}"}
          </code>
        </pre>
        <Note>
          3px frame around code, off-white fill in light mode to separate from prose without adding
          another color.
        </Note>
      </Story>

      <Story id="tag" label="Tag chip">
        <div className="flex flex-wrap gap-2">
          {["typescript", "games", "architecture", "tdd"].map((t, i) => (
            <span
              key={t}
              className="px-2 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-white"
              style={{ backgroundColor: i === 0 ? ACCENT : "black" }}
            >
              {t}
            </span>
          ))}
        </div>
        <Note>
          First tag (active / current category) gets crimson; others use ink. Same chip style as the
          game&apos;s stat labels — one system, two contexts.
        </Note>
      </Story>

      <Story id="post-list" label="Post list">
        <ul className="divide-y-[3px] divide-black border-y-[3px] border-black dark:divide-white dark:border-white">
          {[
            {
              title: "Why functional cores make games portable",
              date: "May 11, 2026",
              tag: "architecture",
            },
            { title: "What I changed about my TDD loop", date: "April 22, 2026", tag: "tdd" },
            {
              title: "On choosing a runner: bun vs. node + vitest",
              date: "March 30, 2026",
              tag: "tooling",
            },
          ].map((p) => (
            <li key={p.title} className="grid grid-cols-[1fr_auto] items-baseline gap-6 py-4">
              <a
                href="#"
                className="text-lg font-medium tracking-tight hover:underline"
                style={{ textDecorationColor: ACCENT, textUnderlineOffset: "4px" }}
              >
                {p.title}
              </a>
              <div className="flex items-baseline gap-3">
                <span className="text-xs text-neutral-500">{p.date}</span>
                <span
                  className="px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.2em] text-white"
                  style={{ backgroundColor: "black" }}
                >
                  {p.tag}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </Story>

      <Story id="pagination" label="Pagination">
        <div className="flex items-center justify-between border-t-[3px] border-black pt-4 dark:border-white">
          <a
            href="#"
            className="text-sm font-medium uppercase tracking-wider hover:underline"
            style={{ textDecorationColor: ACCENT }}
          >
            ← Older
          </a>
          <span className="font-mono text-xs text-neutral-500">Page 1 / 4</span>
          <a
            href="#"
            className="text-sm font-medium uppercase tracking-wider hover:underline"
            style={{ textDecorationColor: ACCENT }}
          >
            Newer →
          </a>
        </div>
      </Story>
    </Section>
  );
}

/* --------------------------------- MISC --------------------------------- */

function Misc() {
  return (
    <Section id="misc" label="Misc" title="Small bits the rest of the page needs.">
      <Story id="status-dot" label="Status dot">
        <div className="flex flex-wrap items-center gap-6 text-sm">
          <span className="flex items-center gap-2">
            <span
              aria-hidden
              className="h-1.5 w-1.5 animate-pulse rounded-full"
              style={{ backgroundColor: ACCENT }}
            />
            Live · AI thinking
          </span>
          <span className="flex items-center gap-2">
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-black dark:bg-white" />
            Idle
          </span>
          <span className="flex items-center gap-2">
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-neutral-400" />
            Disabled
          </span>
        </div>
      </Story>

      <Story id="empty" label="Empty state">
        <div className="border-[3px] border-dashed border-black p-8 text-center dark:border-white">
          <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-neutral-500">
            No posts yet
          </p>
          <p className="mt-2 text-base">
            Start writing — the chip above flips to live as soon as one ships.
          </p>
        </div>
      </Story>
    </Section>
  );
}

/* ------------------------------ SHARED SHELL ------------------------------ */

function Section({
  id,
  label,
  title,
  children,
}: {
  id: string;
  label: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-8 space-y-8">
      <div className="border-t-[3px] border-black pt-4 dark:border-white">
        <p className="text-[10px] font-medium uppercase tracking-[0.2em]">{label}</p>
        <h2 className="mt-1 text-2xl font-medium tracking-tight">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function Story({ id, label, children }: { id: string; label: string; children: ReactNode }) {
  return (
    <article id={id} className="scroll-mt-8 space-y-3">
      <header className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.2em] text-neutral-500">
        <span aria-hidden className="inline-block h-1 w-3" style={{ backgroundColor: ACCENT }} />
        {label}
      </header>
      <div className="border border-black/15 p-6 dark:border-white/15">{children}</div>
    </article>
  );
}

function Note({ children }: { children: ReactNode }) {
  return (
    <p className="mt-3 max-w-prose text-xs text-neutral-600 dark:text-neutral-400">{children}</p>
  );
}
