---
title: API 레퍼런스
description: pele-animate가 내보내는 모든 항목을 타입과 함께 정리했습니다.
order: 9
section: 레퍼런스
---

# API 레퍼런스

TypeScript 타입은 패키지에 포함되어 있습니다(`types/`).

## `pele-animate`

| 내보내기 | 시그니처 | 설명 |
|---|---|---|
| `watch` | `watch(container: HTMLElement, source?: string, options?: { autoplay?: boolean; interval?: number; hold?: number }): void` | 컨테이너를 장면(`pa-scene`)으로 표시하고, Pele가 그 안에 렌더링하는 SVG마다 애니메이션을 적용하며, 크기 변경으로 Pele가 다시 배치하면 다시 적용합니다. `autoplay`(또는 `%% pa:` 주석의 `autoplay`)를 지정하면 스크롤 인트로 대신 화면에 보이는 즉시 단계 모드를 반복 재생합니다. `interval`(기본값 1200 ms)과 `hold`(마지막 단계에서 기본값 2400 ms)는 재생 타이밍을 정합니다. |
| `prepare` | `prepare(source?: string): string` | 아이콘 노드의 레이블에 여백을 채워서 Pele가 아이콘 크기(`h`) 이상의 폭으로 박스를 배치하도록 한 Mermaid 소스를 돌려줍니다. 결과는 `mount()`에, 원본 소스는 `watch()`에 전달합니다. 이를 거치지 않으면 레이블이 아이콘보다 짧을 때 엣지 끝과 화살촉이 아이콘 밑에 들어갑니다. |
| `animate` | `animate(svg: SVGSVGElement, options?: { hover?: Element; source?: string }): void` | 렌더링된 SVG 하나에 애니메이션을 적용합니다. `source`는 `%% pa:` 핀을 읽는 데 쓰이며, `svg.paSteps`를 설정합니다. |
| `parseOrder` | `parseOrder(source?: string): Map<string, number>` | `%% pa:` 주석을 파싱하여 노드 id(엣지는 `'X>Y'`)에서 0부터 시작하는 단계 번호로 대응시킨 `Map`을 돌려줍니다. |

`svg.paSteps`(타입 `PaStep[]`, `PaStep = Array<[element: Element, parts: Element[]]>`)는 `animate()`가 설정하며 단계마다 하나씩 배열이 담깁니다.

## `pele-animate/glyphs`

| 내보내기 | 시그니처 | 설명 |
|---|---|---|
| `icons` | `icons(name: string): string` | Pele의 `icons` 리졸버입니다. 알 수 없는 이름에는 무난한 둥근 사각형을 돌려줍니다. |
| `registerGlyphs` | `registerGlyphs(pack: Record<string, string>, strokeWidth?: number): void` | 글리프를 추가합니다(`{ name: '<24x24 SVG의 내부 마크업>' }`). 선 두께 기본값은 1.1입니다. |
| `registerTabler` | `registerTabler(pack: Record<string, string>, strokeWidth?: number): void` | 선 두께가 `--pa-stroke`를 따르는 아웃라인 아이콘을 추가합니다(대체값은 `strokeWidth`, 기본값 1.5). |
| `S`, `L`, `W` | `string` | 글리프 마크업에 쓰는 테마 색상 표현식입니다. 각각 진한 색, 연한 색, 흰색입니다. |

## `pele-animate/tabler/<category>`

모듈을 import하면 해당 카테고리의 아이콘이 등록되며, `pack: Record<string, string>`(이름에서 내부 마크업으로)도 함께 내보냅니다. 카테고리 목록은 [아이콘](./icons.md)에 있습니다.

## `pele-animate/preset-doverunner`

import하면 `doverunner-*` 글리프 20개가 등록됩니다. 내보내는 항목은 없습니다.

## `pele-animate/style.css`

장면 프레임, 움직임, 단계 컨트롤의 스타일이며 한 번만 import하면 됩니다.

## 볼 수 있는 클래스

`pa-scene`(컨테이너), `pa-ready`(애니메이션이 적용된 SVG), `pa-in`과 `pa-done`(인트로 상태), `pa-stepping`(단계 모드), `pa-controls`(버튼 바)가 있습니다. 이 클래스는 내부용이라 바뀔 수 있으므로, 직접 지정하기보다는 [테마](./theming.md)의 CSS 변수를 사용하시기 바랍니다.
