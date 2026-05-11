# Design system

The visual language for connect-animal is "V3 brutalist, dialed down" — picked after a 6-variant preview round (see commit `d2d3aa3` for the alternates that were considered and rejected). Same tokens are used for the game and the future blog.

The **single source of truth is the live storybook** at [`/preview`](http://localhost:3000/preview) ([`src/app/preview/page.tsx`](../../src/app/preview/page.tsx)). Tokens below are a quick-reference summary so engineers don't have to read JSX to know the rules.

## Color

| Token | Hex | Use |
|---|---|---|
| ink | `#000000` | Borders, text, label chips |
| paper | `#FFFFFF` | Page background, light tiles, button fill |
| crimson | `#DC143C` | Single accent — wordmark fragment, primary CTA, active label chip, inline link underline. **Never** body text. |
| neutral-500 | `#737373` | Meta (dates, captions), muted notes |

Light/dark via OS preference. Dark mode flips ink↔paper; crimson stays the same.

## Typography

System sans throughout, with monospace reserved for **numerics and code**.

| Step | Size | Weight | Use |
|---|---|---|---|
| Display | `text-5xl` (mobile `text-3xl`) | medium | Wordmark, hero |
| H1 | `text-3xl` | medium | Post titles |
| H2 | `text-xl` | medium | Subsection titles |
| Body | `text-base` | normal | Prose, body copy (max-width `65ch`) |
| Mono | `text-base` | normal, `tabular-nums` | Timer, score, code blocks |
| Label | `text-[10px]` | medium, uppercase, `tracking-[0.2em]` | All-caps meta chips |

## Borders

| Width | Use |
|---|---|
| `1px` | Dividers inside a card; internal seams between board tiles |
| `2px` | Tile selection ring (`inset 0 0 0 2px crimson`) |
| `3px` | Page architecture — top/bottom rules, board frame, button strokes, divide-y between post-list rows |

Never 4+.

## Buttons

All buttons: `text-sm font-medium uppercase tracking-wider`, 3-px ink border, no rounding.

- **Default** — paper fill, ink border, inverts on hover.
- **Inverted** — ink fill, paper text.
- **Primary** — crimson fill, ink border, paper text. Prefixed with `▶` glyph.
- **Disabled** — opacity 30% on stroke and text.

## Tile states

| State | Visual |
|---|---|
| Empty | Light-gray fill, no glyph |
| Light | Paper fill, ink glyph |
| Dark | Ink fill, paper glyph |
| Selected | Inner ring `inset 0 0 0 3px crimson` |
| Hinted (pair) | Double ring `inset 0 0 0 3px ink, inset 0 0 0 5px crimson` |

## Mobile

Hard requirement: **the game must play well on a phone.**

- Outer page padding: `px-3 py-6` on mobile, `px-4 py-8` from `sm+`.
- Wordmark scales from `text-5xl` (desktop) to `text-3xl` (mobile).
- Stats bar stays 3 columns at every width but shrinks padding and label tracking on mobile.
- Action buttons become a 2-column grid on mobile with the primary CTA spanning both columns.
- Tile glyphs drop from `text-3xl` to `text-xl` on mobile so the 8-column board fits a 320–375 px viewport without horizontal scroll.
- Tap targets stay at or above 44 px (Apple HIG minimum) at every breakpoint.

## What the storybook covers

- **Foundations** — color, typography, spacing scale, border widths.
- **Game** — wordmark, stats bar, button states, tile states, full 8×6 board.
- **Blog** — post header, body prose, blockquote, code block, tag chip, post list, pagination.
- **Misc** — status dot, empty state.

## Discipline

- **Single accent.** Crimson is the only colored signal. Don't add a second accent without surfacing it for review — the discipline is the point.
- **No body crimson.** Tinting paragraph text reduces the accent to background noise.
- **Native HTML + tokens, no component library.** The original plan was to wrap shadcn primitives, but the game ships built directly against semantic HTML (`<button>`, `<input type="radio">`, `<section>`) with V3 tokens applied via Tailwind. shadcn was removed in retro item R10 — if we add it back, restyle every primitive to these tokens before shipping.
- **Borders are architecture, not decoration.** Use 3-px rules to **separate page regions**, not to wrap every element. Body text never sits inside a 3-px box.
