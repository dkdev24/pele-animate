---
title: 사용자 아이콘
description: registerGlyphs로 직접 만든 글리프를 등록합니다.
order: 5
section: 가이드
---

# 사용자 아이콘

직접 만든 아이콘은 `registerGlyphs`로 등록합니다.

```js
import { registerGlyphs, S, L } from 'pele-animate/glyphs';

registerGlyphs({
  'my-box': `<rect x="4" y="6" width="16" height="12" rx="2" fill="${L}" stroke="${S}"/>`,
});
```

등록한 뒤에는 Mermaid에서 `icon: "my-box"`처럼 사용하면 됩니다.

## 작성 규칙

- 글리프는 24×24 SVG의 **내부 마크업**입니다. `<svg>` 래퍼 없이 도형만 작성하며, 24×24 박스 안에 그려야 합니다.
- 색상은 `S`(진한 색)와 `L`(연한 색)을 사용합니다. 각각 CSS 변수 `--pa-solid`, `--pa-light`에 대체값을 붙인 것이며, 흰색은 `W`입니다. 이렇게 하면 글리프가 라이트 테마와 다크 테마를 따라갑니다([테마](./theming.md) 참고).
- `registerGlyphs(pack, strokeWidth = 1.1)`은 각 글리프를 해당 선 두께의 그룹으로 감쌉니다. Pele는 아이콘을 선 두께 2로 그리는데 큰 아이콘에서는 굵어 보이기 때문에, 글리프에는 더 얇은 값을 적용합니다.
- Tabler 팩처럼 `--pa-stroke`에 반응하는 선형 아이콘이라면 `registerTabler(pack, strokeWidth = 1.5)`를 사용할 수 있습니다. 채우기 없음, 둥근 끝과 모서리, 선 색상을 대신 설정해 줍니다.

## 이름

이미 있는 이름을 등록하면 기존 글리프를 대체합니다. Tabler의 접두사 없는 이름과 겹치지 않도록 직접 만든 팩에는 `acme-box`처럼 접두사를 붙이시기 바랍니다.

## 안전

글리프 마크업은 SVG로 페이지에 삽입됩니다. 신뢰할 수 있는 마크업만 등록하시기 바랍니다. 자세한 내용은 [보안](./security.md)을 참고하시기 바랍니다.
