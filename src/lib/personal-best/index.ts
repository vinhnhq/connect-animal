import type { BoardSize } from "@/lib/game/types";

export type StorageLike = {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
};

const PREFIX = "connect-animal:pb";

export function personalBestKey(size: BoardSize): string {
  return `${PREFIX}:${size}`;
}

export function readPersonalBest(storage: StorageLike, size: BoardSize): number | null {
  const raw = storage.getItem(personalBestKey(size));
  if (!raw) return null;
  const n = Number(raw);
  if (!Number.isFinite(n) || n <= 0) return null;
  return n;
}

export function writePersonalBest(
  storage: StorageLike,
  size: BoardSize,
  ms: number,
): "saved" | "kept" {
  if (!Number.isFinite(ms) || ms <= 0) return "kept";
  const existing = readPersonalBest(storage, size);
  if (existing !== null && existing <= ms) return "kept";
  storage.setItem(personalBestKey(size), String(Math.floor(ms)));
  return "saved";
}
