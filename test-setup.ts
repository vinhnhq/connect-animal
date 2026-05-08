import { GlobalRegistrator } from "@happy-dom/global-registrator";

GlobalRegistrator.register();

const { cleanup } = await import("@testing-library/react");
const matchers = await import("@testing-library/jest-dom/matchers");
const { afterEach, expect } = await import("bun:test");

expect.extend(matchers.default ?? matchers);

afterEach(() => {
  cleanup();
});
