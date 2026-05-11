"use client";

import { startTransition, useRef } from "react";
import { BoardView } from "@/app/(game)/_components/board";
import { ConfigForm, type ConfigFormHandle } from "@/app/(game)/_components/config-form";
import { useGame } from "@/hooks/use-game";
import type { Config } from "@/lib/game/types";

const INITIAL_CONFIG: Config = {
  boardSize: "medium",
  difficulty: "easy",
  animalSet: "default",
};

export default function GamePage() {
  const game = useGame({ initialConfig: INITIAL_CONFIG });
  const configRef = useRef<ConfigFormHandle | null>(null);

  const isPlaying = game.state.status === "Playing";
  const isTerminal = game.state.status === "Won" || game.state.status === "Lost";

  function handleStart(config: Config) {
    withViewTransition(() => {
      game.start(config);
    });
  }

  function handleSelect(pos: { col: number; row: number }) {
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
        </section>
      ) : null}
    </main>
  );
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
