---
title: Diagram types
description: Which Mermaid diagrams pele-animate animates, and what each one does.
order: 3
section: Start
---

# Diagram types

pele-animate animates these Mermaid diagram types. Each one plays an intro when it scrolls into view and, on click, steps through its
items with previous / play / next controls.

| Type | Each step reveals | Pins, icons | Remarks |
|---|---|---|---|
| [Flowchart](#flowcharts)<br>`flowchart` | Nodes level by level, edges from their source | Pins and icons | The fullest support: groups, edge labels, large icon nodes. |
| [Sequence diagram](#sequence-diagrams)<br>`sequenceDiagram` | Actors, then one message at a time | Neither | The order is the source order; reordering messages changes what the diagram says. |
| [Architecture](#architecture-diagrams)<br>`architecture-beta` | Services level by level, edges from their source | Pins and icons | Icons are written `(name)` and are small and fixed in size. |
| [State diagram](#state-diagrams)<br>`stateDiagram-v2` | States and transitions from the start marker | Pins | Markers are `root_start` and `root_end`. Composite states are untested. |
| [C4 context](#c4-context-diagrams)<br>`C4Context` | People and systems, then relationships | Pins | Only `C4Context` is checked. Keep `Rel` labels short. |
| [Block diagram](#block-diagrams)<br>`block-beta` | Blocks and arrows from their source | Pins | Put linked blocks in the same row or column. |
| [Class diagram](#class-diagrams)<br>`classDiagram` | Classes and relationships, from the class written first | Pins | `A <\|-- B` reveals `A`, then `B`. |
| [ER diagram](#er-diagrams)<br>`erDiagram` | Entities and relationships, from the entity written first | Pins | Same written-order rule as class diagrams. |
| [Timeline](#timelines-journeys-git-graphs-and-gantt-charts)<br>`timeline` | One time period with its events | Neither | Section headers stay visible. |
| [User journey](#timelines-journeys-git-graphs-and-gantt-charts)<br>`journey` | One task, its face and the line joining it to the last | Neither |  |
| [Git graph](#timelines-journeys-git-graphs-and-gantt-charts)<br>`gitGraph` | One commit with its edge; a branch with its first commit | Neither | Cherry-picks and tags are untested. |
| [Gantt chart](#timelines-journeys-git-graphs-and-gantt-charts)<br>`gantt` | One task, top to bottom | Neither | `todayMarker` and parallel tasks are untested. |

Pins are `%% pa:` comments; see [step order](./step-order.md). Types without pins use their source order. Icons are set up in
[icons](./icons.md). Pele renders the other Mermaid types too (pie, quadrant, radar and the rest), but pele-animate is not built
for them; see [Everything else](#everything-else).

## Flowcharts

Nodes appear in step order, edges draw from their source node, and edge labels fade in. Groups (`subgraph`) and their titles
are kept. Icon nodes (`@{ icon }`) work here; see [icons](./icons.md).

The pins below put "Serve" (the cache hit) before "Fetch", then draw the `Fetch` to `Serve` edge as its own last step. Without them, `Serve` and `Fetch` would appear together.

```mermaid live title="Flowchart: cache hit or miss, with pins and an edge pin"
flowchart LR
  %% pa: 1=A 2=B 3=C 4=D 5=D>C
  A[Client] --> B{Cached?}
  B -->|yes| C[Serve]
  B -->|no| D[Fetch] --> C
```

## Sequence diagrams

Actors appear first, then one step per message in source order, so a cache miss reads as five short steps. Participant boxes in a row get the same height, and group titles are bold.

```mermaid live title="Sequence: API request with a cache miss"
sequenceDiagram
  Client->>API: request
  API->>Cache: lookup
  Cache-->>API: miss
  API->>Database: query
  Database-->>API: rows
  API-->>Client: response
```

**Limit:** Pele ignores `@{ icon }` on sequence participants (the box shows its id), so icons apply to flowcharts only.

## Architecture diagrams

`architecture-beta`: services in groups, joined by edges. Services appear in step order like flowchart nodes, groups stay visible,
and `%% pa:` pins work the same way. The icon in parentheses is looked up in your icon packs, so Tabler names and `doverunner-*`
names work (import the packs as for [icons](./icons.md)). The pins here follow a request: the user, the CDN, the API, the cache and database together, then the queue and worker.

```mermaid-icons live title="Architecture: request path through CDN, API, cache, database and worker"
architecture-beta
  %% pa: 1=user 2=cdn 3=api 4=cache,db 5=queue 6=worker
  group edge(cloud)[Edge]
  group core(cloud)[Core]
  service user(device-desktop)[User]
  service cdn(cloud-computing)[CDN] in edge
  service api(server)[API] in core
  service cache(bolt)[Cache] in core
  service db(database)[Database] in core
  service queue(mail)[Queue] in core
  service worker(settings)[Worker] in core
  user:R --> L:cdn
  cdn:R --> L:api
  api:T --> B:cache
  api:B --> T:db
  api:R --> L:queue
  queue:R --> L:worker
```

Icons here are small and fixed in size; `form` and `h` apply to flowcharts only. Edges are read from their written direction
(`user:R --> L:cdn` is user to cdn). A node id containing `-` can be mistaken for two ids on an edge, so use plain ids.

## State diagrams

`stateDiagram-v2`: states appear in step order, transitions draw from their source state, and transition labels fade in. The
start and end markers are nodes too, with the ids `root_start` and `root_end`, so pins can name them.

```mermaid live title="State: media player with loading, error and retry"
stateDiagram-v2
  %% pa: 1=root_start 2=Idle 3=Loading 4=Playing 5=Paused 6=Error 7=root_end
  [*] --> Idle
  Idle --> Loading: play
  Loading --> Playing: ready
  Playing --> Paused: pause
  Paused --> Playing: resume
  Loading --> Error: fail
  Error --> Idle: retry
  Playing --> [*]: stop
```

The pins give each state its own step, in the order a viewer meets them. Without pins the order is breadth-first from the start marker, which shows states at the same distance together (here `Playing` and `Error`). Pele gives
state edges no readable ids, so pele-animate finds each transition's ends from where its path starts and stops. Composite
states and forks are untested. State diagrams take no icons.

## C4 context diagrams

`C4Context`: people and systems appear in step order and each `Rel` draws from its source, with its label. Pins use the ids you
give `Person(...)` and `System(...)`; an edge pin is `3=app>drm`. The example adds the DRM service, CDN and analytics one at a time, then the operator who reads the analytics.

```mermaid live title="C4 context: player app and the systems around it"
C4Context
  %% pa: 1=viewer 2=app 3=drm 4=cdn 5=analytics 6=admin
  Person(viewer, "Viewer", "Watches video")
  System(app, "Player app", "Plays protected video")
  System_Ext(drm, "DRM service", "Issues licenses")
  System_Ext(cdn, "CDN", "Delivers segments")
  System(analytics, "Analytics", "Tracks playback")
  Person(admin, "Operator", "Reviews usage")
  Rel(viewer, app, "watches")
  Rel(app, drm, "license")
  Rel(app, cdn, "segments")
  Rel(app, analytics, "events")
  Rel(admin, analytics, "reviews")
  UpdateLayoutConfig($c4ShapeInRow="3", $c4BoundaryInRow="1")
```

Pele lays C4 diagrams out in rows, so a long label between two boxes in the same row can leave no room for the arrowhead:
keep `Rel` labels short. Only `C4Context` has been checked; the other C4 types and boundaries are untested. C4 shapes take no icons.

## Block diagrams

`block-beta`: blocks appear in step order and each arrow draws from its source block. Pins use the block ids.

```mermaid live title="Block: video pipeline with a storage branch"
block-beta
  columns 4
  %% pa: 1=src 2=enc 3=pkg 4=cdn 5=store
  src["Source"] enc["Encode"] pkg["Package"] cdn["CDN"]
  space space store[("Storage")] space
  src --> enc
  enc --> pkg
  pkg --> cdn
  pkg --> store
```

Pele routes arrows between blocks in straight lines or short bends, so place linked blocks in the same row or column; a diagonal
neighbour can give a bent arrow that runs along another one. Block diagrams take no icons.

## Class diagrams

`classDiagram`: classes appear in step order, relationships draw from the class written first. `Media <|-- Video` reveals `Media`
and then `Video`, whichever way the arrowhead points. Pins use the class names; the example shows the base class, its subtypes, then the classes that use them.

```mermaid live title="Class: media types, player and license"
classDiagram
  %% pa: 1=Media 2=Video,Audio 3=Player 4=License 5=Session
  Media <|-- Video
  Media <|-- Audio
  Player --> Media : plays
  Player --> License : needs
  License --> Session : opens
  Media : +id
  Media : +title
  Player : +play()
  License : +expiry
```

## ER diagrams

`erDiagram`: entities appear in step order, relationships draw from the entity written first (`CUSTOMER ||--o{ ORDER` reveals
`CUSTOMER`, then `ORDER`). The example reads from the customer down to the supplier.

```mermaid live title="ER: customer orders and product suppliers"
erDiagram
  %% pa: 1=CUSTOMER 2=ORDER 3=LINE 4=PRODUCT 5=SUPPLIER
  CUSTOMER ||--o{ ORDER : places
  ORDER ||--|{ LINE : contains
  LINE }o--|| PRODUCT : lists
  PRODUCT }o--|| SUPPLIER : "supplied by"
```

Neither takes icons.

## Timelines, journeys, git graphs and Gantt charts

These have no edges to follow, so each steps through its items in reading order and `%% pa:` pins do nothing (as for sequence
diagrams). Section headers, axes, grids and legends stay visible.

- **`timeline`:** one step per time period, with its events. List periods in time order.

```mermaid live title="Timeline: product history in two phases"
timeline
  title Product history
  section Build
    2019 : Prototype
    2020 : Private beta : First customers
  section Grow
    2021 : Public launch
    2023 : Mobile apps : Offline mode
    2025 : Global rollout
```

- **`journey`:** one step per task: the task, its face, and the line segment that joins it to the task before.

```mermaid live title="User journey: watching a protected video"
journey
  title Watching a protected video
  section Find
    Open the app: 5: Viewer
    Pick a title: 4: Viewer
  section Play
    Wait for the license: 2: Viewer, App
    Playback starts: 5: Viewer
  section Finish
    Resume later: 4: Viewer
    Rate the title: 3: Viewer
```

- **`gitGraph`:** one step per commit in the order written, with the edge that ends on it. A branch's label and lane appear with
  its first commit.

```mermaid live title="Git graph: feature branch, merge and release"
gitGraph
  commit id: "init"
  branch feature
  commit id: "api"
  commit id: "ui"
  checkout main
  commit id: "fix"
  merge feature id: "m"
  branch release
  commit id: "v1"
```

- **`gantt`:** one step per task, top to bottom: write tasks in the order you want them to appear.

```mermaid live title="Gantt: plan, build and ship"
gantt
  dateFormat YYYY-MM-DD
  section Plan
    Scope :a1, 2024-01-01, 3d
    Design :after a1, 4d
  section Build
    Code :b1, 2024-01-08, 8d
    Review :after b1, 2d
  section Ship
    Test :2024-01-18, 4d
    Release :2024-01-22, 1d
```

None of these take icons. Only these small examples have been checked in a browser; long diagrams, `todayMarker`, tags, cherry-picks and
parallel tasks are untested.

## Everything else

Other Mermaid types (pie, quadrant, radar and the rest) render through Pele as usual. pele-animate is not designed for
them and its behavior on them is untested, so use plain Pele for those. Step mode has been checked in a browser on
the types above only; sequence diagrams have not been checked the same way yet.
