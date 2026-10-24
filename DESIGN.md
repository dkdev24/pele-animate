# DESIGN.md: pele-animate.danielkimdev.com

Look and feel of the site. `SITE_DEV_PLAN.md` says what to build; this says how it should look. Keep it short; change it
when the site changes.

## 1. Purpose

Get a developer from "what is this?" to an animated diagram in their project. The diagram is the loudest thing on every
page; the site's own chrome stays quiet.

## 2. Visual theme

- **Product-led.** The lavender scene panel and purple line style of the diagrams set the palette. The site does not add a
  second accent color.
- **Distinct from pele.run.** Nobody should mistake this for the upstream project. The footer says: built on Pele by kepano
  (MIT), not affiliated.
- **Plain.** Flat surfaces, thin borders, no shadows except a focus ring, no gradients, no illustrations beyond the diagrams.

### Tokens

All colors are CSS variables on `:root` (`site/src/app.css`); components never use raw hex values.

| Token | Light | Dark | Use |
|---|---|---|---|
| `--bg` | `#ffffff` | `#15121f` | Page |
| `--bg-soft` | `#f7f5fc` | `#1c1829` | Sidebar, code blocks, cards |
| `--fg` | `#1f1a33` | `#ece8ff` | Text |
| `--fg-muted` | `#5f5878` | `#a69fc2` | Secondary text |
| `--line` | `#e4dcf6` | `#332c4d` | Borders |
| `--accent` | `#4f378b` | `#b9a6ff` | Links, active nav, focus ring |
| `--accent-soft` | `#efeafa` | `#241d3b` | Active nav background, scene panel |

The diagrams use pele-animate's own `--pa-*` variables; the site maps them onto these tokens so a diagram matches the page.

## 3. Typography

- **Text:** Inter Variable (self-hosted via Fontsource). **Code:** JetBrains Mono Variable.
- Scale: body 1rem/1.65; docs h1 2rem, h2 1.4rem, h3 1.15rem; hero h1 clamp(2rem, 5vw, 3.2rem). One weight pair: 400 and 650.
- Line length: docs text capped at 72ch.

## 4. Layout

- Max width 72rem, 16 px gutters on phones, no horizontal page scroll at any width.
- **Docs:** three columns on wide screens (sidebar 14rem, content, table of contents 12rem); the sidebar and table of contents
  collapse under 62rem (sidebar becomes a `<details>` menu above the content, the table of contents is dropped).
- **Header:** product name, Docs, Changelog, GitHub, npm, theme toggle. Links to pages that do not exist yet are not shown.
- **Footer:** credits (Pele, Tabler), license, non-affiliation line.

## 5. Components

- **Live diagram:** the scene panel from `pele-animate.css`, full content width, with the Mermaid source in a collapsed
  `<details>` underneath. Never a screenshot.
- **Code block:** `--bg-soft`, 1px `--line` border, 8 px radius, horizontal scroll, Shiki highlighting (light and dark themes).
- **Callout:** left border in `--accent`, `--bg-soft` background.
- **Buttons and links:** links are `--accent` and underlined on hover; buttons are bordered, 36 px high.
- **Prev/next:** two bordered cards at the end of every docs page.

## 6. Motion

Only the diagrams animate. Nothing on the site moves otherwise. `prefers-reduced-motion` is honored by pele-animate itself
and by the site (no smooth scrolling).

## 7. Accessibility

- Contrast of text on `--bg` and `--bg-soft` at least 4.5:1 in both themes.
- Visible `:focus-visible` outlines in `--accent`; a "Skip to content" link.
- Semantic landmarks (`header`, `nav`, `main`, `aside`, `footer`); one `h1` per page; headings in order.
- The theme toggle is a button with an accessible name and state; the choice is stored in `localStorage` when available and
  the page works without it.
- Diagram pages keep the key information in the surrounding text, not only in the diagram.

## 8. Dark mode

Follows `prefers-color-scheme`. The header toggle sets `data-theme="light"` or `data-theme="dark"` on the root element and
overrides the system. pele-animate honors the same attribute.

## 9. Voice

Plain words, short sentences, no marketing claims that are not measured. Say "step order", "step-by-step playback" and
"icons"; do not say "choreography" or call it a theme package.

## 10. Do and don't

- Do show code next to the result it produces.
- Do keep one idea per docs page section.
- Don't add a second accent color, shadows or decorative images.
- Don't link to pages that do not exist.
- Don't claim anything the build does not measure.
