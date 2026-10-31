---
title: 호환성
description: 지원하는 Pele 버전과 브라우저, 그리고 pele-animate가 의존하는 Pele 마크업을 설명합니다.
order: 10
section: 레퍼런스
---

# 호환성

| | 지원 범위 |
|---|---|
| Pele | `^1.7.0`(피어 의존성). 1.7(문서 사이트), 1.8, 1.9로 검증했습니다. |
| 다이어그램 유형 | 플로차트, 시퀀스 다이어그램, 아키텍처, 상태, C4 컨텍스트, 블록, 클래스, ER 다이어그램, 타임라인, 저니, 깃 그래프, 간트 차트 ([다이어그램 유형](./diagram-types.md)) |
| 브라우저 | Web Animations API, `IntersectionObserver`, `matchMedia`를 지원하는 최신 브라우저(Chrome, Edge, Firefox, Safari). `IntersectionObserver`가 없으면 인트로가 즉시 재생됩니다. |
| 모듈 형식 | ESM만 지원 |
| 서버 렌더링 | 해당 없음. 클라이언트에서 마운트합니다 ([레시피](./recipes.md)) |

## pele-animate가 Pele에 의존하는 부분

pele-animate는 Pele가 만든 SVG를 읽으며, 다음 클래스 이름과 속성을 기준으로 요소를 선택합니다.

`.pele-node`, `.pele-edge`, `.pele-edge-label`, `.pele-marker`, `.pele-cluster-label`, `.pele-icon`, `.pele-lifeline`, `.pele-actor-participant`, 그리고 `data-id` 속성입니다.

Pele 관리자는 이 이름을 바꿀 계획이 없다고 밝혔지만, 릴리스가 바뀌어도 안정적으로 유지된다는 공식적인 약속은 없습니다. Pele를 피어 의존성으로 둔 이유도 여기에 있습니다. 업그레이드는 의도적으로 진행하고, 이후에 다이어그램을 다시 확인하시기 바랍니다. 저장소의 테스트는 모든 문서 예제를 렌더링해서 파싱 오류는 잡아내지만, 화면상의 변화는 잡아내지 못합니다.

## 알려진 제한

- 시퀀스 다이어그램의 참여자는 `@{ icon }`을 무시합니다.
- 단계 모드는 플로차트만 브라우저에서 검증했습니다.
- 글리프 그림은 정사각형 박스를 기준으로 하며, 가로로 넓은 그림은 정사각형 안에 넓은 도형으로 그려집니다.
