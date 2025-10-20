export const mockBooks = [
  {
    id: 1,
    title: 'Next.js 완벽 가이드',
    summary: 'Next.js를 활용한 현대적인 웹 애플리케이션 개발 방법을 상세하게 다룹니다.',
    price: 35000,
    image: 'https://via.placeholder.com/200x300/007bff/ffffff?text=Next.js',
    content: 'Next.js는 React 기반의 프레임워크로, 서버 사이드 렌더링과 정적 사이트 생성을 쉽게 구현할 수 있습니다. 이 책은 Next.js의 핵심 개념부터 실전 프로젝트까지 단계별로 학습할 수 있도록 구성되었습니다.',
    contentHtml: '<h2>Next.js 소개</h2><p>Next.js는 React 기반의 프레임워크로, <strong>서버 사이드 렌더링(SSR)</strong>과 <strong>정적 사이트 생성(SSG)</strong>을 쉽게 구현할 수 있습니다.</p><h3>주요 특징</h3><ul><li>파일 기반 라우팅 시스템</li><li>자동 코드 스플리팅</li><li>이미지 최적화</li><li>API Routes 지원</li></ul><p>이 책은 Next.js의 핵심 개념부터 실전 프로젝트까지 단계별로 학습할 수 있도록 구성되었습니다.</p>',
    tableOfContents: [
      '1장. Next.js 소개',
      '2장. 라우팅 시스템',
      '3장. 데이터 페칭',
      '4장. API Routes',
      '5장. 배포 및 최적화'
    ],
    tableOfContentsHtml: '<ol><li>Next.js 소개</li><li>라우팅 시스템</li><li>데이터 페칭</li><li>API Routes</li><li>배포 및 최적화</li></ol>'
  },
  {
    id: 2,
    title: 'React 마스터하기',
    summary: 'React의 기초부터 고급 패턴까지, 실무에서 바로 적용할 수 있는 내용을 담았습니다.',
    price: 32000,
    image: 'https://via.placeholder.com/200x300/61dafb/000000?text=React',
    content: 'React는 사용자 인터페이스를 구축하기 위한 JavaScript 라이브러리입니다. 컴포넌트 기반 아키텍처와 가상 DOM을 통해 효율적인 UI 개발이 가능합니다.',
    tableOfContents: [
      '1장. React 시작하기',
      '2장. 컴포넌트와 Props',
      '3장. State와 생명주기',
      '4장. Hooks 완벽 가이드',
      '5장. 성능 최적화'
    ]
  },
  {
    id: 3,
    title: 'TypeScript 프로그래밍',
    summary: 'JavaScript에 타입 시스템을 더한 TypeScript의 모든 것을 배웁니다.',
    price: 28000,
    image: 'https://via.placeholder.com/200x300/3178c6/ffffff?text=TypeScript',
    content: 'TypeScript는 JavaScript의 슈퍼셋으로, 정적 타입을 제공하여 대규모 애플리케이션 개발을 용이하게 합니다.',
    tableOfContents: [
      '1장. TypeScript 기본',
      '2장. 타입 시스템',
      '3장. 인터페이스와 클래스',
      '4장. 제네릭',
      '5장. 고급 타입'
    ]
  },
  {
    id: 4,
    title: 'JavaScript 완벽 가이드',
    summary: '모던 JavaScript의 모든 것을 다루는 완벽한 레퍼런스 가이드입니다.',
    price: 42000,
    image: 'https://via.placeholder.com/200x300/f7df1e/000000?text=JavaScript',
    content: 'JavaScript는 웹 개발의 핵심 언어입니다. ES6+의 최신 기능부터 비동기 프로그래밍까지 상세히 설명합니다.',
    tableOfContents: [
      '1장. JavaScript 기초',
      '2장. 함수와 스코프',
      '3장. 객체와 프로토타입',
      '4장. 비동기 프로그래밍',
      '5장. 모듈과 도구'
    ]
  },
  {
    id: 5,
    title: 'Node.js 백엔드 개발',
    summary: 'Node.js를 활용한 서버 개발의 모든 것을 학습합니다.',
    price: 38000,
    image: 'https://via.placeholder.com/200x300/339933/ffffff?text=Node.js',
    content: 'Node.js는 JavaScript 런타임으로 서버 사이드 애플리케이션을 개발할 수 있습니다. Express, NestJS 등 다양한 프레임워크를 다룹니다.',
    tableOfContents: [
      '1장. Node.js 시작하기',
      '2장. Express 프레임워크',
      '3장. 데이터베이스 연동',
      '4장. 인증과 보안',
      '5장. 배포와 운영'
    ]
  },
  {
    id: 6,
    title: 'MongoDB 데이터베이스',
    summary: 'NoSQL 데이터베이스 MongoDB의 기초부터 고급 활용까지 다룹니다.',
    price: 33000,
    image: 'https://via.placeholder.com/200x300/47a248/ffffff?text=MongoDB',
    content: 'MongoDB는 문서 지향 NoSQL 데이터베이스입니다. 유연한 스키마와 뛰어난 확장성으로 현대적인 애플리케이션에 적합합니다.',
    tableOfContents: [
      '1장. MongoDB 소개',
      '2장. CRUD 연산',
      '3장. 집계 파이프라인',
      '4장. 인덱싱과 성능',
      '5장. 레플리카셋과 샤딩'
    ]
  },
  {
    id: 7,
    title: 'Vue.js 3 완벽 가이드',
    summary: 'Vue.js 3의 새로운 기능과 Composition API를 마스터합니다.',
    price: 34000,
    image: 'https://via.placeholder.com/200x300/42b883/ffffff?text=Vue.js',
    content: 'Vue.js 3는 프로그레시브 JavaScript 프레임워크로, 점진적으로 채택 가능한 구조를 가지고 있습니다.',
    tableOfContents: [
      '1장. Vue.js 3 시작하기',
      '2장. Composition API',
      '3장. 컴포넌트 심화',
      '4장. Vue Router',
      '5장. Vuex 상태 관리'
    ]
  },
  {
    id: 8,
    title: 'Docker & Kubernetes',
    summary: '컨테이너 기술과 오케스트레이션의 핵심을 배웁니다.',
    price: 45000,
    image: 'https://via.placeholder.com/200x300/2496ed/ffffff?text=Docker',
    content: 'Docker와 Kubernetes를 활용하여 현대적인 마이크로서비스 아키텍처를 구축하는 방법을 학습합니다.',
    tableOfContents: [
      '1장. 컨테이너 기초',
      '2장. Docker 활용',
      '3장. Kubernetes 소개',
      '4장. 배포 전략',
      '5장. 모니터링과 로깅'
    ]
  },
  {
    id: 9,
    title: 'GraphQL API 설계',
    summary: 'GraphQL을 활용한 효율적인 API 설계와 구현 방법을 다룹니다.',
    price: 36000,
    image: 'https://via.placeholder.com/200x300/e10098/ffffff?text=GraphQL',
    content: 'GraphQL은 API를 위한 쿼리 언어이자 런타임입니다. REST의 한계를 극복하고 효율적인 데이터 페칭을 제공합니다.',
    tableOfContents: [
      '1장. GraphQL 소개',
      '2장. 스키마 설계',
      '3장. Resolver 구현',
      '4장. Apollo Server',
      '5장. 실전 프로젝트'
    ]
  },
  {
    id: 10,
    title: 'AWS 클라우드 서비스',
    summary: 'AWS의 주요 서비스를 활용한 클라우드 아키텍처 구축을 학습합니다.',
    price: 48000,
    image: 'https://via.placeholder.com/200x300/ff9900/000000?text=AWS',
    content: 'Amazon Web Services의 다양한 서비스를 활용하여 확장 가능하고 안정적인 클라우드 인프라를 구축합니다.',
    tableOfContents: [
      '1장. AWS 시작하기',
      '2장. EC2와 VPC',
      '3장. S3와 CloudFront',
      '4장. Lambda와 서버리스',
      '5장. 보안과 모니터링'
    ]
  },
  {
    id: 11,
    title: 'Python 데이터 분석',
    summary: 'Python을 활용한 데이터 분석과 시각화 기법을 익힙니다.',
    price: 39000,
    image: 'https://via.placeholder.com/200x300/3776ab/ffffff?text=Python',
    content: 'Pandas, NumPy, Matplotlib 등의 라이브러리를 활용하여 데이터를 분석하고 시각화하는 방법을 배웁니다.',
    tableOfContents: [
      '1장. Python 기초',
      '2장. NumPy와 Pandas',
      '3장. 데이터 전처리',
      '4장. 시각화',
      '5장. 실전 프로젝트'
    ]
  },
  {
    id: 12,
    title: '머신러닝 입문',
    summary: '머신러닝의 기초 개념과 주요 알고리즘을 배웁니다.',
    price: 41000,
    image: 'https://via.placeholder.com/200x300/ff6f00/ffffff?text=ML',
    content: '머신러닝의 기본 개념부터 scikit-learn을 활용한 실습까지, 단계별로 학습할 수 있습니다.',
    tableOfContents: [
      '1장. 머신러닝 개요',
      '2장. 지도 학습',
      '3장. 비지도 학습',
      '4장. 모델 평가',
      '5장. 실전 프로젝트'
    ]
  },
  {
    id: 13,
    title: 'Git & GitHub 마스터',
    summary: '버전 관리 시스템 Git과 협업 플랫폼 GitHub을 완벽하게 활용합니다.',
    price: 25000,
    image: 'https://via.placeholder.com/200x300/f05032/ffffff?text=Git',
    content: 'Git의 기본 명령어부터 브랜칭 전략, GitHub를 활용한 협업 워크플로우까지 다룹니다.',
    tableOfContents: [
      '1장. Git 기초',
      '2장. 브랜치와 병합',
      '3장. GitHub 활용',
      '4장. 협업 워크플로우',
      '5장. Git 고급 기능'
    ]
  },
  {
    id: 14,
    title: 'Flutter 앱 개발',
    summary: 'Flutter를 활용한 크로스 플랫폼 모바일 앱 개발을 배웁니다.',
    price: 37000,
    image: 'https://via.placeholder.com/200x300/02569b/ffffff?text=Flutter',
    content: 'Dart 언어와 Flutter 프레임워크를 사용하여 iOS와 Android 앱을 동시에 개발하는 방법을 학습합니다.',
    tableOfContents: [
      '1장. Flutter 시작하기',
      '2장. 위젯과 레이아웃',
      '3장. 상태 관리',
      '4장. 네트워크 통신',
      '5장. 앱 배포'
    ]
  },
  {
    id: 15,
    title: '웹 보안 가이드',
    summary: '웹 애플리케이션의 주요 보안 위협과 대응 방법을 다룹니다.',
    price: 44000,
    image: 'https://via.placeholder.com/200x300/dc3545/ffffff?text=Security',
    content: 'OWASP Top 10 취약점을 중심으로 웹 보안의 핵심 개념과 실전 대응 방법을 학습합니다.',
    tableOfContents: [
      '1장. 웹 보안 개요',
      '2장. 인증과 인가',
      '3장. XSS와 CSRF',
      '4장. SQL 인젝션',
      '5장. 보안 베스트 프랙티스'
    ]
  },
  {
    id: 16,
    title: 'REST API 설계',
    summary: 'RESTful API 설계 원칙과 모범 사례를 익힙니다.',
    price: 31000,
    image: 'https://via.placeholder.com/200x300/28a745/ffffff?text=REST+API',
    content: 'REST 아키텍처 스타일을 따르는 효과적인 API 설계 방법과 구현 기법을 배웁니다.',
    tableOfContents: [
      '1장. REST 개념',
      '2장. HTTP 메서드',
      '3장. 리소스 설계',
      '4장. 버전 관리',
      '5장. API 문서화'
    ]
  },
  {
    id: 17,
    title: 'Redis 캐싱 전략',
    summary: 'Redis를 활용한 효율적인 캐싱 전략과 성능 최적화를 다룹니다.',
    price: 29000,
    image: 'https://via.placeholder.com/200x300/dc382d/ffffff?text=Redis',
    content: 'Redis의 다양한 데이터 구조와 캐싱 패턴을 활용하여 애플리케이션 성능을 향상시키는 방법을 학습합니다.',
    tableOfContents: [
      '1장. Redis 소개',
      '2장. 데이터 타입',
      '3장. 캐싱 전략',
      '4장. Pub/Sub',
      '5장. 성능 최적화'
    ]
  },
  {
    id: 18,
    title: 'Webpack & Vite',
    summary: '모던 프론트엔드 빌드 도구의 활용법을 마스터합니다.',
    price: 27000,
    image: 'https://via.placeholder.com/200x300/8dd6f9/000000?text=Webpack',
    content: 'Webpack과 Vite를 활용한 효율적인 번들링과 개발 환경 구성 방법을 배웁니다.',
    tableOfContents: [
      '1장. 빌드 도구 개요',
      '2장. Webpack 설정',
      '3장. Vite 활용',
      '4장. 최적화 기법',
      '5장. 플러그인 개발'
    ]
  },
  {
    id: 19,
    title: 'CSS Grid & Flexbox',
    summary: '현대적인 CSS 레이아웃 기술을 완벽하게 이해합니다.',
    price: 24000,
    image: 'https://via.placeholder.com/200x300/1572b6/ffffff?text=CSS',
    content: 'Grid와 Flexbox를 활용하여 반응형 레이아웃을 구현하는 방법을 실습 중심으로 학습합니다.',
    tableOfContents: [
      '1장. CSS 기초',
      '2장. Flexbox 완벽 가이드',
      '3장. CSS Grid 마스터',
      '4장. 반응형 디자인',
      '5장. 실전 레이아웃'
    ]
  },
  {
    id: 20,
    title: 'PostgreSQL 데이터베이스',
    summary: '강력한 오픈소스 RDBMS PostgreSQL의 모든 것을 배웁니다.',
    price: 40000,
    image: 'https://via.placeholder.com/200x300/336791/ffffff?text=PostgreSQL',
    content: 'PostgreSQL의 고급 기능과 성능 튜닝, 복제 및 백업 전략까지 심도 있게 다룹니다.',
    tableOfContents: [
      '1장. PostgreSQL 시작하기',
      '2장. SQL 쿼리',
      '3장. 인덱싱과 최적화',
      '4장. 트랜잭션과 동시성',
      '5장. 고가용성 구성'
    ]
  },
  {
    id: 21,
    title: 'Clean Code',
    summary: '읽기 좋고 유지보수하기 쉬운 코드 작성법을 배웁니다.',
    price: 35000,
    image: 'https://via.placeholder.com/200x300/6c757d/ffffff?text=Clean+Code',
    content: '클린 코드의 원칙과 리팩토링 기법을 통해 코드 품질을 향상시키는 방법을 학습합니다.',
    tableOfContents: [
      '1장. 클린 코드란',
      '2장. 의미 있는 이름',
      '3장. 함수',
      '4장. 주석과 형식',
      '5장. 리팩토링'
    ]
  },
  {
    id: 22,
    title: '디자인 패턴',
    summary: '소프트웨어 설계의 검증된 해결책, 디자인 패턴을 익힙니다.',
    price: 38000,
    image: 'https://via.placeholder.com/200x300/6f42c1/ffffff?text=Design+Patterns',
    content: 'GoF 디자인 패턴을 중심으로 객체지향 설계의 베스트 프랙티스를 배웁니다.',
    tableOfContents: [
      '1장. 디자인 패턴 개요',
      '2장. 생성 패턴',
      '3장. 구조 패턴',
      '4장. 행위 패턴',
      '5장. 실전 적용'
    ]
  },
  {
    id: 23,
    title: 'TDD 테스트 주도 개발',
    summary: '테스트 주도 개발 방법론과 실전 적용법을 배웁니다.',
    price: 33000,
    image: 'https://via.placeholder.com/200x300/20c997/ffffff?text=TDD',
    content: 'TDD의 핵심 개념과 Jest, Mocha 등의 테스팅 프레임워크를 활용한 실습을 진행합니다.',
    tableOfContents: [
      '1장. TDD 소개',
      '2장. 단위 테스트',
      '3장. 통합 테스트',
      '4장. 테스트 더블',
      '5장. TDD 실전'
    ]
  },
  {
    id: 24,
    title: 'Spring Boot 마스터',
    summary: 'Spring Boot를 활용한 엔터프라이즈 애플리케이션 개발을 학습합니다.',
    price: 46000,
    image: 'https://via.placeholder.com/200x300/6db33f/ffffff?text=Spring+Boot',
    content: 'Spring Boot의 핵심 기능과 JPA, Security 등을 활용한 실무 프로젝트를 진행합니다.',
    tableOfContents: [
      '1장. Spring Boot 시작하기',
      '2장. Spring MVC',
      '3장. Spring Data JPA',
      '4장. Spring Security',
      '5장. 운영과 모니터링'
    ]
  },
  {
    id: 25,
    title: 'Microservices Architecture',
    summary: '마이크로서비스 아키텍처의 설계와 구현 방법을 다룹니다.',
    price: 49000,
    image: 'https://via.placeholder.com/200x300/fd7e14/ffffff?text=Microservices',
    content: '마이크로서비스의 핵심 패턴과 분산 시스템의 과제를 해결하는 방법을 학습합니다.',
    tableOfContents: [
      '1장. 마이크로서비스 개요',
      '2장. 서비스 분해',
      '3장. 통신 패턴',
      '4장. 데이터 관리',
      '5장. 배포와 운영'
    ]
  }
];

// 페이지네이션을 위한 함수
export const getPaginatedBooks = (page = 0, size = 10) => {
  const start = page * size;
  const end = start + size;
  const paginatedData = mockBooks.slice(start, end);

  return {
    content: paginatedData,
    totalElements: mockBooks.length,
    totalPages: Math.ceil(mockBooks.length / size),
    currentPage: page,
    size: size
  };
};

// 개별 도서 조회
export const getBookById = (id) => {
  return mockBooks.find(book => book.id === parseInt(id));
};
