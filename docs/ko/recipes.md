---
title: 레시피
description: Vite, SvelteKit, Astro, Nuxt, React, 일반 HTML에서 pele-animate를 쓰는 방법과 검증한 범위를 설명합니다.
order: 8
section: 가이드
---

# 레시피

Pele와 pele-animate는 DOM이 필요하므로 어떤 프레임워크에서든 원칙은 같습니다. **페이지가 렌더링된 뒤에 클라이언트에서 마운트해야 합니다.** 서버 렌더링이 이 패키지를 건드리지 않도록, 프레임워크의 마운트 훅 안에서 동적 `import()`로 불러오시기 바랍니다.

기본 형태는 항상 다음과 같습니다.

```js
const [{ mount }, { watch, prepare }, { icons }] = await Promise.all([
  import('pele'),
  import('pele-animate'),
  import('pele-animate/glyphs'),
  import('pele-animate/tabler/computers'), // 사용할 아이콘 카테고리
  import('pele-animate/style.css'),
]);
mount(el, prepare(src), { icons });
watch(el, src);
```

| 프레임워크 | 상태 | 코드를 두는 곳 |
|---|---|---|
| 일반 HTML / Vite | 검증함 | [시작하기](./getting-started.md)와 같은 모듈 스크립트 |
| Astro | 운영 환경에서 검증함 (DoveRunner 문서 사이트) | 다이어그램 요소를 찾는 클라이언트 `<script>` |
| SvelteKit 3 | 검증함 (빌드와 브라우저, static 어댑터) | 페이지 또는 컴포넌트의 `onMount(async () => { ... })` |
| Nuxt 4 | 검증함 (빌드와 브라우저, static generate) | `.client.vue` 컴포넌트의 `onMounted` |
| React / Next.js | 검증하지 않음 | `useEffect`를 쓰는 클라이언트 컴포넌트(`'use client'`) |
| Vue (Nuxt 제외) | 검증하지 않음 | `onMounted` |

모든 프레임워크에 공통으로 적용되는 참고 사항입니다.

- 다이어그램마다 Mermaid 소스를 담은 별도 요소(`<pre>` 또는 `<div>`)를 두고, 요소마다 `mount`와 `watch`를 한 번씩 호출합니다.
- 새로고침 없이 페이지가 바뀌는 경우(클라이언트 사이드 라우팅)에는 새 요소에 대해 다시 마운트합니다.
- CSS(`pele-animate/style.css`)는 한 번만 import하면 됩니다. TypeScript에서는 CSS를 부수 효과로 import하려면 `*.css` 모듈 선언이 필요합니다(Vite 프로젝트는 `vite/client`에서 받습니다).
- 정적 사이트 생성기도 문제없습니다. 서버가 필요한 부분은 없습니다.

## Astro

```astro
<pre class="mermaid" set:text={src}></pre>
<script>
  // 브라우저에서만 실행됩니다
  import { mount } from 'pele';
  import { watch, prepare } from 'pele-animate';
  import { icons } from 'pele-animate/glyphs';
  import 'pele-animate/tabler/computers';
  import 'pele-animate/style.css';
  document.querySelectorAll('pre.mermaid').forEach((el) => {
    const src = el.textContent ?? '';
    mount(el as HTMLElement, prepare(src), { icons });
    watch(el as HTMLElement, src);
  });
</script>
```

## SvelteKit

```svelte
<script>
  import { onMount } from 'svelte';
  let el;
  const src = 'flowchart LR\n  A --> B';
  onMount(async () => {
    const [{ mount }, { watch, prepare }, { icons }] = await Promise.all([
      import('pele'), import('pele-animate'), import('pele-animate/glyphs'), import('pele-animate/style.css'),
    ]);
    mount(el, prepare(src), { icons });
    watch(el, src);
  });
</script>
<div bind:this={el}></div>
```
