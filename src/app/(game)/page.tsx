"use client";

import { ConfigForm } from "@/app/(game)/_components/config-form";
import type { Config } from "@/lib/game/types";

export default function GamePage() {
  function handleStart(_config: Config) {
    // TODO 3.3+ — wire up to reducer / game screen
  }

  return (
    <main className="mx-auto max-w-2xl px-3 py-6 sm:px-4 sm:py-12">
      <header className="border-y-[3px] border-black py-6 dark:border-white">
        <h1 className="text-5xl font-medium uppercase leading-[0.95] tracking-tight sm:text-6xl">
          Connect
          <br />
          <span style={{ color: "#DC143C" }}>Animal</span>
        </h1>
      </header>

      <section className="mt-8">
        <p className="mb-6 text-[10px] font-medium uppercase tracking-[0.2em] text-neutral-500">
          New game
        </p>
        <ConfigForm onStart={handleStart} />
      </section>
    </main>
  );
}
