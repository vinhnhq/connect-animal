import { describe, expect, test } from "bun:test";
import { render, screen } from "@testing-library/react";
import Home from "@/app/page";

describe("smoke", () => {
  test("Home renders the title", () => {
    render(<Home />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Connect Animal");
  });
});
