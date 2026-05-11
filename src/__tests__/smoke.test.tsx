import { describe, expect, test } from "bun:test";
import { render, screen } from "@testing-library/react";
import GamePage from "@/app/(game)/page";

describe("smoke", () => {
  test("GamePage renders the wordmark", () => {
    render(<GamePage />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/connect/i);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/animal/i);
  });
});
