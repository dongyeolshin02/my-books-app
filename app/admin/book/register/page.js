'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import QuillEditor from '@/components/QuillEditor';
import { useAuthStore } from '@/store/authStore';

export default function BookRegisterPage() {
  const router = useRouter();
  const { token } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [bookData, setBookData] = useState({
    title: '',
    summary: '',
    price: '',
    image: null,
    imagePreview: '',
  });

  const [content, setContent] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: 'danger', text: '이미지 크기는 5MB 이하여야 합니다.' });
      return;
    }
    setBookData((prev) => ({
      ...prev,
      image: file,
      imagePreview: URL.createObjectURL(file),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (!bookData.title.trim()) return setMessage({ type: 'danger', text: '도서 제목을 입력해주세요.' });
    if (!bookData.summary.trim()) return setMessage({ type: 'danger', text: '요약 설명을 입력해주세요.' });
    if (!bookData.price || bookData.price <= 0) return setMessage({ type: 'danger', text: '올바른 가격을 입력해주세요.' });
    if (!content.trim() || content === '<p><br></p>') return setMessage({ type: 'danger', text: '도서 내용을 입력해주세요.' });

    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('title', bookData.title.trim());
      fd.append('summary', bookData.summary.trim());
      fd.append('price', bookData.price);
      fd.append('content', content);
      if (bookData.image) fd.append('image', bookData.image); // 대표이미지 필드명은 서버와 합의대로

      const res = await fetch('/api/v1/book/register', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || '도서 등록에 실패했습니다.');
      }

      const data = await res.json();
      setMessage({ type: 'success', text: '도서가 성공적으로 등록되었습니다!' });
      setTimeout(() => router.push(`/book/${data.id}`), 1500);
    } catch (err) {
      console.error(err);
      setMessage({ type: 'danger', text: err.message || '도서 등록 중 오류가 발생했습니다.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <Navbar />
      <div className="row">
        <div className="col-12">
          <h2 className="mb-4">도서 등록</h2>

          {message.text && (
            <div className={`alert alert-${message.type} alert-dismissible fade show`} role="alert">
              {message.text}
              <button type="button" className="btn-close" onClick={() => setMessage({ type: '', text: '' })} aria-label="Close"></button>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* 대표 이미지 */}
            <div className="card mb-4">
              <div className="card-header">
                <h5 className="mb-0">대표 이미지</h5>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <label htmlFor="image" className="form-label">이미지 업로드 (최대 5MB)</label>
                  <input type="file" className="form-control" id="image" accept="image/*" onChange={handleImageChange} />
                  <div className="form-text">권장 크기: 800x600 픽셀</div>
                </div>
                {bookData.imagePreview && (
                  <div className="mt-3">
                    <img src={bookData.imagePreview} alt="미리보기" className="img-thumbnail" style={{ maxWidth: '300px' }} />
                  </div>
                )}
              </div>
            </div>

            {/* 도서 내용 */}
            <div className="card mb-4">
              <div className="card-header">
                <h5 className="mb-0">
                  도서 내용 <span className="text-danger">*</span>
                </h5>
                <small className="text-muted">툴바 버튼 클릭 또는 이미지 드래그앤드롭으로 삽입할 수 있어요.</small>
              </div>
              <div className="card-body">
                <QuillEditor
                  value={content}
                  onChange={setContent}
                  authToken={token}
                  uploadUrl="/api/v1/book/ed/img"
                  fileField="img"       // 서버가 요구하는 파일 파트명 (중요)
                  height={400}
                  placeholder="도서 내용을 입력하세요..."
                />
              </div>
            </div>

            {/* 제출 버튼 */}
            <div className="d-grid gap-2 mb-5">
              <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    등록 중...
                  </>
                ) : ('도서 등록')}
              </button>
              <button type="button" className="btn btn-outline-secondary" onClick={() => router.push('/')} disabled={loading}>
                취소
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
