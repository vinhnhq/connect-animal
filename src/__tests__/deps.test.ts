import { describe, expect, test } from "bun:test";
import { Maybe } from "purify-ts";
import { match } from "ts-pattern";
import { cn } from "@/lib/utils";

describe("dependency wiring", () => {
  test("purify-ts Maybe is available", () => {
    expect(Maybe.of(42).extract()).toBe(42);
    expect(Maybe.empty().isNothing()).toBe(true);
  });

  test("ts-pattern match is exhaustive", () => {
    type Light = "red" | "yellow" | "green";
    const stop = (l: Light) =>
      match(l)
        .with("red", () => "stop")
        .with("yellow", () => "slow")
        .with("green", () => "go")
        .exhaustive();

    expect(stop("red")).toBe("stop");
    expect(stop("green")).toBe("go");
  });

  test("path alias @/* resolves to src/*", () => {
    expect(cn("a", "b", { c: true, d: false })).toBe("a b c");
  });
});
