# 🚌 BustleBus Mobile - React Native App

> **React Native + Expo 기반 모바일 버스 정보 애플리케이션**

## 📱 프로젝트 소개

BustleBus Mobile은 **React Native**와 **Expo**를 활용하여 개발된 크로스플랫폼 모바일 애플리케이션입니다. 실시간 버스 정보를 제공하며, WebView를 통해 React 웹 대시보드와 통신하는 하이브리드 아키텍처를 구현했습니다.

---

## 🎯 핵심 기술 스택

### **Framework & Tools**

- **React Native**: 0.81.5
- **Expo**: 54.0
- **TypeScript**: 5.9
- **Navigation**: Expo Router (File-based Routing)

### **State Management**

- **Jotai**: 2.12 (Atomic State Management)
- **AsyncStorage**: 로컬 데이터 저장

### **UI/UX Libraries**

- **React Native Paper**: Material Design 컴포넌트
- **Expo Linear Gradient**: 그라데이션 효과
- **Expo Blur**: 블러 효과
- **React Native Reanimated**: 고성능 애니메이션
- **React Native Gesture Handler**: 제스처 인식

### **Native Modules**

- **Expo Haptics**: 햅틱 피드백
- **Expo Status Bar**: 상태바 제어
- **Expo System UI**: 시스템 UI 제어
- **Expo Constants**: 앱 상수 관리

---

## 🏗️ 아키텍처 특징

### 1. **File-based Routing (Expo Router)**

Next.js 스타일의 파일 기반 라우팅 시스템 적용:

```
app/
├── _layout.tsx              # Root Layout
├── index.tsx                # 홈 화면
├── main/
│   ├── _layout.tsx
│   └── index.tsx            # 메인 페이지
├── busTimeTable/            # 버스 시간표
├── searchBus/               # 버스 검색
├── searchRoute/             # 경로 검색
├── searchResultRoute/       # 경로 검색 결과
└── busDetailPage/           # 버스 상세 정보
```

**장점**:

- 직관적인 폴더 구조
- Type-safe navigation
- 자동 라우트 생성
- Deep linking 지원

### 2. **Atomic State Management (Jotai)**

```typescript
// atoms/busAtoms.ts 예시
import { atom } from "jotai";

export const selectedBusAtom = atom<Bus | null>(null);
export const busStationsAtom = atom<Station[]>([]);
export const favoriteRoutesAtom = atom<Route[]>([]);
```

**선택 이유**:

- Redux보다 가벼운 번들 사이즈
- React Suspense와 완벽한 통합
- TypeScript 완전 지원
- 최소한의 리렌더링

### 3. **WebView 통신 아키텍처**

React Native ↔ React Web 간의 양방향 통신 구현:

```typescript
// WebView postMessage 통신
webviewRef.current?.postMessage(
  JSON.stringify({
    type: "UPDATE_DATA",
    payload: busData,
  })
);

// Web에서 메시지 수신
window.addEventListener("message", event => {
  const { type, payload } = JSON.parse(event.data);
  // 데이터 처리
});
```

**보안 구현**:

- `view_key` 헤더를 통한 인증
- middleware에서 외부 접근 차단
- 환경변수 기반 키 관리

---

## 🎨 주요 기능 구현

### 1. **실시간 버스 도착 정보**

- API를 통한 실시간 데이터 페칭 (Axios)
- 자동 새로고침 기능
- 오프라인 대응 (AsyncStorage 캐싱)

### 2. **즐겨찾기 관리**

- 자주 이용하는 노선/정류장 저장
- AsyncStorage를 활용한 로컬 저장
- 빠른 액세스

### 3. **경로 검색**

- 출발지/도착지 기반 경로 탐색
- 최적 경로 추천
- 환승 정보 제공

### 4. **사용자 경험 최적화**

- Haptic Feedback (버튼 터치 시)
- Smooth Animations (Reanimated)
- Pull-to-refresh
- 로딩 상태 표시

---

## 🚀 기술적 도전과 해결

### 1. **WebView 통신 동기화**

**문제**: React Native와 WebView 간 데이터 불일치

**해결**:

- 이벤트 기반 통신 시스템 구축
- 상태 동기화 로직 추가
- 에러 핸들링 강화

### 2. **성능 최적화**

**문제**: 대량의 버스 데이터 렌더링 시 성능 저하

**해결**:

- FlatList의 최적화 prop 활용
- useMemo, useCallback 적극 활용
- 불필요한 리렌더링 방지

### 3. **플랫폼별 대응**

**문제**: iOS와 Android의 UI/동작 차이

**해결**:

- Platform.select를 활용한 조건부 스타일링
- 플랫폼별 네이티브 모듈 분기 처리

---

## 📦 설치 및 실행

### 설치

```bash
npm install
```

### 개발 서버 실행

```bash
npx expo start
```

### 플랫폼별 실행

#### Android

```bash
npm run android
# 또는
npx expo run:android
```

#### iOS

```bash
npm run ios
# 또는
npx expo run:ios
```

#### Web (개발용)

```bash
npm run web
```

---

## 🏗️ 빌드

### APK 빌드 (Android)

```bash
eas build --platform android --profile preview
```

### Production 빌드

```bash
eas build --platform all --profile production
```

---

## 📊 프로젝트 통계

- **APK 크기**: 77.6MB
- **총 화면 수**: 8개+
- **컴포넌트 수**: 13개+
- **TypeScript 커버리지**: 100%
- **지원 플랫폼**: Android, iOS

---

## 🔑 핵심 역량 시연

### **React Native 숙련도**

✅ Expo 생태계 완벽 활용  
✅ File-based Routing 구현  
✅ Native Module 통합  
✅ 크로스플랫폼 개발 경험

### **상태 관리**

✅ Jotai를 활용한 효율적인 상태 관리  
✅ AsyncStorage를 통한 로컬 데이터 관리  
✅ 상태 동기화 로직 구현

### **성능 최적화**

✅ 렌더링 최적화  
✅ 메모이제이션 활용  
✅ 번들 사이즈 최적화

### **UI/UX 구현 능력**

✅ Material Design 적용  
✅ 애니메이션 및 제스처  
✅ 반응형 레이아웃  
✅ 사용자 경험 개선

---

## 📝 코드 품질

- **린팅**: ESLint + Expo 규칙
- **포맷팅**: Prettier
- **타입 안정성**: TypeScript strict mode
- **테스트**: Jest + React Native Testing Library 설정

---

## 🔗 관련 링크

- [메인 포트폴리오 문서](../PORTFOLIO.md)
- [Web Dashboard](../bustlebus-web)
- [Expo 공식 문서](https://docs.expo.dev/)
- [React Native 공식 문서](https://reactnative.dev/)

---

## 👨‍💻 개발자

프론트엔드 엔지니어 (React Native 전문)
