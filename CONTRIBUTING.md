# 기여 가이드

브라우저에서 열리는 Windows 11 데스크톱. React + TypeScript + Vite로 만들고
GitHub Pages로 배포한다.

---

## 개발 환경

### Node 26

이 저장소는 **Node 26 이상**을 요구한다. 세 곳이 맞물려 있다.

| 파일 | 역할 |
|---|---|
| `.node-version` | 버전의 단일 출처. 버전을 올릴 때 여기만 고친다 |
| `package.json` 의 `engines` | 요구 버전 선언 |
| `.npmrc` 의 `engine-strict=true` | 어긋나면 **오류로 중단** |

버전이 낮으면 `npm ci`가 경고가 아니라 `EBADENGINE` 오류로 멈춘다. 의도한
동작이다 — 조용히 잘못된 버전으로 도는 것보다 낫다.

`nvm`, `fnm`, `asdf` 같은 버전 매니저는 `.node-version`을 읽으므로 저장소로
들어가면 알아서 맞춰준다.

### 설치

```bash
npm ci      # lockfile 그대로 재현. npm install 대신 이걸 쓴다
```

### 명령어

```bash
npm run dev         # 개발 서버 (http://localhost:5173)
npm run lint        # oxlint
npm run lint:fix    # 고칠 수 있는 것만 자동 수정
npm test            # 테스트 1회 실행
npm run test:watch  # 파일 변경 감지하며 실행
npm run build       # tsc -b && vite build (타입 체크 포함)
npm run preview     # 빌드 결과를 로컬에서 확인
```

---

## 브랜치 전략 — GitHub Flow

`main` 하나와 짧게 사는 작업 브랜치만 쓴다. `develop`, `release`,
`hotfix` 브랜치는 두지 않는다.

```
main  ──●──────●──────●──  항상 배포 가능한 상태
         └─●─●─┘
           작업 브랜치
```

**Git Flow를 쓰지 않는 이유**: Git Flow의 `release` 브랜치는 출시 시점을
고정하고 준비 기간을 갖기 위한 것이고, `hotfix`는 이미 나간 버전을 고치기
위한 것이다. 이 프로젝트는 `main`에 머지하면 약 40초 뒤 배포되고, 되돌리는
것도 같은 시간이면 된다. 버전을 매기지도 않는다. 그 브랜치들이 할 일이 없다.

### 브랜치 이름

```
feat/win11-tabs        새 기능
fix/cd-dots            버그 수정
chore/deps-bump        의존성·설정·잡무
docs/contributing      문서
test/explorer-nav      테스트만 추가
```

`main`에서 갈라져 나오고, 머지되면 지운다. 저장소 설정에 자동 삭제가 켜져
있어 PR을 머지하면 브랜치는 알아서 사라진다.

---

## 작업 흐름

```
1. main에서 브랜치 생성       git switch -c feat/무엇을
2. 작업하고 커밋
3. 브랜치에 푸시              git push -u origin feat/무엇을
4. PR 생성                    CI가 자동으로 돈다
5. CI 통과 확인 후 머지       squash 머지
6. 자동 배포                  약 40초
```

`main`에 직접 푸시하지 않는다. 모든 변경은 PR을 거친다.

### 머지 방식

**squash 머지**를 쓴다. 작업 중의 지저분한 중간 커밋이 `main`에 남지 않고
PR 하나가 커밋 하나가 되어, 이력이 "무엇을 왜 바꿨는가" 목록으로 읽힌다.

---

## 커밋 메시지

한국어로 쓴다. 제목은 **무엇을 했는지**, 본문은 **왜 그렇게 했는지**.

```
cd... 이 여러 단계 위로 가도록 수정

cmd에서 점 n개는 n-1단계 위를 뜻한다. cd..은 한 단계, cd...은
두 단계다. 붙여쓰기 형태는 받아들이면서도 인자로 넘긴 "..."을
resolvePath가 이름이 점 세 개인 폴더로 취급해 실패했다.

expandDots로 점 n개를 미리 펼친다. 이건 cmd의 셸 문법이지
Windows 경로 문법이 아니라서, filesystem이 아니라 터미널 쪽에 둔다.
```

- 제목은 50자 안팎, 마침표 없이
- 본문은 72자에서 줄바꿈
- **무엇을 바꿨는지는 diff를 보면 안다.** 본문에는 diff가 말해주지 않는
  것을 쓴다 — 왜 이 방법을 골랐는지, 무엇을 시도했다가 접었는지,
  어떤 함정이 있었는지

`feat:`, `fix:` 같은 접두사는 쓰지 않는다. 브랜치 이름에서 이미 드러난다.

---

## 코드 구조

```
src/
  main.tsx            진입점
  App.tsx             셸 조립 (바탕화면 + 창 + 작업표시줄 + 플라이아웃)

  os/                 운영체제 껍데기
    filesystem.ts     가상 파일시스템 — 세 앱이 공유하는 단일 트리
    WindowManager.tsx 창 상태 (위치·크기·z순서·최소화)
    System.tsx        테마·밝기·전원
    Taskbar.tsx       작업표시줄
    StartMenu.tsx     시작 메뉴
    TaskView.tsx      작업 보기
    Desktop.tsx       바탕화면 아이콘과 우클릭 메뉴
    ContextMenu.tsx   컨텍스트 메뉴 (공용)
    icons.tsx         SVG 아이콘 모음
    iconSizes.ts      Windows 규격 아이콘 크기 상수
    appMeta.ts        앱 메타데이터 — 순환 참조를 피하려고 분리돼 있다

  apps/               앱
    Explorer.tsx      파일 탐색기
    explorerNav.ts    탐색기의 순수 로직 (이력·브레드크럼·필터)
    Terminal.tsx      명령 프롬프트 (React 껍데기)
    terminalCommands.ts  명령 해석기 — 여기에 실제 로직이 있다
    Notepad.tsx       메모장

  styles/
    tokens.css        디자인 토큰 (색·크기·그림자)
    os.css            나머지 전부
```

### 핵심: `filesystem.ts`

탐색기·메모장·터미널이 **같은 트리 하나**를 본다. 어디서 바꾸든 즉시
서로에게 반영되고 `localStorage`에 저장된다. 여기가 깨지면 앱 전체가
깨지므로, 손댈 때는 테스트를 먼저 확인한다.

---

## 테스트

`vitest`를 쓴다. 브라우저 API는 `src/test/setup.ts`에서 `localStorage`만
흉내 내고 `environment: "node"`로 돌린다 — `jsdom`을 들이지 않았다.

### 방침: 순수 로직을 분리해서 검사한다

React 컴포넌트를 렌더링해 검사하는 대신, **렌더링과 무관한 로직을 별도
모듈로 빼서** 직접 호출한다.

| 컴포넌트 | 분리된 로직 |
|---|---|
| `Terminal.tsx` | `terminalCommands.ts` — 부수효과를 `TerminalHost`로 주입받는다 |
| `Explorer.tsx` | `explorerNav.ts` — 이력 스택·브레드크럼·필터 |

시각·상호작용 부분(클릭, 드래그, 키보드)은 아직 검사하지 않는다. 넣으려면
`jsdom` + Testing Library 도입을 먼저 정해야 한다.

### 싱글턴 주의

`filesystem.ts`는 모듈 로드 시점에 스토어를 만든다. 테스트마다
`vi.resetModules()` 후 다시 `import`해서 상태가 새지 않게 한다.

```ts
async function freshFs() {
  localStorage.clear();
  vi.resetModules();
  return import("./filesystem");
}
```

### 통과만으로는 부족하다

테스트를 쓴 뒤에는 **일부러 소스를 망가뜨려 잡히는지 확인한다.** 이 방법으로
실제 공백을 여러 번 찾았다 — 예를 들어 `resolvePath`에서 `..`이 깊이보다
많고 뒤에 경로가 이어지는 경우가 비어 있었다.

```bash
# 예: 조건을 뒤집고 테스트가 실패하는지 본다
# 실패하지 않으면 그 부분은 검사되지 않고 있다는 뜻
```

---

## 린트

`oxlint`를 쓴다. `correctness`와 `suspicious`가 `error`라 위반이 있으면
종료 코드 1로 CI가 막는다.

**ESLint를 쓰지 않는 이유**: `typescript-eslint`가 TypeScript 7을 런타임에서
명시적으로 거부한다. canary까지 peer가 `<6.1.0`이고 업스트림은 아직 지원
계획 단계다. `oxlint`는 TypeScript 컴파일러 API를 쓰지 않아 이 문제가 없다.

### 예외 처리

규칙을 끌 때는 `.oxlintrc.json`에 **이유를 주석으로 남긴다.**

한 줄만 예외로 둘 때는 위치가 중요하다. 진단이 걸리는 줄 바로 위여야 한다.
예를 들어 `exhaustive-effect-dependencies`는 `useEffect` 호출이 아니라
**의존성 배열**에 걸리므로, 예외 주석도 그 줄 위에 와야 한다.

```ts
useEffect(() => {
  // ...
  // 이유를 여기에 적는다
  // oxlint-disable-next-line react-hooks/exhaustive-deps
}, [deps]);
```

접두사는 `oxlint-`를 쓴다. `eslint-`도 호환 처리되어 동작하지만, 이
저장소는 ESLint를 쓰지 않으므로 읽는 사람이 죽은 주석으로 오해한다.

---

## 아이콘

**이미지 파일을 쓰지 않는다.** 모든 아이콘은 `src/os/icons.tsx`의 인라인
SVG 컴포넌트다. 저장소에 `.png`, `.ico`, `.svg` 파일이 하나도 없다.

### 단색 UI 아이콘 — Fluent UI System Icons (MIT)

메뉴·트레이·도구 모음에 쓰는 단색 아이콘은 Microsoft가 오픈소스로 공개한
[Fluent UI System Icons](https://github.com/microsoft/fluentui-system-icons)
의 **20px Regular** 경로를 그대로 가져온 것이다. MIT 라이선스라 재배포에
제약이 없고, 고지는 `THIRD-PARTY-NOTICES.md`에 있다.

패키지를 의존성으로 두지 않고 경로 데이터만 소스에 인라인했다. 45개를
쓰자고 2만 개짜리 패키지를 번들에 넣을 이유가 없다.

새 아이콘이 필요하면 이렇게 꺼낸다.

```bash
npm pack @fluentui/svg-icons          # 또는 GitHub에서 직접 받는다
# icons/<이름>_20_regular.svg 의 <path d="..."> 만 옮긴다
```

이름을 고를 때는 **Fluent의 이름이 아니라 화면에서 뜻하는 바**를 기준으로
고른다. 예를 들어 탐색기의 "이름 바꾸기"에는 `rename`이 아니라 `edit`을
썼다 — Fluent의 `rename`은 문자열 편집 상자를 뜻하는 글리프라 16px에서
무엇인지 읽히지 않는다.

### 직접 그리는 것

두 종류만 직접 그린다. Fluent 세트에 없기 때문이다.

| 대상 | 이유 |
|---|---|
| 컬러 앱 아이콘 (폴더·탐색기·메모장·터미널·휴지통·드라이브) | 제품 아이콘은 상표라 오픈소스 세트에 없다 |
| 창 제어 단추 글리프 (최소화·최대화·복원·닫기) | Windows 11은 여기에 Segoe Fluent Icons **폰트**를 쓴다. Fluent의 `subtract`/`square`/`dismiss`를 10px로 줄여 비교해 보니 안쪽 여백 때문에 눈에 띄게 작고 흐려져 오히려 실물에서 멀어진다 |

컬러 앱 아이콘은 `viewBox="0 0 48 48"`로 그린다.

### Windows에서 추출한 자산은 쓰지 않는다

`.ico`, `.png` 어느 쪽이든 Windows에서 뽑아낸 아이콘은 넣지 않는다.
Windows 사용권은 "이 PC에서 Windows를 실행할 권리"를 줄 뿐 구성 요소를
분리해 재배포할 권리를 주지 않는다. 공개된 사이트에 올리는 순간
공중송신에 해당해 저작권 문제가 된다.

실물을 참고하는 것 자체는 괜찮다. 형태와 색을 **보고 다시 그리면** 된다 —
보호되는 것은 아이디어가 아니라 그 아이디어를 구현한 구체적 표현이다.

### 크기는 Windows 규격을 따른다

`src/os/iconSizes.ts`의 상수를 쓴다. 숫자를 직접 적지 않는다.

| 상수 | 값 | 쓰는 곳 |
|---|---|---|
| `ICON.small` | 16 | 메뉴·트레이·목록·제목 표시줄 |
| `ICON.medium` | 24 | 작업표시줄 |
| `ICON.large` | 32 | 시작 메뉴 고정 앱 |
| `ICON.extraLarge` | 48 | 바탕화면, 탐색기 "보통 아이콘" |

Fluent 아이콘의 기준 크기로 20px을 고른 이유는 그 크기에 가장 많은
아이콘이 갖춰져 있고(2,800여 개) Windows 11 셸이 실제로 쓰는 크기이기
때문이다. `viewBox`가 20이라 16·24·32 어디로 그려도 비율은 유지된다.

### currentColor

단색 아이콘은 색을 `currentColor`로 둔다. 테마가 바뀌면 색이 자동으로
따라간다. Fluent 아이콘은 선이 아니라 채워진 도형이라 `stroke`가 아니라
`fill`에 건다 — `Fluent` 헬퍼가 처리한다. 이미지 파일로 바꾸면 이게
깨진다.

---

## CI와 배포

### `.github/workflows/ci.yml`

PR과 `main` 푸시에서 돈다. 세 단계를 **앞이 실패해도 마저 돌려** 한 번에
전체 상태를 본다.

```
npm ci  →  npm run lint  →  npm test  →  npm run build
```

`npm ci`가 실패하면 나머지는 건너뛴다. 의존성이 없는데 돌려봐야 의미 없는
오류만 쌓인다.

### `.github/workflows/deploy.yml`

`main` 푸시에서 돈다. `dist/`만 GitHub Pages에 올린다 — **소스 파일은
사이트에 노출되지 않는다.**

두 워크플로를 분리한 이유는 Actions 목록에서 "배포가 실패한 것"과 "검사가
실패한 것"을 구분하기 위해서다.

---

## 사람이 아닌 협업자

`.claude/` 에 Claude Code용 설정이 들어 있다.

- `settings.json` — SessionStart 훅 등록
- `hooks/session-start.sh` — 웹 세션에서 Node 26을 설치하고 `npm ci`까지

`.gitignore`는 `.claude/` 하위를 기본적으로 제외하되 이 둘만 예외로
열어두었다. 로컬 설정(`settings.local.json`)과 `CLAUDE.md`는 계속 제외된다.
