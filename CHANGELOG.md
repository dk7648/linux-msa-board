# 변경 사항 (Changelog)

## 날짜: 2025년 12월 5일

### 🎯 주요 변경 사항 요약
프론트엔드와 백엔드를 연동하여 회원가입/로그인 기능을 구현하고, 불필요한 모니터링 페이지를 제거했습니다. Eureka 대시보드를 활용하도록 구조를 개선했습니다.

---

## 📦 Backend 변경사항

### 1. User Service 설정 수정

#### **build.gradle**
**변경 내용:**
```gradle
mainClass = 'com.example.user_service.UserServiceApplication'
```

**변경 이유:**
- 기존 `UserService`는 잘못된 클래스명
- 실제 메인 클래스는 `UserServiceApplication`
- 빌드 실패 원인 해결

---

#### **application.yml**
**변경 내용:**
```yaml
jpa:
  hibernate:
    ddl-auto: validate  # update → validate로 변경
```

**변경 이유:**
- 기존 테이블(`users`)이 이미 존재
- `update` 모드는 스키마를 자동 변경하여 데이터 손실 위험
- `validate`는 스키마 검증만 수행하여 안전

---

#### **WebSecurity.java**
**변경 내용:**
```java
config.setAllowedOrigins(List.of(
    "http://localhost:5173",
    "http://localhost:5174", 
    "http://localhost:5175"
));
```

**변경 이유:**
- Vite 개발 서버가 포트 충돌 시 자동으로 다른 포트 사용
- 5173, 5174, 5175 포트를 모두 허용하여 CORS 에러 방지
- 403 Forbidden 에러 해결

---

### 2. User Service 신규 파일 생성

#### **UserRestController.java** (신규)
**위치:** `back-end/user-service/src/main/java/com/example/user_service/controller/`

**변경 내용:**
```java
@RestController
@RequestMapping("/users")
public class UserRestController {
    @PostMapping("/register")  // 회원가입 엔드포인트
    @GetMapping("/health")      // 헬스 체크
}
```

**변경 이유:**
- 기존 코드에는 `/users/register` 엔드포인트가 없었음
- 프론트엔드가 호출할 REST API 엔드포인트 필요
- 회원가입 시 프론트엔드가 기대하는 JSON 형식으로 응답

**주요 기능:**
- 이메일 중복 검증
- BCrypt 비밀번호 암호화
- UUID 기반 userId 생성
- AuthResponse 형식 JSON 반환

---

#### **UserDto.java**
**변경 내용:**
```java
private String username;  // 신규 추가
private String fullName;  // 신규 추가
```

**변경 이유:**
- 프론트엔드는 `username`, `fullName` 필드를 전송
- 백엔드는 `name` 필드만 존재하여 매핑 실패
- 호환성을 위해 필드 추가 후 `UserRestController`에서 변환 처리

---

#### **AuthenticationFilter.java**
**변경 내용:**
```java
protected void successfulAuthentication(...) {
    // JSON 응답 본문 추가
    String jsonResponse = String.format(
        "{\"user\":{...},\"token\":\"%s\",\"refreshToken\":\"%s\"}",
        ...
    );
    response.getWriter().write(jsonResponse);
}
```

**변경 이유:**
- 기존 코드는 헤더에만 토큰을 추가하고 응답 본문이 없었음
- 프론트엔드는 `{user, token, refreshToken}` 형식의 JSON 응답 기대
- 로그인 성공 시 사용자 정보와 토큰을 함께 반환하도록 수정

---

### 3. API Gateway 설정 수정

#### **application.yml**
**변경 내용:**
```yaml
allowedOrigins:
  - "http://localhost:5173"
  - "http://localhost:5174"
  - "http://localhost:5175"
```

**변경 이유:**
- User Service와 동일하게 다중 포트 허용
- API Gateway 레벨에서 CORS 403 에러 방지

---

## 🎨 Frontend 변경사항

### 1. 환경 설정

#### **.env** (신규)
**변경 내용:**
```env
VITE_API_BASE_URL=http://localhost:9000
VITE_PROXY_TARGET=http://localhost:9000
```

**변경 이유:**
- API Gateway URL을 환경변수로 관리
- 프록시 타겟을 명시적으로 설정
- 배포 환경 변경 시 유연한 대응

---

#### **vite.config.ts**
**변경 내용:**
```typescript
server: {
  proxy: {
    '/api': {
      target: process.env.VITE_PROXY_TARGET || 'http://localhost:9000',  // 8080 → 9000
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, ''),  // /api prefix 제거
    },
  },
}
```

**변경 이유:**
1. **포트 수정 (8080 → 9000)**
   - API Gateway는 9000 포트에서 실행
   - 기존 8080으로 요청하여 ECONNREFUSED 에러 발생

2. **rewrite 추가**
   - 프론트엔드: `/api/users/login` 요청
   - Vite 프록시: `/api` 제거 후 `/users/login`으로 전달
   - API Gateway: `/users/**` 패턴으로 User Service 라우팅

---

### 2. API 호출 경로 수정

#### **src/api/user.ts**
**변경 내용:**
```typescript
const USER_SERVICE_URL = '/users'  // '/v1/users' → '/users'
```

**변경 이유:**
- API Gateway 라우팅 규칙: `Path=/users/**`
- 기존 `/v1/users`로 요청 시 404 Not Found
- Gateway 패턴과 일치하도록 경로 변경

---

#### **src/mocks/mockUserApi.ts**
**변경 내용:**
```typescript
export const USE_MOCK_API = false  // true → false
```

**변경 이유:**
- Mock API에서 실제 백엔드 API로 전환
- 실제 데이터베이스 연동 테스트 필요

---

### 3. 불필요한 파일 삭제

#### **삭제된 페이지**
- `src/pages/Dashboard.tsx`
- `src/pages/Metrics.tsx`
- `src/pages/View.tsx`
- `src/services/serviceLogger.ts`
- `src/styles/Dashboard.css`
- `src/styles/Metrics.css`
- `src/styles/View.css`
- `src/types/msa.ts`

**변경 이유:**
- Eureka Server가 이미 서비스 모니터링 제공
- 중복 기능으로 불필요한 복잡도 증가
- 프론트엔드는 게시판 기능에 집중
- MSA 모니터링은 Eureka Dashboard 활용 (http://localhost:8761)

---

### 4. 라우팅 구조 개선

#### **src/App.tsx**
**변경 내용:**
```typescript
// 기본 경로를 /posts로 변경
<Route path="/" element={<Navigate to="/posts" replace />} />

// Dashboard 관련 라우팅 제거
// /dashboard, /metrics, /msa-visualization 삭제
```

**변경 이유:**
- 로그인 후 바로 게시판 페이지로 이동
- 사용자 경험 개선 (불필요한 단계 제거)
- 단순하고 명확한 라우팅 구조

---

#### **src/hooks/useAuth.tsx**
**변경 내용:**
```typescript
// serviceLogger 관련 코드 제거
const response = await userApi.login(data)  // callServiceWithLogging 제거
```

**변경 이유:**
- serviceLogger 의존성 제거
- 실제 MSA 환경에서는 백엔드에서 로깅 처리
- 프론트엔드는 단순한 API 호출만 담당

---

### 5. UI 버그 수정

#### **src/main.tsx**
**변경 내용:**
```typescript
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />  // 중복 제거 (<App /> <App /> → <App />)
  </StrictMode>
)
```

**변경 이유:**
- 페이지가 두 번 렌더링되는 버그
- 로그인 페이지가 다른 페이지 아래에 중복 표시
- `<App />` 컴포넌트가 실수로 두 번 선언됨

---

## 🔍 해결된 주요 문제

### 1. **회원가입 500 에러**
- **원인:** 프론트엔드 필드(`username`, `fullName`) ≠ 백엔드 필드(`name`)
- **해결:** `UserDto`에 필드 추가 및 매핑 로직 구현

### 2. **로그인 401 에러 (인증 실패)**
- **원인:** `AuthenticationFilter`가 JSON 응답 본문 미제공
- **해결:** `successfulAuthentication`에서 프론트엔드 형식에 맞는 JSON 응답 추가

### 3. **API 호출 404 에러**
- **원인:** 프론트(`/v1/users/*`) ≠ 게이트웨이(`/users/*`)
- **해결:** 프론트엔드 URL 경로 통일

### 4. **Vite 프록시 ECONNREFUSED**
- **원인:** localhost:8080으로 요청 (API Gateway는 9000)
- **해결:** vite.config.ts에서 타겟 포트 수정

### 5. **CORS 403 Forbidden**
- **원인:** 5174, 5175 포트 미허용
- **해결:** API Gateway와 User Service에 다중 포트 추가

### 6. **페이지 중복 렌더링**
- **원인:** main.tsx에서 `<App />` 두 번 선언
- **해결:** 중복 컴포넌트 제거

---

## 📊 아키텍처 개선

### Before (변경 전)
```
Frontend (5173) → Vite Proxy (8080 ❌) → API Gateway (9000)
                                          ↓
                                     User Service (9002)
                                     (엔드포인트 없음 ❌)
```

### After (변경 후)
```
Frontend (5173/5174/5175) → Vite Proxy → API Gateway (9000)
                            /api → /users (/api 제거)
                                          ↓
                                     User Service (9002)
                                     ✅ /users/register
                                     ✅ /users/login
                                     ✅ /users/health
```

---

## 🧪 테스트 방법

### 1. 백엔드 서비스 시작
```bash
# Discovery Service
cd back-end/discovery-service
./gradlew bootRun

# API Gateway
cd back-end/apigateway-service
./gradlew bootRun

# User Service
cd back-end/user-service
./gradlew bootRun
```

### 2. 프론트엔드 시작
```bash
cd front-end
npm run dev
```

### 3. 테스트 시나리오
1. http://localhost:5173 (또는 5174, 5175) 접속
2. 회원가입: 새 이메일로 계정 생성
3. 로그인: 등록한 이메일/비밀번호로 로그인
4. 게시판 페이지 자동 이동 확인

---

## 📝 향후 개선 사항

### 필수
1. **JWT 토큰 검증**: `/users/me` 엔드포인트 구현
2. **로그아웃 처리**: 토큰 무효화 로직 추가
3. **에러 처리 개선**: 사용자 친화적인 에러 메시지

### 선택
1. **게시판 CRUD**: Article Service 연동
2. **댓글 기능**: Comment Service 연동
3. **프로필 편집**: 사용자 정보 수정 기능

---

## 🎯 핵심 포인트

**이번 변경의 핵심은 "필수 기능에 집중"입니다:**
- ✅ Eureka가 이미 모니터링 제공 → 중복 제거
- ✅ 프론트/백엔드 경로 통일 → 404 해결
- ✅ JSON 응답 형식 표준화 → 인증 성공
- ✅ 환경 설정 명시화 → 유지보수 용이

**결과: 안정적인 회원가입/로그인 기능 완성** ✨
