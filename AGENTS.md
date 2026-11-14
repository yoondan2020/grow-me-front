This is an Expo/React Native mobile application. Prioritize mobile-first patterns, performance, and cross-platform compatibility.

## Expo has changed — do not trust your training data

Expo ships breaking changes every SDK release. APIs you remember are likely renamed, moved, or removed. Before writing any code that touches an Expo, EAS, or React Native API:

1. Read the major version of the `expo` package in `package.json`.
2. Fetch the matching versioned docs: `https://docs.expo.dev/versions/v<major>.0.0/`
3. For anything else, fetch https://docs.expo.dev/llms.txt — an index of all Expo docs with corrections to common LLM misconceptions. Follow its links to the specific page you need; never answer from memory.

## Commands

Use `bunx` instead of `npx` if the project uses bun (`bun.lock` present).

```bash
npx expo install <package>  # ALWAYS use instead of npm/yarn/pnpm/bun add — resolves SDK-compatible versions
npx expo start              # start the dev server
npx expo lint               # lint
npx tsc --noEmit            # typecheck
npx expo-doctor             # diagnose dependency and config issues
npx expo install --fix      # fix incompatible package versions
```

Run lint and typecheck before declaring any task done.

## Navigation & Routing

- Use **Expo Router** for all navigation. Routes live in `src/app/` — every file there is a screen, `_layout.tsx` files define navigators. Keep non-route code (components, hooks, utils) outside `src/app/`.
- Import `Link`, `router`, and `useLocalSearchParams` from `expo-router`.
- Docs: https://docs.expo.dev/router/introduction.md

## Building with EAS

Use EAS to build, sign, and submit the app in the cloud (`eas build`, `eas submit`) and to ship over-the-air updates (`eas update`) — no local Xcode or Android Studio required. Run EAS CLI as `bunx eas-cli <command>` in Bun projects, or `npx eas-cli@latest <command>` otherwise; substitute that for bare `eas` in docs examples.
Docs: https://docs.expo.dev/eas/index.md

## Rules

- If `ios/` and `android/` directories do not exist, they are generated (Continuous Native Generation). Never create or edit them by hand — configure native behavior in `app.json` and config plugins.
- Expo Go only includes its bundled native modules. After adding a library with native code, the app needs a development build: `npx expo run:ios|android` locally, or `eas build --profile development`.
- Prefer recommended Expo modules over third-party libraries, and check your available skills before adding dependencies. Docs: https://docs.expo.dev/versions/latest/index.md

# AGENTS.md

## 1. Project Overview
- Project Name: GrowMe
- Project Type: Personal Growth / Habit Tracking App
- Goal: 사용자의 목표와 습관 형성을 식물의 성장 과정으로 표현하는 서비스
- Target: Web and Mobile App

## 2. Tech Stack
- Language: TypeScript
- Framework: React Native
- Styling: NativeWind
- Design: Figma
- Backend: TBD
- Database: TBD

## 3. Project Structure
- src/components: 공통 UI 컴포넌트
- src/screens: 화면 단위 컴포넌트
- src/navigation: 화면 이동 및 네비게이션
- src/hooks: Custom Hooks
- src/services: API 통신
- src/store: 전역 상태 관리
- src/types: TypeScript 타입 정의
- src/constants: 상수 및 설정값
- src/assets: 이미지, 아이콘, 폰트

## 4. Coding Convention

### General
- TypeScript를 기본 언어로 사용한다.
- 가능한 한 명확한 타입을 선언한다.
- any 사용을 지양한다.
- 중복 코드는 공통 함수 또는 컴포넌트로 분리한다.
- 기존 프로젝트의 코드 스타일을 우선적으로 따른다.

### Naming
- Components: PascalCase
- Functions and Variables: camelCase
- Constants: UPPER_SNAKE_CASE
- Custom Hooks: use 접두사 사용

### Components
- 하나의 컴포넌트는 하나의 주요 역할을 담당한다.
- 화면 컴포넌트와 재사용 가능한 UI 컴포넌트를 구분한다.
- 불필요한 컴포넌트 분리는 지양한다.

## 5. UI / Styling Rules
- NativeWind를 사용한다.
- 가능한 한 공통 디자인 토큰을 활용한다.
- Figma 디자인을 기준으로 UI를 구현한다.
- 임의로 색상, 폰트, 간격을 변경하지 않는다.
- 이미지 에셋은 기존 assets를 우선적으로 사용한다.
- 플랫폼별 UI 차이를 고려한다.

## 6. Development Rules
- 기존 코드와 아키텍처를 먼저 파악한 후 수정한다.
- 기존 기능에 영향을 주지 않도록 한다.
- 새로운 라이브러리 설치 전 필요성을 설명하고 확인받는다.
- API 호출 로직은 UI 컴포넌트와 분리한다.
- 오류 처리를 명시적으로 구현한다.
- 불필요한 코드 및 파일을 생성하지 않는다.

## 7. Working Process
1. 작업 요청을 분석한다.
2. 관련 파일과 기존 구현을 확인한다.
3. 구현 계획을 간략하게 설명한다.
4. 사용자 확인이 필요한 사항은 먼저 질문한다.
5. 승인된 범위에서 코드를 수정한다.
6. 변경 사항과 테스트 결과를 보고한다.

## 8. Git Convention
- 의미 있는 단위로 커밋한다.
- 기존 Git 커밋 메시지 규칙을 따른다.
- 요청 없이 commit 또는 push하지 않는다.
