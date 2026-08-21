# Design decision: CRT Phosphor palette

## Context

The project originally shipped Phases 6–8 under a "Slate Blue + Teal" palette
(background `#0D1321`, accent `#2DD4BF`). After comparing the rendered result
against five other style directions, the palette was replaced before starting
Phase 9.

## Decision

Adopted **CRT Phosphor**: a monochrome, high-contrast palette (near-black
background, pure white text, no hue) evoking an old CRT terminal. It is aligned
with the project's Arch Linux / terminal-driven identity.

| Role | Token | Hex |
|---|---|---|
| Background | `--color-bg` | `#050505` |
| Surface / card | `--color-surface` | `#0A0A0A` |
| Border / divider | `--color-border` | `#2B2B2B` |
| Accent (CTA, links, chart line) | `--color-accent` | `#F5F5F5` |
| Text (primary) | `--color-text` | `#FAFAFA` |
| Text (muted) | `--color-text-muted` | `#7A7A7A` |
| Text (dim, axis labels, timestamps) | `--color-text-dim` | `#616161` |

**Typography:**
- Display / headings: `Space Grotesk` (weight 700)
- Body, labels, data, code: `JetBrains Mono`

**Signature element:** a subtle scanline overlay (`repeating-linear-gradient`,
~2.8% opacity) applied once to the app shell: the one deliberate visual flourish;
everything else (grid, spacing, type hierarchy) stays disciplined and sober.

## Rationale

Chosen over five alternatives, including a green "matrix rain" style, because
it signals typographic and grid discipline rather than leaning on a themed
effect. Reads as more deliberate and professional in a portfolio-review context,
where the goal is to demonstrate craft, not novelty.

## Scope

This is a pure token/typography swap. No component structure, layout, or logic
changed; only the values behind existing token names (`bg-surface`,
`text-accent`, etc.) in `client/src/index.css`, plus hardcoded hex in
`ClicksPerDayChart.tsx`, `ClicksPerDeviceChart.tsx`, and `Dashboard.tsx`
(Recharts doesn't read CSS `var()` in SVG props, so those stay hardcoded but
updated to the new hex values).