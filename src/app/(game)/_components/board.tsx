"use client";

import type { KeyboardEvent } from "react";
import type { Board, Cell, Position } from "@/lib/game/types";

type Props = {
  board: Board;
  selected: Position | null;
  hint: readonly [Position, Position] | null;
  onSelect: (pos: Position) => void;
  onDeselect: () => void;
};

const ACCENT = "#DC143C";

export function BoardView({ board, selected, hint, onSelect, onDeselect }: Props) {
  function handleKey(e: KeyboardEvent<HTMLButtonElement>, pos: Position) {
    switch (e.key) {
      case "Enter":
      case " ":
        e.preventDefault();
        onSelect(pos);
        return;
      case "Escape":
        e.preventDefault();
        onDeselect();
        return;
      case "ArrowRight":
        e.preventDefault();
        focusNext(board, pos, 1, 0);
        return;
      case "ArrowLeft":
        e.preventDefault();
        focusNext(board, pos, -1, 0);
        return;
      case "ArrowDown":
        e.preventDefault();
        focusNext(board, pos, 0, 1);
        return;
      case "ArrowUp":
        e.preventDefault();
        focusNext(board, pos, 0, -1);
        return;
    }
  }

  const firstLive = findFirstLive(board);
  const flat = flatten(board);

  return (
    <section
      aria-label="Game board"
      className="grid border-[3px] border-black dark:border-white"
      style={{ gridTemplateColumns: `repeat(${board.cols}, 1fr)` }}
    >
      {flat.map(({ cell, col, row, key }) => (
        <CellView
          key={key}
          cell={cell}
          col={col}
          row={row}
          isSelected={selected?.col === col && selected?.row === row}
          isHinted={isHinted(hint, col, row)}
          tabIndex={firstLive && firstLive.col === col && firstLive.row === row ? 0 : -1}
          onActivate={onSelect}
          onKey={handleKey}
        />
      ))}
    </section>
  );
}

function flatten(board: Board): Array<{ cell: Cell; col: number; row: number; key: string }> {
  const out: Array<{ cell: Cell; col: number; row: number; key: string }> = [];
  for (let row = 0; row < board.rows; row++) {
    for (let col = 0; col < board.cols; col++) {
      const cell = board.cells[row]?.[col] ?? null;
      out.push({ cell, col, row, key: `c-${col}-${row}` });
    }
  }
  return out;
}

function isHinted(hint: readonly [Position, Position] | null, col: number, row: number): boolean {
  if (!hint) return false;
  return (
    (hint[0].col === col && hint[0].row === row) || (hint[1].col === col && hint[1].row === row)
  );
}

function findFirstLive(board: Board): Position | null {
  for (let row = 0; row < board.rows; row++) {
    for (let col = 0; col < board.cols; col++) {
      if (board.cells[row]?.[col]) return { col, row };
    }
  }
  return null;
}

function focusNext(board: Board, from: Position, dCol: number, dRow: number) {
  let col = from.col + dCol;
  let row = from.row + dRow;
  while (col >= 0 && col < board.cols && row >= 0 && row < board.rows) {
    if (board.cells[row]?.[col]) {
      const el = document.querySelector<HTMLElement>(`[data-testid="tile-${col}-${row}"]`);
      el?.focus();
      return;
    }
    col += dCol;
    row += dRow;
  }
}

type CellProps = {
  cell: Cell;
  col: number;
  row: number;
  isSelected: boolean;
  isHinted: boolean;
  tabIndex: number;
  onActivate: (pos: Position) => void;
  onKey: (e: KeyboardEvent<HTMLButtonElement>, pos: Position) => void;
};

function CellView({
  cell,
  col,
  row,
  isSelected,
  isHinted,
  tabIndex,
  onActivate,
  onKey,
}: CellProps) {
  const isLight = (col + row) % 2 === 0;

  if (!cell) {
    return (
      <div
        aria-hidden
        className="aspect-square border border-black/30 dark:border-white/30"
        style={{ backgroundColor: "#F4F4F4" }}
      />
    );
  }

  const ring = isSelected
    ? `inset 0 0 0 3px ${ACCENT}`
    : isHinted
      ? `inset 0 0 0 3px #000, inset 0 0 0 5px ${ACCENT}`
      : undefined;

  return (
    <button
      type="button"
      data-testid={`tile-${col}-${row}`}
      data-hinted={isHinted ? "true" : undefined}
      aria-pressed={isSelected}
      aria-label={`${cell.animal} at column ${col + 1}, row ${row + 1}`}
      tabIndex={tabIndex}
      onClick={() => onActivate({ col, row })}
      onKeyDown={(e) => onKey(e, { col, row })}
      className="relative flex aspect-square items-center justify-center border border-black/30 text-xl leading-none sm:text-3xl dark:border-white/30"
      style={{
        backgroundColor: isLight ? "#FFFFFF" : "#000000",
        color: isLight ? "#000000" : "#FFFFFF",
        boxShadow: ring,
      }}
    >
      <span aria-hidden>{cell.animal}</span>
    </button>
  );
}
