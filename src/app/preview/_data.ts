// Shared mock data for design-variant pages. Not used by real gameplay.

export const ANIMALS = ["🐱", "🐶", "🐭", "🐰", "🦊", "🐻", "🐼", "🐯", "🐸", "🐵"] as const;

// 8 cols × 6 rows = 48 tiles. We populate 28 of them (14 pairs) and leave 20
// empty to suggest a mid-game state. The mapping is deterministic so the
// preview looks identical on every render.
export const COLS = 8;
export const ROWS = 6;

const RAW = [
  "🐱.🐶..🐭🐰.",
  ".🦊🐻.🐼🐯🐸.",
  "🐱🐶..🐭🐰..",
  ".🦊..🐻🐼.🐯",
  "🐸..🐵.🐵..",
  "..🐱.🐶.🐭🐰",
];

export type SampleCell = { animal: string | null; col: number; row: number };

export const SAMPLE_BOARD: SampleCell[] = (() => {
  const out: SampleCell[] = [];
  for (let row = 0; row < ROWS; row++) {
    const line = RAW[row] ?? "";
    const chars = [...line];
    for (let col = 0; col < COLS; col++) {
      const ch = chars[col];
      out.push({
        col,
        row,
        animal: !ch || ch === "." ? null : ch,
      });
    }
  }
  return out;
})();

export const SELECTED = { col: 1, row: 1 };
export const HINTED = [
  { col: 4, row: 4 },
  { col: 3, row: 4 },
] as const;

export const STATS = {
  timeLabel: "02:14",
  human: 3,
  computer: 1,
  ai: "Thinking…",
} as const;

export const BLOG_PREVIEW = {
  title: "Why functional cores make games portable",
  date: "May 11, 2026",
  body: "The game logic for Connect Animal lives in pure modules — no React, no DOM, no clock. Same code that runs your tiles will run the v2 multiplayer server. Here's how the boundary stays honest, even under deadline pressure.",
} as const;
