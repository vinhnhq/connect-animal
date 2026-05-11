import { describe, expect, test } from "bun:test";
import { render, screen } from "@testing-library/react";
import { PathFlash } from "@/app/(game)/_components/path-flash";

describe("PathFlash", () => {
  test("renders nothing when path is null", () => {
    const { container } = render(
      <PathFlash path={null} cols={10} rows={8} reducedMotion={false} />,
    );
    expect(container.querySelector("svg")).toBeNull();
  });

  test("renders an SVG with a polyline matching the path", () => {
    render(
      <PathFlash
        path={[
          { col: 0, row: 0 },
          { col: 3, row: 0 },
          { col: 3, row: 2 },
        ]}
        cols={10}
        rows={8}
        reducedMotion={false}
      />,
    );
    const svg = screen.getByTestId("path-flash");
    expect(svg).toBeInTheDocument();
    const polyline = svg.querySelector("polyline");
    expect(polyline).not.toBeNull();
    expect(polyline?.getAttribute("points")?.split(/\s+/).length).toBe(3);
  });

  test("animation duration is shorter under reduced motion", () => {
    const { rerender } = render(
      <PathFlash
        path={[
          { col: 0, row: 0 },
          { col: 1, row: 0 },
        ]}
        cols={4}
        rows={4}
        reducedMotion={false}
      />,
    );
    const fullDur = screen.getByTestId("path-flash").getAttribute("data-duration");

    rerender(
      <PathFlash
        path={[
          { col: 0, row: 0 },
          { col: 1, row: 0 },
        ]}
        cols={4}
        rows={4}
        reducedMotion={true}
      />,
    );
    const reducedDur = screen.getByTestId("path-flash").getAttribute("data-duration");

    expect(Number(reducedDur)).toBeLessThan(Number(fullDur));
  });
});
