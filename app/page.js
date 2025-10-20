import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { getPaginatedBooks } from '@/data/mockBooks';

// SSR 페이지로 변경 (searchParams 사용)
export default async function Home({ searchParams }) {
  // searchParams를 await로 처리 (Next.js 15)
  const params = await searchParams;
  const currentPage = parseInt(params.page || '0');
  const bookData = getPaginatedBooks(currentPage, 10);

  return (
    <div className="container mt-4">
      {/* 네비게이션 바 */}
      <Navbar />
``
      {/* 페이지 제목 */}
      <h1 className="mb-4">도서 목록</h1>

      {/* 도서 목록 - 한 줄에 한 개씩 */}
      <div className="row">
        {bookData.content.map((book) => (
          <div key={book.id} className="col-12 mb-3">
            <div className="card">
              <div className="row g-0">
                <div className="col-md-2">
                  <img
                    src={book.image}
                    className="img-fluid rounded-start"
                    alt={book.title}
                    style={{ height: '200px', width: '100%', objectFit: 'cover' }}
                  />
                </div>
                <div className="col-md-8">
                  <div className="card-body">
                    <h5 className="card-title">
                      <Link
                        href={`/book/${book.id}`}
                        className="text-decoration-none text-dark"
                      >
                        {book.title}
                      </Link>
                    </h5>
                    <p className="card-text">{book.summary}</p>
                    <p className="text-muted small mb-0">
                      <small>ID: {book.id}</small>
                    </p>
                  </div>
                </div>
                <div className="col-md-2 d-flex align-items-center justify-content-center">
                  <div className="text-center p-3">
                    <p className="h4 text-primary mb-3">
                      {book.price.toLocaleString()}원
                    </p>
                    <Link href={`/book/${book.id}`} className="btn btn-primary">
                      상세보기
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 페이지네이션 */}
      <nav aria-label="Page navigation" className="mt-4 mb-5">
        <ul className="pagination justify-content-center">
          <li className={`page-item ${currentPage === 0 ? 'disabled' : ''}`}>
            <Link
              href={`/?page=${currentPage - 1}`}
              className={`page-link ${currentPage === 0 ? 'disabled' : ''}`}
              aria-disabled={currentPage === 0}
            >
              이전
            </Link>
          </li>

          {[...Array(bookData.totalPages)].map((_, index) => (
            <li
              key={index}
              className={`page-item ${currentPage === index ? 'active' : ''}`}
            >
              <Link
                href={`/?page=${index}`}
                className="page-link"
              >
                {index + 1}
              </Link>
            </li>
          ))}

          <li
            className={`page-item ${
              currentPage === bookData.totalPages - 1 ? 'disabled' : ''
            }`}
          >
            <Link
              href={`/?page=${currentPage + 1}`}
              className={`page-link ${
                currentPage === bookData.totalPages - 1 ? 'disabled' : ''
              }`}
              aria-disabled={currentPage === bookData.totalPages - 1}
            >
              다음
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
