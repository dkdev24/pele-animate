---
title: 기여하기
description: 저장소를 설정하고, 검사를 실행하고, Tabler 팩을 다시 생성하는 방법을 설명합니다.
order: 15
section: 레퍼런스
---

# 기여하기

```sh
git clone https://github.com/dkdev24/pele-animate
cd pele-animate
pnpm install
pnpm test    # 문서와 README의 모든 Mermaid 예제를 Pele로 렌더링하고 아이콘 이름을 확인합니다
pnpm build   # 사이트를 빌드합니다 (사이트가 완성되기 전까지는 임시 결과입니다)
```

- 패키지는 저장소 루트의 일반 ESM이며 빌드 단계가 없습니다. 사이트는 `site/`에 있습니다.
- 문서는 `docs/`의 Markdown 파일입니다. `mermaid`로 표시한 펜스 블록은 반드시 렌더링되어야 하고, 그 안의 `@{ icon }` 이름은 모두 존재해야 합니다. 한국어 문서는 `docs/ko/`에 있으며, 영어 문서를 그대로 옮기는 것이 아니라 한국어 독자가 읽기 쉽게 다시 쓴 것입니다. 영어 페이지를 추가하면 같은 파일 이름으로 한국어 페이지도 추가해야 하고, 그렇지 않으면 `pnpm build`의 검사가 실패합니다.
- 펜스 규칙: ```` ```mermaid live ````는 GitHub에서도 그릴 수 있는 다이어그램이며 사이트에서는 애니메이션이 적용됩니다. `@{ icon }` 노드가 있는 다이어그램은 ```` ```mermaid-icons live ````를 사용합니다. GitHub의 Mermaid는 아이콘을 그리지 못해 "?" 박스로 표시하기 때문에, GitHub에서는 소스 텍스트로 보이고 사이트에서만 애니메이션이 적용됩니다.
- 모든 `live` 펜스에는 `live` 뒤에 제목을 붙입니다(`title="플로차트: 캐시 적중과 미적중"`). 플레이그라운드의 예제 메뉴에 페이지별로 묶여 표시되므로 "유형: 보여 주는 내용" 형식으로 적습니다.
- Tabler 팩은 생성된 파일입니다. `node scripts/build-tabler.mjs <tabler-icons 체크아웃 경로>`를 실행하면 `tabler/*.js`가 다시 만들어지며, 이 파일은 직접 수정하지 않습니다. Tabler 버전은 각 파일의 헤더와 `THIRD-PARTY-NOTICES.md`에 기록되어 있습니다.
- 사용자에게 보이는 변경이 있으면 `CHANGELOG.md`에 항목을 추가합니다.
- 버전은 `0.x`를 유지합니다.
- 예제 다이어그램은 일반적인 구성(클라이언트, API, 데이터베이스)으로 작성합니다.
