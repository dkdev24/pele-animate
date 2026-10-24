---
name: diagram-step-order
description: Review and fix the animation step order of pele-animate diagrams (Mermaid code blocks in document pages) against the page text, and tune groups, icons and labels so the flow reads clearly. Use when converting existing Mermaid diagrams to pele-animate, or when asked to check or adjust step order, `%% pa:` pins, or step-by-step playback of a diagram.
---

# Diagram step order

Goal: when a viewer steps through a diagram (click, then ←/→), each step shows what the surrounding text says happens next.

## What controls the order

- **Flowcharts:** nodes appear by BFS level from the sources. An edge appears with its later end. `%% pa: 1=A,B 2=C` (first line inside the block, after the diagram type) pins nodes to steps. `%% pa: 3=A>B` pins the edge from A to B (needed for a reply or any edge between nodes that are already visible). Pin nodes first: an edge pinned before its target exists lands early. Unpinned nodes keep their BFS level; gaps in step numbers are skipped when stepping.
- **Sequence diagrams:** step 1 is the participants, then one step per message in source order. Pins do nothing. Reordering messages changes what the diagram says, so never do it silently: if the order disagrees with the text, report it.
- Ties: two edges into the same node share a step. Request and reply between the same two nodes land together unless the reply is edge-pinned.

## Workflow

1. **Find the blocks** in the page and read the prose around each one (heading, the paragraph before and after, captions, numbered lists). Write down the order the text describes, one line per step.
2. **Probe the current order.** With the site running (restart a dev server after changing a locally copied library, then hard reload; a soft reload can show stale steps): `agent-browser open <url>`, then `agent-browser eval "$(cat steps.js)"`. Each step prints its nodes, `[FROM_TO]` edges and quoted edge labels.
3. **Triage.**
   - Sequence diagram: compare message order with the text, change nothing, flag mismatches.
   - Linear chain or decision tree: BFS order is normally right (branches of a decision appear together). Say "no change" and why.
   - Existing pins: a person tuned them. Keep their intent; refine only where the text clearly disagrees, and say so.
   - Topology with lanes or groups: usually needs work.
4. **Fix** with pins and edge pins, then node declaration order and edge direction. Do not rename node ids (pins and CSS key on them) and do not change labels' meaning. Keep one idea per step: a request and its response are two steps; things that happen at the same moment share one.
5. **Appearance.** Follow the site's own diagram conventions file (group colour ids, icon set, label length). Within it: put nodes in groups by who owns them, use a glyph where one fits the meaning, keep edge labels to one short line, order nodes inside a lane so arrows run in the reading direction. Do not edit shared styles or the library; list any needed glyph or CSS as a follow-up.
6. **Mirror translations.** Translated pages have their own labels but the same node ids. Diff the ids between the two sources before copying a `%% pa:` line, then probe the translated page too.
7. **Re-probe** every changed diagram and confirm the printed steps match the order you wrote down in step 1.

## Lessons from the first run

- Probe every diagram you report on, linear chains included. "Read the source" is not a check; one run left some diagrams unprobed.
- A `<-->` edge is pinned in its first-written direction (`H>F` for `H <--> F`).
- When several agents work in parallel, give each its own browser session (`agent-browser --session <name>`) and tell them not to start, stop or restart the shared dev server.
- After changing a locally copied library, restart the dev server and clear its cache, or the page keeps the old module.
- Edge pins need a pele-animate release that supports them; until then they are ignored and the node order still applies.
- Tuned one language? Mirror the pins to the others in the same pass; a tuned EN page next to an untuned KO page is the usual miss.

## Report, one row per diagram

`page | n/total | before steps → after steps | one line tying the order to the text | changes (pins, groups, labels) | follow-ups`

Say "no change" with the reason when you leave one alone. The person reviewing reads this table, so keep each cell short and let the probe output carry the detail.
