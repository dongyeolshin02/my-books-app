// Next.js 프록시를 통해 API 호출 (rewrites 사용)
// 프록시 설정: /api/* -> http://localhost:9090/api/*
const API_BASE_URL = '';

// JWT 토큰을 가져오는 함수
const getToken = () => {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem('auth-storage');
  if (!stored) return null;
  try {
    const parsed = JSON.parse(stored);
    return parsed.state?.token;
  } catch {
    return null;
  }
};

// 로그인 API (x-www-form-urlencoded)
export const login = async (username, password) => {
  const params = new URLSearchParams();
  params.append('username', username);
  params.append('password', password);

  console.log('로그인 요청:', { username, password });
  console.log('요청 URL:', `/api/v1/login`);

  const response = await fetch(`/api/v1/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  });

  console.log('응답 상태:', response.status);
  console.log('응답 헤더:', response.headers);

  if (!response.ok) {
    const errorText = await response.text();
    console.error('로그인 실패:', errorText);
    throw new Error(`로그인에 실패했습니다. (${response.status}): ${errorText}`);
  }

  return response.json();
};

// 도서 목록 조회
export const getBookList = async (page = 0, size = 10) => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(
    `/api/v1/book/list?page=${page}&size=${size}`,
    {
      method: 'GET',
      headers,
    }
  );

  if (!response.ok) {
    throw new Error('도서 목록을 불러오는데 실패했습니다.');
  }

  return response.json();
};

// 도서 상세 조회
export const getBookDetail = async (bookId) => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`/api/v1/book/${bookId}`, {
    method: 'GET',
    headers,
  });

  if (!response.ok) {
    throw new Error('도서 정보를 불러오는데 실패했습니다.');
  }

  return response.json();
};

// 도서 구매
export const buyBook = async (bookId) => {
  const token = getToken();

  if (!token) {
    throw new Error('로그인이 필요합니다.');
  }

  const response = await fetch(`/api/v1/book/buy/${bookId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('도서 구매에 실패했습니다.');
  }

  return response.json();
};
