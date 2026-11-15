# GrowMe

할 일을 완료하며 식물을 키우고, 한 달 동안 모은 완료로 꽃을 피워 도감에 모으는 자기 성장 서비스입니다. Expo(React Native) 기반으로 iOS·Android·Web을 함께 지원합니다.

- 기술: TypeScript, Expo SDK 58, React Native 0.88, Expo Router
- 스타일: React Native `StyleSheet` (NativeWind·Tailwind CSS 미사용)
- 주요 라이브러리: react-native-calendars(할 일 달력), react-native-reanimated(스플래시·물 주기 연출), expo-image
- 저장: 아직 없음. 모든 데이터는 앱 메모리에만 있어 새로고침하거나 앱을 다시 켜면 초기화됩니다.

## 실행 방법

1. 의존성을 설치합니다.

   ```bash
   npm install
   ```

2. 개발 서버를 시작합니다. Web으로 바로 열려면 `--web`을 붙입니다.

   ```bash
   npx expo start
   ```

   ```bash
   npx expo start --web
   ```

3. 설정을 바꾼 뒤(예: NativeWind 제거 이후) `react-native-css-interop`를 찾을 수 없다는 오류가 나면 Metro 캐시를 지우고 다시 시작합니다.

   ```bash
   npx expo start --clear
   ```

`npm run reset-project`는 Expo 템플릿에서 남은 스크립트로, 실행하면 현재 화면 코드를 example 폴더로 옮기고 `src/app`을 비웁니다. 이 프로젝트에서는 실행하지 않습니다.

## 주요 기능

- **홈**: 이번 달 완료 수에 따라 자라는 식물을 보여줍니다. 콘텐츠 영역에는 식물만 두고 하단 탭은 항상 표시합니다.
- **할 일**
  - 월요일 시작 주간 달력이 기본이며 '월간 보기'로 펼칠 수 있습니다. 완료한 날은 파란 점, 할 일만 있고 완료하지 않은 날은 회색 점으로 표시합니다.
  - 하루 최대 5개(매일 반복 포함)까지 등록하고, 지난 날짜에도 추가·완료할 수 있습니다.
  - '매일 반복'과 종료일을 지정할 수 있고, 반복 할 일은 '이 날만'/'이 날 이후 모두' 범위로 수정·삭제합니다.
  - 수정할 때 날짜(반복이면 시작일·종료일)를 바꿀 수 있습니다.
  - 완료하면 식물에 물을 주는 3초 연출이 나오고, 20번째·이후 10번째마다 꽃이 핍니다.
- **도감**: 개화 기록을 연도별 구역으로 보여주며 최신순·오래된순을 전환합니다. 꽃 상세에서 도감 번호, 개화일, 월 완료 수를 확인합니다.
- **마이페이지**: 이용약관 등 서비스 정보 메뉴를 제공합니다.

## 문서

| 문서 | 내용 |
| --- | --- |
| [AGENTS.md](./AGENTS.md) | 저장소 구조, 코딩·스타일링·Git 규칙 |
| [PRD.md](./PRD.md) | 제품 범위와 핵심 규칙, 화면 요구사항 |
| [DESIGN.md](./DESIGN.md) | 디자인 토큰, 컴포넌트·화면별 디자인 규칙 |
| [API_SPEC.md](./API_SPEC.md) | API 논의용 리소스·엔드포인트 초안 |
| [TASK.md](./TASK.md) | 진행 상황과 남은 작업, 결정 대기 항목 |

## 스타일링 규칙

모든 디자인은 React Native `StyleSheet.create`로 작성합니다. NativeWind, Tailwind 유틸리티 클래스(`className`), CSS 파일은 사용하지 않습니다. 자세한 규칙은 [DESIGN.md](./DESIGN.md)와 [AGENTS.md](./AGENTS.md)를 따릅니다.
