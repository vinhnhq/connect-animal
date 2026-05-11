"use client";

import type { Path } from "@/lib/game/types";

type Props = {
  path: Path | null;
  cols: number;
  rows: number;
  reducedMotion: boolean;
};

const FULL_DURATION_MS = 320;
const REDUCED_DURATION_MS = 50;
const ACCENT = "#DC143C";

export function PathFlash({ path, cols, rows, reducedMotion }: Props) {
  if (!path || path.length < 2) return null;

  const durationMs = reducedMotion ? REDUCED_DURATION_MS : FULL_DURATION_MS;
  // Path coords are integer cell indices; SVG viewBox covers (-1..cols) × (-1..rows)
  // so the one-cell border (used by findPath) is also drawable.
  const viewW = cols + 2;
  const viewH = rows + 2;
  const points = path.map((p) => `${p.col + 1 + 0.5},${p.row + 1 + 0.5}`).join(" ");

  return (
    <svg
      data-testid="path-flash"
      data-duration={durationMs}
      role="presentation"
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full"
      viewBox={`0 0 ${viewW} ${viewH}`}
      preserveAspectRatio="none"
      style={{ animation: `path-flash-fade ${durationMs}ms ease-out forwards` }}
    >
      <title>Matching path</title>
      <polyline
        points={points}
        fill="none"
        stroke={ACCENT}
        strokeWidth={0.18}
        strokeLinejoin="miter"
        strokeLinecap="square"
      />
    </svg>
  );
}
