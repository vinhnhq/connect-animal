"use client";

import { useCallback, useEffect, useState } from "react";
import type { BoardSize } from "@/lib/game/types";
import { readPersonalBest, writePersonalBest } from "@/lib/personal-best";

export type PersonalBests = Record<BoardSize, number | null>;

const EMPTY: PersonalBests = { small: null, medium: null, large: null };

export function usePersonalBests(): {
  bests: PersonalBests;
  record: (size: BoardSize, ms: number) => void;
} {
  const [bests, setBests] = useState<PersonalBests>(EMPTY);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setBests({
      small: readPersonalBest(window.localStorage, "small"),
      medium: readPersonalBest(window.localStorage, "medium"),
      large: readPersonalBest(window.localStorage, "large"),
    });
  }, []);

  const record = useCallback((size: BoardSize, ms: number) => {
    if (typeof window === "undefined") return;
    const result = writePersonalBest(window.localStorage, size, ms);
    if (result === "saved") {
      setBests((prev) => ({ ...prev, [size]: readPersonalBest(window.localStorage, size) }));
    }
  }, []);

  return { bests, record };
}
