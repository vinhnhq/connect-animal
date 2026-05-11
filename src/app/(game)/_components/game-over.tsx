"use client";

import type { Lost, Won } from "@/lib/game/types";

type Props = {
  state: Won | Lost;
  onPlayAgain: () => void;
  onChangeSettings: () => void;
};

export function GameOver({ state, onPlayAgain, onChangeSettings }: Props) {
  const isWin = state.status === "Won";
  const winner = isWin ? state.winner : null;
  const heading = !isWin ? "Time's up" : winner === "human" ? "You won" : "Computer won";

  return (
    <section
      aria-labelledby="game-over-title"
      className="mt-8 border-[3px] border-black p-6 sm:p-8 dark:border-white"
    >
      <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-neutral-500">
        Round complete
      </p>
      <h2
        id="game-over-title"
        className="mt-2 text-3xl font-medium uppercase tracking-tight sm:text-4xl"
        style={winner === "human" ? { color: "#DC143C" } : undefined}
      >
        {heading}
      </h2>

      <dl className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
        <Stat label="Time" value={formatMs(state.totalMs)} />
        <Stat label="You" value={String(state.scores.human)} />
        <Stat label="AI" value={String(state.scores.computer)} />
      </dl>

      <div className="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3">
        <button
          type="button"
          onClick={onPlayAgain}
          className="border-[3px] border-black px-4 py-2 text-sm font-medium uppercase tracking-wider text-white dark:border-white"
          style={{ backgroundColor: "#DC143C" }}
        >
          ▶ Play again
        </button>
        <button
          type="button"
          onClick={onChangeSettings}
          className="border-[3px] border-black bg-white px-4 py-2 text-sm font-medium uppercase tracking-wider hover:bg-black hover:text-white dark:border-white dark:bg-black dark:text-white dark:hover:bg-white dark:hover:text-black"
        >
          Change settings
        </button>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[10px] font-medium uppercase tracking-[0.2em] text-neutral-500">
        {label}
      </dt>
      <dd className="mt-1 font-mono text-2xl tabular-nums">{value}</dd>
    </div>
  );
}

function formatMs(ms: number): string {
  const total = Math.floor(ms / 1000);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}
