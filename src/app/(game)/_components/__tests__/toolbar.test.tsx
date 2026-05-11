import { describe, expect, test } from "bun:test";
import { fireEvent, render, screen } from "@testing-library/react";
import { Toolbar } from "@/app/(game)/_components/toolbar";
import type { Board, Cell } from "@/lib/game/types";

function boardFromGrid(rows: string[]): Board {
  const cells: Cell[][] = rows.map((row, r) =>
    [...row].map((ch, c) =>
      ch === "." ? null : { id: `${r}-${c}`, position: { col: c, row: r }, animal: ch },
    ),
  );
  return { rows: rows.length, cols: rows[0]?.length ?? 0, cells };
}

// Board with at least one valid pair (A at (0,0) and (2,0) connected via row 0).
const SOLVABLE = boardFromGrid(["A.A", "B.B"]);
// Board where no path exists for any pair (here, all tiles are different).
const NO_PAIRS = boardFromGrid(["AB", "CD"]);

describe("Toolbar", () => {
  test("renders hint and shuffle buttons", () => {
    render(<Toolbar board={SOLVABLE} onHint={() => {}} onShuffle={() => {}} elapsedMs={0} />);
    expect(screen.getByRole("button", { name: /hint/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /shuffle/i })).toBeInTheDocument();
  });

  test("hint is enabled and shuffle disabled when a pair is available", () => {
    render(<Toolbar board={SOLVABLE} onHint={() => {}} onShuffle={() => {}} elapsedMs={0} />);
    expect(screen.getByRole("button", { name: /hint/i })).not.toBeDisabled();
    expect(screen.getByRole("button", { name: /shuffle/i })).toBeDisabled();
  });

  test("shuffle is enabled and hint disabled when no pair exists", () => {
    render(<Toolbar board={NO_PAIRS} onHint={() => {}} onShuffle={() => {}} elapsedMs={0} />);
    expect(screen.getByRole("button", { name: /hint/i })).toBeDisabled();
    expect(screen.getByRole("button", { name: /shuffle/i })).not.toBeDisabled();
  });

  test("clicking hint fires onHint", () => {
    let calls = 0;
    render(
      <Toolbar
        board={SOLVABLE}
        onHint={() => {
          calls += 1;
        }}
        onShuffle={() => {}}
        elapsedMs={0}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: /hint/i }));
    expect(calls).toBe(1);
  });

  test("clicking shuffle fires onShuffle when enabled", () => {
    let calls = 0;
    render(
      <Toolbar
        board={NO_PAIRS}
        onHint={() => {}}
        onShuffle={() => {
          calls += 1;
        }}
        elapsedMs={0}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: /shuffle/i }));
    expect(calls).toBe(1);
  });

  test("renders elapsed time as mm:ss", () => {
    render(<Toolbar board={SOLVABLE} onHint={() => {}} onShuffle={() => {}} elapsedMs={75_000} />);
    expect(screen.getByLabelText(/time/i)).toHaveTextContent("01:15");
  });
});
