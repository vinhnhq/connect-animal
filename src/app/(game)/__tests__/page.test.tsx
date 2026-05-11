import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { fireEvent, render, screen, within } from "@testing-library/react";
import GamePage from "@/app/(game)/page";

beforeEach(() => {
  localStorage.clear();
});

afterEach(() => {
  localStorage.clear();
});

describe("GamePage integration", () => {
  test("starts in Configuring with the config form visible", () => {
    render(<GamePage />);
    expect(screen.getByRole("button", { name: /start/i })).toBeInTheDocument();
    expect(screen.queryByLabelText(/game board/i)).not.toBeInTheDocument();
  });

  test("clicking Start transitions to the board view", () => {
    render(<GamePage />);
    fireEvent.click(screen.getByRole("button", { name: /start/i }));
    expect(screen.getByLabelText(/game board/i)).toBeInTheDocument();
    // tiles should be present
    expect(screen.getAllByRole("button").length).toBeGreaterThan(0);
  });

  test("after Start the form is preserved (hidden, not unmounted)", () => {
    render(<GamePage />);
    // Pick small board so test setup is small
    const boardGroup = screen.getByRole("radiogroup", { name: /board size/i });
    fireEvent.click(within(boardGroup).getByRole("radio", { name: /small/i }));
    fireEvent.click(screen.getByRole("button", { name: /start/i }));
    // The Configuring form is still in the DOM (Activity hidden), just inert
    expect(screen.getByRole("radio", { name: /small/i, hidden: true })).toBeInTheDocument();
  });
});
