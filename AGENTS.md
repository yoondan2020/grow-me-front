# AGENTS.md

## 목적과 우선순위

이 파일은 Codex가 GrowMe 저장소를 일관되고 안전하게 수정하기 위한 개발 규칙입니다. 제품 요구사항은 [Grow Me 기획서](https://app.notion.com/p/418c465da7ba80659845d3996c6bca2e)와 승인된 Figma 화면을 기준으로 합니다. 이 파일은 코딩 지침이며 미확정 제품 규칙을 새로 결정하지 않습니다.

## 프로젝트 개요

- 프로젝트명: GrowMe
- 유형: 사용자의 목표와 습관 형성을 식물 성장으로 표현하는 서비스
- 대상: Web and Mobile App
- 언어: TypeScript
- 앱 프레임워크: React Native, Expo
- 라우팅: Expo Router
- 스타일링: React Native StyleSheet (NativeWind·Tailwind CSS는 사용하지 않으며 패키지와 설정도 제거됨)
- 주요 라이브러리: react-native-calendars(할 일 주간·월간 달력), react-native-reanimated(스플래시·물 주기 연출), expo-image
- 상태 저장: React Context 메모리 상태만 사용(새로고침 시 초기화). 영구 저장 방식은 결정 대기
- Backend / Database: TBD

## 현재 프로젝트 구조

Expo Router의 파일 기반 경로 구조와 현재 저장소를 우선합니다.

```
src/
├── app/                          # Expo Router 경로. 화면 조립만 담당
│   ├── _layout.tsx               # 테마 → GrowMeProvider → 스플래시 → Stack
│   ├── index.tsx                 # 홈 (식물만 표시, 하단 탭 유지)
│   ├── tasks.tsx                 # 할 일
│   ├── collection.tsx            # 도감 (연도별 구역·정렬 전환)
│   ├── profile.tsx               # 마이페이지
│   ├── terms.tsx                 # 이용약관
│   └── flower/[id].tsx           # 꽃 상세
├── components/                   # 두 화면 이상에서 쓰는 공통 UI
│   ├── ui/                       # ScreenFrame, PageHeading, ActionButton, AnimatedSplash(.web)
│   ├── navigation/               # BottomNavigation
│   └── plants/                   # Plant, PlantArt, PlantWateringEffect(완료 시 3초 물 주기 연출),
│                                 #   flowerImages(도감·상세 공용 꽃 이미지), plant.types
│                                 #   (필요할 때 생성: PlantAmbientMotion, PlantGrowthTransition, usePlantMotion)
├── features/                     # 한 화면 전용 컴포넌트·훅
│   ├── tasks/
│   │   ├── components/           # TaskCalendar(주간↔월간), TaskList, TaskFormSheet,
│   │   │                         #   TaskActionSheet, RepeatScopeSheet, BloomSheet
│   │   ├── hooks/                # useTaskSheets(시트 상태, 물 주기 → 개화 시트 순서)
│   │   └── calendarConfig.ts     # 달력 한국어 설정·테마·점 색상
│   ├── collection/components/    # CollectionEmpty, FlowerRecordCard
│   ├── flower-detail/components/ # FlowerInfoRow
│   └── profile/components/       # ProfileMenu
├── store/                        # 전역 상태와 화면 공용 계산
│   ├── GrowMeContext.tsx         # 할 일·매일 반복 할 일·꽃 상태와 액션 (최신 상태 ref로 완료 수 계산)
│   ├── taskSchedule.ts           # 날짜별 할 일, 하루 한도, 달력 점 상태, 월간 완료 수
│   └── flowerList.ts             # 도감 번호·월 순서·이미지 번호·연도 구역·정렬
├── hooks/usePlantStage.ts        # 홈·할 일 공용 식물 단계 훅
├── constants/theme.ts            # 토큰 파일(Expo 템플릿 값). 현재 화면에서는 사용하지 않음
└── utils/date.ts                 # 기기 현지 시간 기준 날짜 키(YYYY-MM-DD)·포맷 계산

assets/images/
├── growme/                       # 식물·꽃·상태바 이미지 (flower-daisy.png도 실제 그림은 블루벨)
└── nav/                          # 하단 탭 아이콘 ({화면}-{아이콘}.svg, 선택된 탭은 -active)
```

- 경로가 아닌 파일은 src/app에 두지 않습니다.
- 한 화면에서만 쓰는 코드는 features/{화면}/에, 두 화면 이상에서 쓰면 components/로 올립니다.
- 두 화면 이상에서 쓰는 UI가 아닌 계산 로직은 src/store(상태·도메인 계산), src/utils(날짜 등 범용 계산), src/hooks(공유 훅)에 둡니다.
- 날짜는 `src/utils/date.ts`의 `YYYY-MM-DD` 날짜 키로 다루고, 날짜 문자열을 화면에서 직접 자르거나 하드코딩하지 않습니다.
- 상태 변경은 GrowMeContext 액션으로만 하고, 날짜별 할 일·한도·월간 완료 수는 `taskSchedule.ts` 함수로 계산합니다.
- 빈 폴더나 빈 파일을 미리 만들지 않고, 첫 파일이 생길 때 폴더를 만듭니다.
- API 연결이 생기면 src/services, 화면 간 공유 타입이 늘어나면 src/types를 추가합니다.

기존 구조와 맞지 않는 src/screens 또는 src/navigation을 중복으로 만들지 않습니다. 구조를 변경해야 하면 먼저 기존 라우트와 사용처를 파악하고 변경 범위를 설명합니다.

## 코딩 규칙

### General

- TypeScript를 기본 언어로 사용합니다.
- 가능한 한 명확한 타입을 선언하고 any 사용을 지양합니다.
- 중복 로직은 공통 함수나 컴포넌트로 분리합니다.
- 기존 프로젝트의 코드 스타일과 Expo 설정을 우선합니다.
- 모든 앱 내비게이션은 Expo Router를 사용합니다.

### Naming

- 컴포넌트: PascalCase (파일명도 `ScreenFrame.tsx`처럼 PascalCase)
- Custom Hook 파일: `usePlantStage.ts`처럼 camelCase
- src/app 경로 파일: URL이 되므로 소문자 (`tasks.tsx`, `flower/[id].tsx`)
- 함수와 변수: camelCase
- 상수: UPPER_SNAKE_CASE
- Custom Hook: use 접두사

### Components

- 한 컴포넌트는 하나의 주요 역할을 담당합니다.
- 화면 경로 컴포넌트와 재사용 UI 컴포넌트를 구분합니다.
- 불필요하게 작은 컴포넌트로 나누지 않습니다.

## UI와 스타일링

- 모든 스타일은 React Native `StyleSheet.create`로 작성합니다. NativeWind `className`, Tailwind 유틸리티 클래스, 별도 CSS 파일은 사용하지 않습니다.
- 스타일 객체는 해당 컴포넌트 파일 하단의 `styles`에 두고, 두 곳 이상에서 쓰는 색상·간격 값은 `src/constants/theme.ts` 토큰으로 관리합니다.
- 공통 디자인 토큰을 우선하고 승인된 색상, 폰트, 간격을 임의로 바꾸지 않습니다.
- Figma 화면과 [DESIGN.md](./DESIGN.md)를 시각 기준으로 사용합니다.
- 기존 이미지 에셋을 먼저 확인합니다.
- 식물의 3D 아트 스타일은 정적 이미지로 표현합니다. 실제 3D 렌더링이나 조작 엔진은 추가하지 않습니다.
- 첫 홈 화면의 콘텐츠 영역에는 키우는 식물만 보여줍니다. 텍스트, 진행 수치, 카드, 할 일, 버튼 등 다른 화면 요소를 배치하지 않습니다. 하단 탭 내비게이션은 홈에서도 항상 표시합니다.
- iOS 안전 영역과 터치 동작을 우선 고려하고 Web에서도 공통 UI가 유지되도록 합니다.
- 색상만으로 상태를 전달하지 말고 라벨, 아이콘, 숫자, 모양을 함께 사용합니다.

### Figma AI 디자인 요청

디자인을 Figma AI로 다시 그릴 때 아래 요청을 최신 DESIGN.md와 첨부된 3D 식물 이미지 및 Toss 디자인 문서를 참고해 반영합니다.

> 다음 디자인.md 파일을 바탕으로 다시 그려줘. 첨부한 이미지처럼의 3d 모양을 내고 싶어. 그리고 첫 홈 화면에는 다른 내용이 아닌 내가 키우는 식물만 보이게 해줘.

첨부 자료는 시각 참고 자료입니다. GrowMe에 맞게 적용하고 Toss의 브랜드 색상, 로고, 고유 화면을 복제하지 않습니다.

## 개발 규칙

- 수정 전에 관련 코드와 현재 구조를 확인합니다.
- 기존 기능과 라우트에 미치는 영향을 확인합니다.
- 새 라이브러리 설치가 필요하면 목적, 대안, Expo 호환성을 설명하고 확인을 받습니다.
- API 로직은 화면 컴포넌트에서 분리합니다.
- 오류와 사용자 피드백 상태를 명시적으로 다룹니다.
- 불필요한 파일이나 추상화를 추가하지 않습니다.
- 미확정 제품 규칙을 임의로 확정하지 말고 질문 또는 결정 대기 항목으로 남깁니다.

## 작업 흐름

1. 요청 범위와 완료 조건을 파악합니다.
2. 관련 파일, 문서, 기존 구현을 확인합니다.
3. 변경 전 간단한 계획을 공유합니다.
4. 사용자의 결정이 필요한 사항은 구현 전에 묻습니다.
5. 승인된 범위에서 수정합니다.
6. 요청된 검증을 수행하고 변경 사항과 결과를 보고합니다.

## Git 규칙

- 논리적인 작업 하나당 커밋 하나로 나눕니다.
- 사용자의 명시적인 요청 없이 commit 또는 push하지 않습니다.
- 커밋 전에 staged 변경 사항을 검토합니다.

### 커밋 메시지

- 형식: `type: 작업 내용`
- 커밋 메시지는 한국어로, 짧고 내용을 알 수 있게 작성합니다.
- 사용하는 type:

| type | 용도 |
| --- | --- |
| feat | 새로운 기능 추가 |
| fix | 버그 수정 |
| refactor | 코드 구조 개선 |
| style | UI 및 코드 스타일 변경 |
| docs | 문서 수정 |
| chore | 설정 및 기타 유지보수 |

예: `feat: 할 일 완료 시 식물 성장 단계 반영`

## Expo 및 플랫폼 규칙

Expo API를 사용하는 코드 변경 전 package.json에서 Expo 주 버전을 확인하고 해당 버전의 Expo 문서를 참고합니다. Expo API는 버전마다 달라질 수 있으므로 기억에 의존하지 않습니다.

- iOS와 Android 디렉터리가 없으면 Expo Continuous Native Generation으로 생성되는 것으로 간주합니다. 해당 디렉터리를 직접 만들거나 수정하지 말고 app.json과 config plugin을 사용합니다.
- 네이티브 코드를 포함하는 라이브러리를 추가하면 Expo Go만으로 검증할 수 없을 수 있습니다. 개발 빌드 필요 여부를 확인합니다.
- Expo와 호환되는 패키지는 Expo가 권장하는 설치 방식을 우선합니다.
- Expo CLI 명령은 기존 프로젝트의 package manager와 lockfile에 맞춰 실행합니다.
- 프로젝트에 bun.lock이 있으면 bunx를 사용하고, 현재 저장소처럼 npm lockfile을 사용하면 기존 npm/Expo 명령 관례를 따릅니다.

