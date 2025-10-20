# My Book App - 도서 쇼핑몰

Next.js 15를 사용한 도서 쇼핑몰 프로젝트입니다.

## 기술 스택

- **Next.js 15** (App Router)
- **JavaScript**
- **Bootstrap 5**
- **Zustand** (상태 관리)

## 주요 기능

### 1. 도서 목록 페이지 (메인 페이지)
- 도서 사진, 제목, 내용 요약, 가격 표시
- Bootstrap 페이지네이션 (한 화면에 10개씩)
- Mock 데이터 사용
- 로그인 없이 접근 가능

### 2. 도서 상세 페이지
- 도서 사진, 제목, 내용, 목차, 가격 표시
- 구매 기능 (로그인 필요)
- 로그인 없이 조회 가능

### 3. 로그인
- JWT 인증 방식
- Zustand를 이용한 토큰 저장
- x-www-form-urlencoded 방식

### 4. API 연동
- 로그인: POST `/api/v1/login`
- 도서 목록: GET `/api/v1/book/list`
- 도서 상세: GET `/api/v1/book/{bookId}`
- 구매: POST `/api/v1/book/buy/{bookId}`

## API 헤더 설정

- 로그인: `Content-Type: application/x-www-form-urlencoded`
- 기타 API: `Content-Type: application/json`
- JWT 토큰: `Authorization: Bearer {token}` (자동 추가)

## 설치 및 실행

### 1. 의존성 설치
```bash
npm install
```

### 2. 환경 변수 설정
`.env.local` 파일에서 API 서버 URL 설정:
```
NEXT_PUBLIC_API_URL=http://localhost:8080
```

### 3. 개발 서버 실행
```bash
npm run dev
```

브라우저에서 `http://localhost:3000` 접속

### 4. 빌드
```bash
npm run build
```

### 5. 프로덕션 실행
```bash
npm start
```

## 프로젝트 구조

```
my-book-app/
├── app/
│   ├── book/
│   │   └── [id]/
│   │       └── page.js          # 도서 상세 페이지
│   ├── login/
│   │   └── page.js              # 로그인 페이지
│   ├── layout.js                # 레이아웃 (Bootstrap 설정)
│   └── page.js                  # 메인 페이지 (도서 목록)
├── data/
│   └── mockBooks.js             # Mock 데이터
├── lib/
│   └── api.js                   # API 유틸리티
├── store/
│   └── authStore.js             # Zustand 인증 스토어
└── .env.local                   # 환경 변수
```

## 주요 파일 설명

### `store/authStore.js`
- Zustand를 사용한 인증 상태 관리
- JWT 토큰과 사용자 정보 저장
- localStorage를 통한 영속성

### `lib/api.js`
- API 호출 함수들
- JWT 토큰 자동 주입
- 로그인, 도서 목록/상세 조회, 구매 기능

### `data/mockBooks.js`
- 25개의 Mock 도서 데이터
- 페이지네이션 함수

## 사용 방법

1. **도서 목록 보기**: 메인 페이지에서 도서 목록 확인
2. **도서 상세 보기**: 도서 제목이나 상세보기 버튼 클릭
3. **로그인**: 상단 네비게이션의 로그인 버튼 클릭
4. **구매하기**: 로그인 후 도서 상세 페이지에서 구매하기 버튼 클릭

## 참고사항

- 현재 Mock 데이터를 사용하고 있으며, 실제 Spring Boot 서버가 준비되면 자동으로 연동됩니다.
- JWT 토큰은 localStorage에 저장되며, 모든 API 요청 시 자동으로 헤더에 추가됩니다.
- 구매 기능은 로그인한 사용자만 사용할 수 있습니다.
