# MSA 게시판 프로젝트 (Frontend - User Service)

마이크로서비스 아키텍처(MSA) 구조를 학습하기 위한 토이 프로젝트입니다.  
현재는 **User Service (유저 서비스)** 부분만 구현되어 있으며, 서비스 간 통신 흐름을 시각화하는 기능을 포함합니다.

## 🎯 프로젝트 목표

- MSA 구조의 게시판 서비스 구현
- 각 마이크로서비스 간의 통신 흐름 시각화
- 서비스별 로그 및 메트릭 모니터링

## 📦 현재 구현된 기능

### ✅ User Service (유저 서비스)
- 회원가입 (Register)
- 로그인 (Login)
- 로그아웃 (Logout)
- 현재 사용자 정보 조회
- JWT 기반 인증

### ✅ MSA 서비스 로깅
- 실시간 서비스 호출 로그
- 서비스별 성공/실패 통계
- API 호출 플로우 추적
- 응답 시간 측정

### ✅ Mock API
- 백엔드 없이 테스트 가능
- 실제 API 호출 시뮬레이션
- 개발 모드에서 자동으로 Mock 사용

## 🏗️ 프로젝트 구조

```
src/
├── api/              # API 클라이언트 및 엔드포인트
│   ├── client.ts    # Axios 클라이언트 설정
│   └── user.ts      # User Service API
├── components/       # 재사용 가능한 컴포넌트
│   ├── Button.tsx
│   ├── Input.tsx
│   └── Loading.tsx
├── hooks/            # 커스텀 React 훅
│   ├── useAuth.tsx  # 인증 Context & Hook
│   └── useDebounce.ts
├── mocks/            # Mock 데이터 및 API
│   └── mockUserApi.ts
├── pages/            # 페이지 컴포넌트
│   ├── Auth.tsx     # 로그인/회원가입
│   └── Dashboard.tsx # 대시보드
├── services/         # 비즈니스 로직 서비스
│   └── serviceLogger.ts # MSA 로깅 서비스
├── styles/           # 스타일 파일
│   ├── Auth.css
│   └── Dashboard.css
├── types/            # TypeScript 타입 정의
│   ├── user.ts      # User Service 타입
│   ├── msa.ts       # MSA 관련 타입
│   └── global.d.ts
└── utils/            # 유틸리티 함수
```

## 🚀 시작하기

### 1. 의존성 설치
```bash
npm install
```

### 2. 개발 서버 실행
```bash
npm run dev
```

### 3. 테스트 계정으로 로그인
```
이메일: test@example.com
비밀번호: password
```

또는 새로운 계정을 회원가입하세요!

### 4. 빌드 (프로덕션)
```bash
npm run build
```

### 5. 코드 린팅
```bash
npm run lint
```

## 🛠️ 주요 기술 스택

- **React 19** - UI 라이브러리
- **TypeScript** - 타입 안정성
- **Vite** - 빌드 도구
- **React Router v7** - 라우팅
- **Axios** - HTTP 클라이언트
- **ESLint + Prettier** - 코드 품질 관리

## 📱 페이지 구성

### 1. 인증 페이지 (`/auth`)
- 로그인/회원가입 탭
- 폼 유효성 검사
- 에러 처리

### 2. 대시보드 (`/dashboard`)
- 사용자 정보 표시
- 서비스 호출 통계
- 실시간 로그 모니터링

## 🔐 인증 시스템

### JWT 기반 인증
- Access Token: API 요청에 사용
- Refresh Token: 토큰 갱신용
- LocalStorage에 저장

### Protected Routes
- 인증되지 않은 사용자는 `/auth`로 리다이렉트
- 인증된 사용자는 `/dashboard`로 자동 이동

## 📊 MSA 로깅 시스템

### ServiceLogger
모든 API 호출을 자동으로 로깅합니다.

```typescript
// 사용 예시
const flowId = serviceLogger.startFlow('USER_LOGIN')

await callServiceWithLogging(
  'USER',
  'LOGIN',
  () => userApi.login(data),
  flowId
)

serviceLogger.completeFlow(flowId, 'completed')
```

### 로그 정보
- 서비스 이름 (USER, POST, COMMENT, GATEWAY)
- 액션 (LOGIN, REGISTER, GET_POSTS 등)
- 상태 (pending, success, error)
- 응답 시간 (ms)
- 요청/응답 데이터

## 🔮 향후 계획

### Phase 2: Post Service (게시글 서비스)
- [ ] 게시글 CRUD
- [ ] 게시글 목록/상세 조회
- [ ] 검색 및 필터링

### Phase 3: Comment Service (댓글 서비스)
- [ ] 댓글 CRUD
- [ ] 대댓글 기능

### Phase 4: MSA Visualization (시각화)
- [ ] 서비스 아키텍처 다이어그램
- [ ] 실시간 서비스 통신 플로우
- [ ] 성능 메트릭 대시보드
- [ ] 서비스 상태 모니터링
