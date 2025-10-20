import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // localStorage에서 인증 정보를 가져올 수 없으므로 쿠키 사용
  const authCookie = request.cookies.get('auth-storage');

  let isAuthenticated = false;
  let userRole = null;

  if (authCookie) {
    try {
      const authData = JSON.parse(authCookie.value);
      isAuthenticated = !!authData.state?.token;
      userRole = authData.state?.userRole;
    } catch (error) {
      // 파싱 에러 시 인증되지 않은 것으로 처리
      isAuthenticated = false;
    }
  }

  // 관리자 페이지 접근 체크
  // if (pathname.startsWith('/admin')) {
  //   if (!isAuthenticated) {
  //     // 로그인 안 되어 있으면 로그인 페이지로
  //     const loginUrl = new URL('/login', request.url);
  //     return NextResponse.redirect(loginUrl);
  //   }

  //   if (userRole !== 'admin') {
  //     // 관리자가 아니면 메인 페이지로
  //     return NextResponse.redirect(new URL('/', request.url));
  //   }
  // }

  // 구매 페이지 접근 체크
  if (pathname.match(/\/book\/\d+\/purchase/)) {
    if (!isAuthenticated) {
      const loginUrl = new URL('/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

// 미들웨어가 실행될 경로 설정
export const config = {
  matcher: [
    '/admin/:path*',
    '/book/:path*/purchase',
  ],
};
