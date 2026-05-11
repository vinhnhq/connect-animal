"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import type { BoardSize, Config, Difficulty } from "@/lib/game/types";

export type PersonalBestsMap = Partial<Record<BoardSize, number | null>>;

export const STORAGE_KEY = "connect-animal:config";

const DEFAULTS: Config = {
  boardSize: "medium",
  difficulty: "easy",
  animalSet: "default",
};

const BOARD_SIZES: ReadonlyArray<{ value: BoardSize; label: string; dims: string }> = [
  { value: "small", label: "Small", dims: "8 × 6" },
  { value: "medium", label: "Medium", dims: "10 × 8" },
  { value: "large", label: "Large", dims: "12 × 10" },
];

const DIFFICULTIES: ReadonlyArray<{ value: Difficulty; label: string }> = [
  { value: "easy", label: "Easy" },
  { value: "medium", label: "Medium" },
  { value: "hard", label: "Hard" },
];

export type ConfigFormHandle = {
  getConfig: () => Config;
};

function load(): Config {
  if (typeof window === "undefined") return DEFAULTS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULTS;
    const parsed = JSON.parse(raw) as Partial<Config>;
    return {
      boardSize: validBoardSize(parsed.boardSize) ?? DEFAULTS.boardSize,
      difficulty: validDifficulty(parsed.difficulty) ?? DEFAULTS.difficulty,
      animalSet: typeof parsed.animalSet === "string" ? parsed.animalSet : DEFAULTS.animalSet,
    };
  } catch {
    return DEFAULTS;
  }
}

function validBoardSize(v: unknown): BoardSize | null {
  return v === "small" || v === "medium" || v === "large" ? v : null;
}

function validDifficulty(v: unknown): Difficulty | null {
  return v === "easy" || v === "medium" || v === "hard" ? v : null;
}

function save(config: Config) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch {
    // Storage might be full or disabled — silently ignore.
  }
}

type Props = {
  onStart: (config: Config) => void;
  personalBests?: PersonalBestsMap;
};

export const ConfigForm = forwardRef<ConfigFormHandle, Props>(function ConfigForm(
  { onStart, personalBests },
  ref,
) {
  const [config, setConfig] = useState<Config>(DEFAULTS);
  const configRef = useRef(config);
  configRef.current = config;

  useEffect(() => {
    setConfig(load());
  }, []);

  useImperativeHandle(ref, () => ({ getConfig: () => configRef.current }), []);

  function update(patch: Partial<Config>) {
    setConfig((prev) => {
      const next = { ...prev, ...patch };
      save(next);
      return next;
    });
  }

  return (
    <form
      className="space-y-8"
      onSubmit={(e) => {
        e.preventDefault();
        onStart(configRef.current);
      }}
    >
      <fieldset>
        <legend className="mb-3 text-[10px] font-medium uppercase tracking-[0.2em]">
          Board size
        </legend>
        <div role="radiogroup" aria-label="Board size" className="grid grid-cols-3 gap-2 sm:gap-3">
          {BOARD_SIZES.map((opt) => {
            const pb = personalBests?.[opt.value];
            const hint = pb && pb > 0 ? `${opt.dims} · ${formatMs(pb)}` : opt.dims;
            return (
              <RadioCard
                key={opt.value}
                name="boardSize"
                value={opt.value}
                checked={config.boardSize === opt.value}
                label={opt.label}
                hint={hint}
                onChange={() => update({ boardSize: opt.value })}
              />
            );
          })}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-3 text-[10px] font-medium uppercase tracking-[0.2em]">
          Difficulty
        </legend>
        <div role="radiogroup" aria-label="Difficulty" className="grid grid-cols-3 gap-2 sm:gap-3">
          {DIFFICULTIES.map((opt) => (
            <RadioCard
              key={opt.value}
              name="difficulty"
              value={opt.value}
              checked={config.difficulty === opt.value}
              label={opt.label}
              onChange={() => update({ difficulty: opt.value })}
            />
          ))}
        </div>
      </fieldset>

      <button
        type="submit"
        className="w-full border-[3px] border-black px-5 py-3 text-sm font-medium uppercase tracking-wider text-white sm:w-auto dark:border-white"
        style={{ backgroundColor: "#DC143C" }}
      >
        ▶ Start
      </button>
    </form>
  );
});

function formatMs(ms: number): string {
  const total = Math.floor(ms / 1000);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function RadioCard({
  name,
  value,
  checked,
  label,
  hint,
  onChange,
}: {
  name: string;
  value: string;
  checked: boolean;
  label: string;
  hint?: string;
  onChange: () => void;
}) {
  const id = `${name}-${value}`;
  return (
    <label
      htmlFor={id}
      className={
        checked
          ? "block cursor-pointer border-[3px] border-black bg-black px-3 py-3 text-white dark:border-white dark:bg-white dark:text-black"
          : "block cursor-pointer border-[3px] border-black bg-white px-3 py-3 hover:bg-black hover:text-white dark:border-white dark:bg-black dark:text-white dark:hover:bg-white dark:hover:text-black"
      }
    >
      <input
        id={id}
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className="sr-only"
        aria-label={label}
      />
      <span className="block text-sm font-medium uppercase tracking-wider">{label}</span>
      {hint ? (
        <span className="mt-1 block font-mono text-[10px] opacity-70 tabular-nums">{hint}</span>
      ) : null}
    </label>
  );
}
