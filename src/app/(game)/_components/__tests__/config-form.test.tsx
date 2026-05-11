import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { fireEvent, render, screen, within } from "@testing-library/react";
import {
  ConfigForm,
  type ConfigFormHandle,
  STORAGE_KEY,
} from "@/app/(game)/_components/config-form";
import type { Config } from "@/lib/game/types";

function boardRadio(name: RegExp) {
  const group = screen.getByRole("radiogroup", { name: /board size/i });
  return within(group).getByRole("radio", { name }) as HTMLInputElement;
}

function difficultyRadio(name: RegExp) {
  const group = screen.getByRole("radiogroup", { name: /difficulty/i });
  return within(group).getByRole("radio", { name }) as HTMLInputElement;
}

const DEFAULT_CONFIG: Config = {
  boardSize: "medium",
  difficulty: "easy",
  animalSet: "default",
};

function noopStart(_config: Config) {}

beforeEach(() => {
  localStorage.clear();
});

afterEach(() => {
  localStorage.clear();
});

describe("ConfigForm", () => {
  test("renders three controls: board size, difficulty, start", () => {
    render(<ConfigForm onStart={noopStart} />);
    expect(screen.getByRole("radiogroup", { name: /board size/i })).toBeInTheDocument();
    expect(screen.getByRole("radiogroup", { name: /difficulty/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /start/i })).toBeInTheDocument();
  });

  test("defaults to medium / easy when no localStorage entry exists", () => {
    render(<ConfigForm onStart={noopStart} />);
    expect(boardRadio(/medium/i).checked).toBe(true);
    expect(difficultyRadio(/easy/i).checked).toBe(true);
  });

  test("loads defaults from localStorage on mount", () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        boardSize: "large",
        difficulty: "hard",
        animalSet: "default",
      } satisfies Config),
    );
    render(<ConfigForm onStart={noopStart} />);
    expect(boardRadio(/large/i).checked).toBe(true);
    expect(difficultyRadio(/hard/i).checked).toBe(true);
  });

  test("persists changes to localStorage", () => {
    render(<ConfigForm onStart={noopStart} />);
    fireEvent.click(boardRadio(/small/i));
    fireEvent.click(difficultyRadio(/hard/i));
    const raw = localStorage.getItem(STORAGE_KEY);
    expect(raw).not.toBeNull();
    const parsed = JSON.parse(raw ?? "{}");
    expect(parsed.boardSize).toBe("small");
    expect(parsed.difficulty).toBe("hard");
  });

  test("ignores corrupt localStorage entries and falls back to defaults", () => {
    localStorage.setItem(STORAGE_KEY, "not-json{");
    render(<ConfigForm onStart={noopStart} />);
    expect(boardRadio(/medium/i).checked).toBe(true);
    expect(difficultyRadio(/easy/i).checked).toBe(true);
  });

  test("invokes onStart with the current config when Start is pressed", () => {
    const captured: { value: Config | null } = { value: null };
    render(
      <ConfigForm
        onStart={(c) => {
          captured.value = c;
        }}
      />,
    );
    fireEvent.click(boardRadio(/small/i));
    fireEvent.click(difficultyRadio(/hard/i));
    fireEvent.click(screen.getByRole("button", { name: /start/i }));
    expect(captured.value).toEqual({
      boardSize: "small",
      difficulty: "hard",
      animalSet: "default",
    } satisfies Config);
  });

  test("DEFAULT_CONFIG sanity", () => {
    const exported: Config = DEFAULT_CONFIG;
    expect(exported.animalSet).toBe("default");
  });

  test("imperative handle exposes current config", () => {
    const ref = { current: null as ConfigFormHandle | null };
    render(<ConfigForm ref={ref} onStart={noopStart} />);
    fireEvent.click(boardRadio(/large/i));
    expect(ref.current?.getConfig().boardSize).toBe("large");
  });
});
