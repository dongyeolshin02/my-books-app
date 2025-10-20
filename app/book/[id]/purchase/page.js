'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { useAuthStore } from '@/store/authStore';
import { getBookById } from '@/data/mockBooks';
import { buyBook } from '@/lib/api';

export default function PurchasePage() {
  const router = useRouter();
  const params = useParams();
  const { token, userName } = useAuthStore();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // 구매자 정보
  const [buyerInfo, setBuyerInfo] = useState({
    name: userName || '',
    email: '',
    phone: '',
    address: '',
    memo: ''
  });

  useEffect(() => {
    // 미들웨어가 로그인 체크를 처리함
    if (params.id) {
      const bookData = getBookById(params.id);
      if (bookData) {
        setBook(bookData);
      } else {
        setError('도서를 찾을 수 없습니다.');
      }
    }
  }, [params.id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBuyerInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 필수 입력 체크
    if (!buyerInfo.name || !buyerInfo.email || !buyerInfo.phone || !buyerInfo.address) {
      setError('모든 필수 항목을 입력해주세요.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // 구매 API 호출
      await buyBook(book.id);
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 미들웨어가 체크하므로 제거
  if (!book) {
    return (
      <div className="container mt-4">
        <Navbar />
        <div className="text-center mt-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  // 구매 완료 화면
  if (success) {
    return (
      <div className="container mt-4">
        {/* 네비게이션 바 */}
        <Navbar />

        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card text-center">
              <div className="card-body p-5">
                <div className="mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" fill="currentColor" className="bi bi-check-circle text-success" viewBox="0 0 16 16">
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                    <path d="m10.97 4.97-.02.022-3.473 4.425-2.093-2.094a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05"/>
                  </svg>
                </div>
                <h2 className="card-title mb-3">구매가 완료되었습니다!</h2>
                <p className="text-muted mb-4">
                  {book.title}을(를) 성공적으로 구매하셨습니다.
                </p>

                <div className="alert alert-info text-start mb-4">
                  <h6 className="alert-heading">구매 정보</h6>
                  <hr/>
                  <p className="mb-1"><strong>구매자:</strong> {buyerInfo.name}</p>
                  <p className="mb-1"><strong>이메일:</strong> {buyerInfo.email}</p>
                  <p className="mb-1"><strong>연락처:</strong> {buyerInfo.phone}</p>
                  <p className="mb-1"><strong>배송지:</strong> {buyerInfo.address}</p>
                  {buyerInfo.memo && <p className="mb-0"><strong>메모:</strong> {buyerInfo.memo}</p>}
                </div>

                <div className="d-grid gap-2">
                  <Link href="/" className="btn btn-primary btn-lg">
                    메인으로
                  </Link>
                  <Link href={`/book/${book.id}`} className="btn btn-outline-secondary">
                    도서 상세로 돌아가기
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 구매 폼 화면
  return (
    <div className="container mt-4">
      {/* 네비게이션 바 */}
      <Navbar />

      <div className="row">
        <div className="col-md-8">
          <h2 className="mb-4">도서 구매</h2>

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          {/* 구매자 정보 입력 폼 */}
          <div className="card mb-4">
            <div className="card-header">
              <h5 className="mb-0">구매자 정보</h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                    이름 <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="name"
                    value={buyerInfo.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    이메일 <span className="text-danger">*</span>
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={buyerInfo.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="phone" className="form-label">
                    연락처 <span className="text-danger">*</span>
                  </label>
                  <input
                    type="tel"
                    className="form-control"
                    id="phone"
                    name="phone"
                    placeholder="010-1234-5678"
                    value={buyerInfo.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="address" className="form-label">
                    배송지 주소 <span className="text-danger">*</span>
                  </label>
                  <textarea
                    className="form-control"
                    id="address"
                    name="address"
                    rows="3"
                    value={buyerInfo.address}
                    onChange={handleInputChange}
                    required
                  ></textarea>
                </div>

                <div className="mb-3">
                  <label htmlFor="memo" className="form-label">
                    배송 메모 (선택사항)
                  </label>
                  <textarea
                    className="form-control"
                    id="memo"
                    name="memo"
                    rows="2"
                    placeholder="배송 시 요청사항을 입력해주세요"
                    value={buyerInfo.memo}
                    onChange={handleInputChange}
                  ></textarea>
                </div>

                <div className="d-grid gap-2">
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        구매 처리 중...
                      </>
                    ) : (
                      `${book.price.toLocaleString()}원 결제하기`
                    )}
                  </button>
                  <Link href={`/book/${book.id}`} className="btn btn-outline-secondary">
                    취소
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* 주문 요약 */}
        <div className="col-md-4">
          <div className="card sticky-top" style={{ top: '20px' }}>
            <div className="card-header">
              <h5 className="mb-0">주문 요약</h5>
            </div>
            <div className="card-body">
              <img
                src={book.image}
                alt={book.title}
                className="img-fluid rounded mb-3"
              />
              <h6 className="card-title">{book.title}</h6>
              <p className="text-muted small mb-3">{book.summary}</p>

              <hr />

              <div className="d-flex justify-content-between mb-2">
                <span>도서 가격</span>
                <span>{book.price.toLocaleString()}원</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>배송비</span>
                <span className="text-success">무료</span>
              </div>

              <hr />

              <div className="d-flex justify-content-between">
                <strong>총 결제금액</strong>
                <strong className="text-primary h5 mb-0">
                  {book.price.toLocaleString()}원
                </strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
