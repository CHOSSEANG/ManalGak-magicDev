# ManalGak Frontend

만날각(ManalGak) 서비스의 프론트엔드 애플리케이션입니다.

## 기술 스택

- **Next.js 15** (App Router)
- **React 18**
- **TypeScript**
- **Tailwind CSS** (스타일링)
- **Zustand** (전역 상태 관리)
- **React Query** (서버 상태 관리)
- **Axios** (HTTP 클라이언트)
- **Kakao Maps SDK** (지도)

## 프로젝트 구조

```
src/
├── app/                      # Next.js 15 App Router
│   ├── layout.tsx
│   ├── page.tsx              # 홈 페이지
│   ├── meetings/
│   │   ├── new/              # 모임 생성 (Frontend 1)
│   │   └── [meetingUuid]/    # 동적 라우팅
│   │       ├── page.tsx      # 모임 정보
│   │       ├── join/         # 참여자 추가 (Frontend 1)
│   │       └── result/       # 결과 화면 (Frontend 1)
│
├── components/               # React 컴포넌트
│   ├── ui/                   # 공통 UI (Frontend 2)
│   ├── map/                  # 지도 컴포넌트 (Frontend 2)
│   ├── meeting/              # 모임 컴포넌트 (Frontend 1)
│   └── place/                # 장소 컴포넌트 (Frontend 1)
│
├── lib/                      # 유틸리티 및 API
│   ├── api/                  # API 호출 함수 (Frontend 1)
│   ├── hooks/                # Custom Hooks (Frontend 1)
│   └── utils/                # 유틸리티 함수
│
├── store/                    # 전역 상태 관리 (Frontend 1)
│   ├── meetingStore.ts
│   ├── participantStore.ts
│   └── placeStore.ts
│
├── types/                    # TypeScript 타입 정의
│   ├── meeting.ts
│   ├── participant.ts
│   └── place.ts
│
└── styles/                   # 스타일 파일 (Frontend 2)
```

## 환경 설정

### 1. 환경 변수 설정

`.env.local` 파일을 생성하고 다음 환경 변수를 설정하세요:

```bash
# API 서버 URL
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1

# Kakao Map API Key
NEXT_PUBLIC_KAKAO_MAP_KEY=your_kakao_map_api_key_here
```

### 2. 의존성 설치

```bash
npm install
# 또는
yarn install
```

## 실행 방법

### 개발 모드

```bash
npm run dev
# 또는
yarn dev
```

서버가 http://localhost:3000 에서 실행됩니다.

### 프로덕션 빌드

```bash
# 빌드
npm run build
# 또는
yarn build

# 실행
npm start
# 또는
yarn start
```

### 타입 체크

```bash
npm run type-check
# 또는
yarn type-check
```

### 린트

```bash
npm run lint
# 또는
yarn lint
```

## 페이지 구조

### 1. 홈 페이지 (`/`)
- 서비스 소개
- 새 모임 만들기 버튼

### 2. 모임 생성 (`/meetings/new`) - Frontend 1
- 모임 이름 입력
- 모임 목적 선택 (회식/데이트/스터디/일반)
- 최대 참여 인원 설정

### 3. 모임 참여 (`/meetings/[meetingUuid]/join`) - Frontend 1
- 참여자 이름 입력
- 출발지 선택 (지도 또는 주소 검색)
- 귀가지 선택 (선택 사항)

### 4. 결과 화면 (`/meetings/[meetingUuid]/result`) - Frontend 1
- 중점 지도 표시
- 추천 장소 목록
- 경로 정보
- GPT 추천 메시지

## 역할 분담

### Frontend 1 - 핵심 화면 & 상태 관리
- 모임 생성/참여/결과 페이지
- API 연동 로직
- 전역 상태 관리 (Zustand)
- Custom Hooks

### Frontend 2 - UI/UX & 모바일 최적화
- 공통 UI 컴포넌트 (Button, Input, Card 등)
- 지도 컴포넌트 (Kakao Maps SDK)
- 반응형 디자인
- 모바일 최적화

## 배포

### Vercel 배포

```bash
# Vercel CLI 설치
npm install -g vercel

# 배포
vercel
```

환경 변수는 Vercel 대시보드에서 설정합니다.

## 참고 문서

- [프로젝트 개요](../.Claude/1.%20프로젝트%20개요.md)
- [API 명세서](../.Claude/3.%20API%20명세서.md)
- [역할 분담](../.Claude/4.%20역할%20분담.md)
- [프로젝트 구조](../.Claude/5.%20프로젝트%20구조.md)
