---
title: Accessibility
description: What pele-animate does for keyboard users and reduced motion, and what has not been audited.
order: 11
section: Reference
---

# Accessibility

What is in place:

- **Reduced motion.** `prefers-reduced-motion: reduce` turns off the intro and the tokens. The finished diagram shows.
- **Keyboard.** The diagram container is focusable (`tabindex="0"`). Enter or Space starts step mode; then Space plays or pauses, ← and → step, and Esc leaves.
- **Step controls.** The bar has `role="toolbar"` with an accessible name, and its buttons have labels. Previous and next use
  `aria-disabled` at the ends.
- **Focus outline.** A visible focus ring uses the `--pa-solid` color.

What has **not** been checked: a pass with a screen reader, and contrast ratios of custom palettes. Treat the diagram as an
illustration and keep the key information in the surrounding text as well, as with any diagram. The text of the Mermaid
source is not a substitute for a description.
