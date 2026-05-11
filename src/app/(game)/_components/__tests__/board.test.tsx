import { describe, expect, test } from "bun:test";
import { fireEvent, render, screen } from "@testing-library/react";
import { BoardView } from "@/app/(game)/_components/board";
import type { Board, Position } from "@/lib/game/types";

function makeBoard(cells: ReadonlyArray<ReadonlyArray<string | null>>): Board {
  const rows = cells.length;
  const cols = cells[0]?.length ?? 0;
  return {
    rows,
    cols,
    cells: cells.map((row, r) =>
      row.map((animal, c) =>
        animal === null ? null : { id: `${r}-${c}`, position: { col: c, row: r }, animal },
      ),
    ),
  };
}

const SMALL: Board = makeBoard([
  ["🐱", "🐶", null],
  ["🐱", null, "🐶"],
]);

function tileAt(pos: Position) {
  return screen.getByTestId(`tile-${pos.col}-${pos.row}`);
}

describe("BoardView", () => {
  test("renders one button per non-empty cell", () => {
    render(
      <BoardView
        board={SMALL}
        selected={null}
        hint={null}
        onSelect={() => {}}
        onDeselect={() => {}}
      />,
    );
    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(4);
  });

  test("each live tile has an aria-label with animal and coordinates", () => {
    render(
      <BoardView
        board={SMALL}
        selected={null}
        hint={null}
        onSelect={() => {}}
        onDeselect={() => {}}
      />,
    );
    const label = tileAt({ col: 0, row: 0 }).getAttribute("aria-label") ?? "";
    expect(label).toContain("🐱");
    expect(label).toContain("column 1");
    expect(label).toContain("row 1");
  });

  test("clicking a tile fires onSelect with its position", () => {
    const captured: { pos: Position | null } = { pos: null };
    render(
      <BoardView
        board={SMALL}
        selected={null}
        hint={null}
        onSelect={(p) => {
          captured.pos = p;
        }}
        onDeselect={() => {}}
      />,
    );
    fireEvent.click(tileAt({ col: 2, row: 1 }));
    expect(captured.pos).toEqual({ col: 2, row: 1 });
  });

  test("selected tile has aria-pressed=true", () => {
    render(
      <BoardView
        board={SMALL}
        selected={{ col: 0, row: 0 }}
        hint={null}
        onSelect={() => {}}
        onDeselect={() => {}}
      />,
    );
    expect(tileAt({ col: 0, row: 0 })).toHaveAttribute("aria-pressed", "true");
    expect(tileAt({ col: 1, row: 0 })).toHaveAttribute("aria-pressed", "false");
  });

  test("hinted pair tiles get data-hinted", () => {
    render(
      <BoardView
        board={SMALL}
        selected={null}
        hint={[
          { col: 0, row: 0 },
          { col: 0, row: 1 },
        ]}
        onSelect={() => {}}
        onDeselect={() => {}}
      />,
    );
    expect(tileAt({ col: 0, row: 0 })).toHaveAttribute("data-hinted", "true");
    expect(tileAt({ col: 0, row: 1 })).toHaveAttribute("data-hinted", "true");
    expect(tileAt({ col: 1, row: 0 })).not.toHaveAttribute("data-hinted");
  });

  test("Enter on a focused tile fires onSelect", () => {
    const captured: { pos: Position | null } = { pos: null };
    render(
      <BoardView
        board={SMALL}
        selected={null}
        hint={null}
        onSelect={(p) => {
          captured.pos = p;
        }}
        onDeselect={() => {}}
      />,
    );
    const tile = tileAt({ col: 1, row: 0 });
    tile.focus();
    fireEvent.keyDown(tile, { key: "Enter" });
    expect(captured.pos).toEqual({ col: 1, row: 0 });
  });

  test("Escape on a focused tile fires onDeselect", () => {
    const captured = { count: 0 };
    render(
      <BoardView
        board={SMALL}
        selected={{ col: 0, row: 0 }}
        hint={null}
        onSelect={() => {}}
        onDeselect={() => {
          captured.count += 1;
        }}
      />,
    );
    const tile = tileAt({ col: 0, row: 0 });
    tile.focus();
    fireEvent.keyDown(tile, { key: "Escape" });
    expect(captured.count).toBe(1);
  });

  test("ArrowRight moves focus to the next live tile in the row", () => {
    render(
      <BoardView
        board={SMALL}
        selected={null}
        hint={null}
        onSelect={() => {}}
        onDeselect={() => {}}
      />,
    );
    const start = tileAt({ col: 0, row: 0 });
    start.focus();
    fireEvent.keyDown(start, { key: "ArrowRight" });
    expect(document.activeElement).toBe(tileAt({ col: 1, row: 0 }));
  });

  test("ArrowDown moves focus to a tile in the next row", () => {
    render(
      <BoardView
        board={SMALL}
        selected={null}
        hint={null}
        onSelect={() => {}}
        onDeselect={() => {}}
      />,
    );
    const start = tileAt({ col: 0, row: 0 });
    start.focus();
    fireEvent.keyDown(start, { key: "ArrowDown" });
    expect(document.activeElement).toBe(tileAt({ col: 0, row: 1 }));
  });

  test("ArrowRight skips empty cells", () => {
    render(
      <BoardView
        board={SMALL}
        selected={null}
        hint={null}
        onSelect={() => {}}
        onDeselect={() => {}}
      />,
    );
    // Row 1: [🐱, null, 🐶] — from col 0 ArrowRight should jump to col 2
    const start = tileAt({ col: 0, row: 1 });
    start.focus();
    fireEvent.keyDown(start, { key: "ArrowRight" });
    expect(document.activeElement).toBe(tileAt({ col: 2, row: 1 }));
  });
});
