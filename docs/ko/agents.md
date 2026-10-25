---
title: 코딩 에이전트용 가이드
description: 코딩 에이전트가 프로젝트에서 pele-animate를 사용하는 방법과 결과를 검증하는 방법을 설명합니다.
order: 14
section: 레퍼런스
---

# 코딩 에이전트용 가이드

AI 코딩 에이전트로서 프로젝트에 pele-animate를 추가한다면 패키지에 포함된 스킬을 사용하시기 바랍니다. 아래 규칙이 작업에 맞는 순서로 담겨 있습니다.

## 스킬 설치

스킬은 npm 패키지에 들어 있으므로 `npm i pele-animate`를 실행하면 `node_modules/pele-animate/skills/pele-animate/SKILL.md`에 있습니다. Claude Code에서는 스킬을 두는 위치로 복사합니다.

```sh
mkdir -p .claude/skills
cp -r node_modules/pele-animate/skills/pele-animate .claude/skills/
```

[GitHub](https://github.com/dkdev24/pele-animate/tree/main/skills/pele-animate)에서 스킬 폴더만 받아도 됩니다(`SKILL.md`, `verify.js`, `references/`가 들어 있습니다).

두 번째 스킬인 `diagram-step-order`는 페이지의 다이어그램을 검토해서 단계 순서가 주변 본문과 맞도록 합니다.

스킬을 지원하지 않는 환경이라면 다음 내용을 지침 파일에 붙여 넣으시기 바랍니다. 에이전트가 읽는 지침이므로 영어 그대로 두었습니다.

```md
## Diagrams (pele-animate)
- Animated Mermaid diagrams use `pele` + `pele-animate`; mount on the client only (see node_modules/pele-animate/docs or the README).
- Icon names must exist: read node_modules/pele-animate/tabler/<category>.js. Never invent names. Unknown names render a plain square.
- Order with `%% pa: 1=A 2=B,C`; check svg.paSteps in a browser.
- Verify by rendering the page and confirming no unexpected rounded-square icons.
```

## 규칙

1. **클라이언트에서만 사용합니다.** 서버 코드에서 `pele`나 `pele-animate`를 import하지 않으며, 프레임워크의 마운트 훅을 사용합니다([레시피](./recipes.md)).
2. **아이콘 이름을 지어내지 않습니다.** `node_modules/pele-animate/tabler/<category>.js`(객체 키)에서 찾아서 해당 카테고리를 import합니다. 알 수 없는 이름은 오류가 나지 않고 둥근 사각형으로 표시되므로, 지어낸 이름은 눈에 띄지 않는 버그가 됩니다.
3. **세 가지를 import합니다.** `pele-animate/glyphs`(`icons`), 사용하는 아이콘 팩 모듈, `pele-animate/style.css`입니다.
4. **기본 순서가 맞지 않으면** `%% pa:`로 순서를 고정합니다([단계 순서](./step-order.md)). 핀을 지정한 뒤에는 노드 id를 바꾸지 않습니다.
5. **코드를 읽는 데서 그치지 않고 브라우저에서 검증합니다.**

## 검증

헤드리스 브라우저(Playwright 또는 CLI 브라우저)에서 페이지를 렌더링한 뒤 페이지 안에서 다음 코드를 실행합니다.

```js
(() => {
  const svgs = [...document.querySelectorAll('.pa-scene svg.pele')];
  const icons = [...document.querySelectorAll('.pa-scene svg.pele-icon[data-icon]')];
  return {
    diagrams: svgs.length,
    steps: svgs.map((s) => s.paSteps?.length ?? 0),
    emptyIcons: icons.filter((i) => !i.innerHTML.trim()).map((i) => i.dataset.icon),
  };
})()
```

`diagrams`는 추가한 다이어그램 수와 같아야 하고, `steps`의 모든 항목은 0보다 커야 하며, `emptyIcons`는 비어 있어야 합니다. 등록되지 않은 이름은 아무것도 그리지 않는 대신 둥근 사각형으로 표시되므로, Mermaid에 쓴 아이콘 이름을 팩 소스와도 비교하시기 바랍니다.
