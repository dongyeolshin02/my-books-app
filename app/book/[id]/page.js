'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { useAuthStore } from '@/store/authStore';
import { getBookById } from '@/data/mockBooks';

export default function BookDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { token } = useAuthStore();
  const [book, setBook] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (params.id) {
      const bookData = getBookById(params.id);
      if (bookData) {
        setBook(bookData);
      } else {
        setMessage({ type: 'danger', text: '도서를 찾을 수 없습니다.' });
      }
    }
  }, [params.id]);

  const handlePurchase = () => {
    if (!token) {
      if (confirm('로그인이 필요합니다. 로그인 페이지로 이동하시겠습니까?')) {
        router.push('/login');
      }
      return;
    }

    // 구매 페이지로 이동
    router.push(`/book/${book.id}/purchase`);
  };

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

  return (
    <div className="container mt-4">
      {/* 네비게이션 바 */}
      <Navbar />

      {/* 뒤로 가기 버튼 */}
      <div className="mb-3">
        <Link href="/" className="btn btn-secondary">
          목록으로
        </Link>
      </div>

      {/* 메시지 표시 */}
      {message.text && (
        <div className={`alert alert-${message.type}`} role="alert">
          {message.text}
        </div>
      )}

      {/* 도서 상세 정보 */}
      <div className="row">
        <div className="col-md-4">
          <img
            src={book.image}
            alt={book.title}
            className="img-fluid rounded shadow"
          />
        </div>
        <div className="col-md-8">
          <h1 className="mb-3">{book.title}</h1>

          <div className="mb-4">
            <h3 className="text-primary">
              {book.price.toLocaleString()}원
            </h3>
          </div>

          <div className="mb-4">
            <h5>도서 소개</h5>
            {book.contentHtml ? (
              <div
                className="ql-editor"
                dangerouslySetInnerHTML={{ __html: book.contentHtml }}
                style={{ padding: 0 }}
              />
            ) : (
              <p className="text-muted">{book.content}</p>
            )}
          </div>

          <div className="mb-4">
            <h5>목차</h5>
            {book.tableOfContentsHtml ? (
              <div
                className="ql-editor"
                dangerouslySetInnerHTML={{ __html: book.tableOfContentsHtml }}
                style={{ padding: 0 }}
              />
            ) : (
              <ul className="list-group">
                {book.tableOfContents && book.tableOfContents.map((chapter, index) => (
                  <li key={index} className="list-group-item">
                    {chapter}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="d-grid gap-2">
            <button
              className="btn btn-primary btn-lg"
              onClick={handlePurchase}
            >
              구매하기
            </button>
          </div>

          {!token && (
            <div className="alert alert-info mt-3" role="alert">
              구매하려면 로그인이 필요합니다.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
