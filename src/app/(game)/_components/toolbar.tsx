"use client";

import { findAnyValidPair } from "@/lib/game/hint";
import type { Board } from "@/lib/game/types";

type Props = {
  board: Board;
  onHint: () => void;
  onShuffle: () => void;
  elapsedMs: number;
  humanScore?: number;
  computerScore?: number;
};

export function Toolbar({
  board,
  onHint,
  onShuffle,
  elapsedMs,
  humanScore = 0,
  computerScore = 0,
}: Props) {
  const hasPair = findAnyValidPair(board).isJust();

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 divide-x-[3px] divide-black border-[3px] border-black dark:divide-white dark:border-white">
        <Stat label="Time" value={formatMs(elapsedMs)} />
        <Stat label="You" value={String(humanScore)} />
        <Stat label="AI" value={String(computerScore)} />
      </div>

      <div className="grid grid-cols-2 gap-2 sm:gap-3">
        <ToolButton onClick={onHint} disabled={!hasPair}>
          Hint
        </ToolButton>
        <ToolButton onClick={onShuffle} disabled={hasPair}>
          Shuffle
        </ToolButton>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  const labelId = `stat-${label.toLowerCase()}`;
  return (
    <div className="flex flex-col">
      <span
        id={labelId}
        className="bg-black px-3 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-white dark:bg-white dark:text-black"
      >
        {label}
      </span>
      <output
        aria-labelledby={labelId}
        className="px-3 py-2 font-mono text-xl tabular-nums sm:text-2xl"
      >
        {value}
      </output>
    </div>
  );
}

function ToolButton({
  onClick,
  disabled,
  children,
}: {
  onClick: () => void;
  disabled: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={
        disabled
          ? "border-[3px] border-black/30 bg-white px-4 py-2 text-sm font-medium uppercase tracking-wider text-black/30 dark:border-white/30 dark:bg-black dark:text-white/30"
          : "border-[3px] border-black bg-white px-4 py-2 text-sm font-medium uppercase tracking-wider hover:bg-black hover:text-white dark:border-white dark:bg-black dark:text-white dark:hover:bg-white dark:hover:text-black"
      }
    >
      {children}
    </button>
  );
}

function formatMs(ms: number): string {
  const total = Math.floor(ms / 1000);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}
