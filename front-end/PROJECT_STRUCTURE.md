# 프로젝트 구조 설명

## 📁 디렉토리 구조

```
NewProject/
├── public/                    # 정적 파일
│   └── vite.svg              # Vite 로고
├── src/                       # 소스 코드
│   ├── api/                  # API 통신 관련
│   │   ├── client.ts         # Axios 클라이언트 설정
│   │   └── example.ts        # API 엔드포인트 예제
│   ├── assets/               # 정적 자산 (이미지, 폰트 등)
│   ├── components/           # 재사용 가능한 컴포넌트
│   │   ├── Button.tsx        # 버튼 컴포넌트
│   │   ├── Input.tsx         # 입력 컴포넌트
│   │   └── Loading.tsx       # 로딩 컴포넌트
│   ├── hooks/                # 커스텀 React 훅
│   │   └── useDebounce.ts    # Debounce 훅
│   ├── lib/                  # 유틸리티 라이브러리
│   │   └── http-error.ts     # HTTP 에러 클래스
│   ├── mocks/                # Mock 데이터
│   │   └── data.ts           # 예제 Mock 데이터
│   ├── pages/                # 페이지 컴포넌트
│   │   └── Home.tsx          # 홈 페이지
│   ├── services/             # 비즈니스 로직 서비스
│   ├── styles/               # 스타일 파일 (CSS)
│   ├── types/                # TypeScript 타입 정의
│   │   └── global.d.ts       # 전역 타입 정의
│   ├── utils/                # 유틸리티 함수
│   │   ├── date.ts           # 날짜 관련 유틸
│   │   ├── number.ts         # 숫자 관련 유틸
│   │   └── string.ts         # 문자열 관련 유틸
│   ├── App.css               # App 스타일
│   ├── App.tsx               # 메인 App 컴포넌트
│   ├── main.tsx              # 엔트리 포인트
│   └── vite-env.d.ts         # Vite 환경 변수 타입
├── .env.development          # 개발 환경 변수
├── .env.production           # 프로덕션 환경 변수
├── .gitignore                # Git 제외 파일
├── .prettierrc               # Prettier 설정
├── eslint.config.js          # ESLint 설정
├── index.html                # HTML 엔트리
├── package.json              # 의존성 및 스크립트
├── README.md                 # 프로젝트 설명
├── tsconfig.app.json         # TypeScript 앱 설정
├── tsconfig.json             # TypeScript 메인 설정
├── tsconfig.node.json        # TypeScript Node 설정
└── vite.config.ts            # Vite 설정

```

## 🔧 주요 설정 파일

### package.json
- 프로젝트 의존성 및 npm 스크립트 정의
- React 19, TypeScript, Vite 등 최신 버전 사용

### vite.config.ts
- Vite 빌드 도구 설정
- 경로 별칭 (@) 설정
- 개발 서버 프록시 설정

### tsconfig.json
- TypeScript 컴파일러 설정
- 경로 매핑 설정 (@/*)

### eslint.config.js
- ESLint 코드 품질 검사 설정
- React Hooks 규칙
- Prettier 통합

## 🎨 주요 기능

### API 클라이언트 (src/api/client.ts)
- Axios 기반 HTTP 클라이언트
- Request/Response 인터셉터
- 인증 토큰 자동 처리
- 전역 에러 핸들링

### 컴포넌트 (src/components/)
- **Button**: 다양한 스타일과 크기의 버튼
- **Input**: 라벨과 에러 메시지를 지원하는 입력 필드
- **Loading**: 로딩 스피너 컴포넌트

### 유틸리티 함수 (src/utils/)
- **date.ts**: 날짜 포맷팅, 상대 시간 표시
- **number.ts**: 숫자 포맷팅, 통화 표시
- **string.ts**: 문자열 변환 (kebab-case, camelCase 등)

### 커스텀 훅 (src/hooks/)
- **useDebounce**: 입력 디바운싱

## 🚀 시작하기

### 1. 의존성 설치
```bash
cd NewProject
npm install
```

### 2. 개발 서버 실행
```bash
npm run dev
```

### 3. 빌드
```bash
npm run build
```

### 4. 린트
```bash
npm run lint
```

## 🌐 환경 변수

### .env.development
```
VITE_API_BASE_URL=/api
VITE_PROXY_TARGET=http://localhost:8080
```

### .env.production
```
VITE_API_BASE_URL=https://your-production-api.com/api/v1
VITE_PROXY_TARGET=https://your-production-api.com
```

## 📝 코딩 컨벤션

### 파일 명명 규칙
- 컴포넌트: PascalCase (예: `Button.tsx`)
- 유틸리티/훅: camelCase (예: `useDebounce.ts`)
- 타입 정의: kebab-case 또는 camelCase (예: `global.d.ts`)

### 컴포넌트 구조
```tsx
// 1. Import
import { useState } from 'react'

// 2. 타입 정의
interface Props {
  // ...
}

// 3. 컴포넌트 정의
function Component({ ...props }: Props) {
  // hooks
  // handlers
  // render
}

// 4. Export
export default Component
```

### API 호출 패턴
```typescript
// api/example.ts
export const exampleApi = {
  getItems: async () => {
    const response = await client.get('/items')
    return response.data
  },
}
```

## 🔄 라우팅

React Router v7 사용:
```tsx
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/about" element={<About />} />
  <Route path="*" element={<Navigate to="/" replace />} />
</Routes>
```

## 🎯 다음 단계

1. **인증 시스템 구현**
   - 로그인/회원가입 페이지
   - JWT 토큰 관리
   - Protected Routes

2. **상태 관리 추가**
   - Context API 또는
   - Zustand/Jotai/Recoil

3. **UI 라이브러리 통합**
   - Tailwind CSS (이미 준비됨)
   - Styled Components (이미 설치됨)

4. **테스팅**
   - Vitest
   - React Testing Library

5. **추가 기능**
   - Dark mode
   - i18n (다국어)
   - PWA

## 📚 참고 자료

- [React 공식 문서](https://react.dev/)
- [Vite 공식 문서](https://vitejs.dev/)
- [TypeScript 공식 문서](https://www.typescriptlang.org/)
- [React Router 공식 문서](https://reactrouter.com/)
