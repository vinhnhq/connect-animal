import { afterEach, describe, expect, test } from "bun:test";
import { existsSync, unlinkSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const FIXTURE = join(import.meta.dir, "_lint-fixture.ts");

async function lint(): Promise<{ code: number; output: string }> {
  const proc = Bun.spawn(
    ["bunx", "@biomejs/biome", "lint", "--vcs-use-ignore-file=false", FIXTURE],
    { stdout: "pipe", stderr: "pipe" },
  );
  const [stdout, stderr] = await Promise.all([
    new Response(proc.stdout).text(),
    new Response(proc.stderr).text(),
  ]);
  return { code: await proc.exited, output: stdout + stderr };
}

afterEach(() => {
  if (existsSync(FIXTURE)) unlinkSync(FIXTURE);
});

describe("pure-lib import boundary", () => {
  test("biome flags `react` imports inside src/lib/game", async () => {
    writeFileSync(FIXTURE, 'import * as React from "react";\nexport const x = React;\n');
    const { code, output } = await lint();
    expect(code).not.toBe(0);
    expect(output).toContain("noRestrictedImports");
  });

  test("biome flags `next/navigation` imports inside src/lib/game", async () => {
    writeFileSync(
      FIXTURE,
      'import { useRouter } from "next/navigation";\nexport const x = useRouter;\n',
    );
    const { code, output } = await lint();
    expect(code).not.toBe(0);
    expect(output).toContain("noRestrictedImports");
  });

  test("biome flags `document` global usage inside src/lib/game", async () => {
    writeFileSync(FIXTURE, "export const title = () => document.title;\n");
    const { code, output } = await lint();
    expect(code).not.toBe(0);
    expect(output).toContain("noRestrictedGlobals");
  });

  test("biome accepts a clean pure module inside src/lib/game", async () => {
    writeFileSync(FIXTURE, "export const add = (a: number, b: number) => a + b;\n");
    const { code } = await lint();
    expect(code).toBe(0);
  });
});
