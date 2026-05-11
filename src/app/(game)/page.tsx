"use client";

import { startTransition, useEffect, useRef, useState } from "react";
import { BoardView } from "@/app/(game)/_components/board";
import { ConfigForm, type ConfigFormHandle } from "@/app/(game)/_components/config-form";
import { PathFlash } from "@/app/(game)/_components/path-flash";
import { useGame } from "@/hooks/use-game";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { findPath } from "@/lib/game/path";
import type { Cell, Config, Path, Position } from "@/lib/game/types";

const INITIAL_CONFIG: Config = {
  boardSize: "medium",
  difficulty: "easy",
  animalSet: "default",
};

export default function GamePage() {
  const game = useGame({ initialConfig: INITIAL_CONFIG });
  const configRef = useRef<ConfigFormHandle | null>(null);
  const reducedMotion = useReducedMotion();
  const [flash, setFlash] = useState<{ path: Path; key: number } | null>(null);

  const isPlaying = game.state.status === "Playing";
  const isTerminal = game.state.status === "Won" || game.state.status === "Lost";

  useEffect(() => {
    if (!flash) return;
    const duration = reducedMotion ? 60 : 340;
    const t = setTimeout(() => setFlash(null), duration);
    return () => clearTimeout(t);
  }, [flash, reducedMotion]);

  function handleStart(config: Config) {
    withViewTransition(() => {
      game.start(config);
    });
  }

  function handleSelect(pos: Position) {
    if (game.state.status !== "Playing") return;
    const prev = game.state.selected;
    if (prev) {
      const a = cellAt(game.state.board.cells, prev);
      const b = cellAt(game.state.board.cells, pos);
      if (a && b && a.animal === b.animal && !(prev.col === pos.col && prev.row === pos.row)) {
        findPath(prev, pos, game.state.board).ifJust((p) => setFlash({ path: p, key: Date.now() }));
      }
    }
    game.select("human", pos);
  }

  return (
    <main className="mx-auto max-w-4xl px-3 py-6 sm:px-4 sm:py-12">
      <header className="border-y-[3px] border-black py-6 dark:border-white">
        <h1 className="text-5xl font-medium uppercase leading-[0.95] tracking-tight sm:text-6xl">
          Connect
          <br />
          <span style={{ color: "#DC143C" }}>Animal</span>
        </h1>
      </header>

      {/*
        React keeps the form state across visibility toggles as long as the
        component stays mounted. `hidden` is the stable-React equivalent of
        the experimental <Activity mode="hidden">. We use the hidden attribute
        rather than removing the node so the user's config persists between
        rounds without re-reading localStorage.
      */}
      <section hidden={isPlaying || isTerminal} className="mt-8">
        <p className="mb-6 text-[10px] font-medium uppercase tracking-[0.2em] text-neutral-500">
          New game
        </p>
        <ConfigForm ref={configRef} onStart={handleStart} />
      </section>

      {isPlaying && game.state.status === "Playing" ? (
        <section className="mt-8 space-y-4">
          <div className="relative">
            <BoardView
              board={game.state.board}
              selected={game.state.selected}
              hint={game.state.hint}
              onSelect={handleSelect}
              onDeselect={() => {
                if (game.state.status === "Playing" && game.state.selected) {
                  game.select("human", game.state.selected);
                }
              }}
            />
            <PathFlash
              key={flash?.key}
              path={flash?.path ?? null}
              cols={game.state.board.cols}
              rows={game.state.board.rows}
              reducedMotion={reducedMotion}
            />
          </div>
        </section>
      ) : null}
    </main>
  );
}

function cellAt(cells: ReadonlyArray<ReadonlyArray<Cell>>, pos: Position): Cell {
  return cells[pos.row]?.[pos.col] ?? null;
}

function withViewTransition(fn: () => void) {
  if (typeof document !== "undefined" && "startViewTransition" in document) {
    type DocWithVT = Document & { startViewTransition: (cb: () => void) => unknown };
    (document as DocWithVT).startViewTransition(() => {
      startTransition(fn);
    });
    return;
  }
  startTransition(fn);
}
