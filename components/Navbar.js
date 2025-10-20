'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

export default function Navbar() {
  const router = useRouter();
  const { token, userName, userRole, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.refresh();
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light mb-4">
      <div className="container-fluid">
        <Link href="/" className="navbar-brand">
          도서 쇼핑몰
        </Link>

        <div className="navbar-nav me-auto">
          {token && userRole === 'admin' && (
            <Link href="/admin/book/register" className="nav-link">
              <button className="btn btn-success">
                도서 등록
              </button>
            </Link>
          )}
        </div>

        <div className="ms-auto">
          {token ? (
            <div className="d-flex align-items-center">
              <span className="me-3">
                환영합니다, {userName}님
                {userRole === 'admin' && <span className="badge bg-danger ms-2">관리자</span>}
              </span>
              <button className="btn btn-outline-danger" onClick={handleLogout}>
                로그아웃
              </button>
            </div>
          ) : (
            <button
              className="btn btn-outline-primary"
              onClick={() => router.push('/login')}
            >
              로그인
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
