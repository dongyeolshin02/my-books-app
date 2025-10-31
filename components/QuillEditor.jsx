'use client';

import { useMemo, useRef, useEffect, useCallback, useState, useImperativeHandle } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';

/** ===== Constants ===== */
const EDITOR_POLL_MS = 120;          // 에디터 준비 체크 간격
const RESIZE_DEBOUNCE_MS = 500;      // 이미지 리사이즈 감지 디바운스
const REUPLOAD_TYPE = 'image/jpeg';  // 리사이즈 재업로드 MIME
const REUPLOAD_QUALITY = 0.9;        // 리사이즈 재업로드 퀄리티

/** SSR 안전 동적 로딩 */
const ReactQuill = dynamic(() => import('react-quill-new'), {
  ssr: false,
  loading: () => <p>에디터 로딩중...</p>,
});

/** 공통 업로드 함수 */
async function uploadImageFile({ file, uploadUrl, fileField, authToken }) {
  const fd = new FormData();
  fd.append(fileField, file);

  const res = await fetch(uploadUrl, {
    method: 'POST',
    headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
    body: fd,
  });
  if (!res.ok) throw new Error('이미지 업로드 실패');

  const data = await res.json();
  const url = data.imageUrl || data.url;
  if (!url) throw new Error('서버 응답에 이미지 URL이 없습니다');
  return url;
}

/** Blob 변환 유틸: <img> 요소의 현재 크기로 캔버스 리렌더 */
async function imageElementToBlob(imgElement, width, height, authToken) {
  // 원본을 fetch → Blob → ObjectURL 로딩 (CORS 안전)
  const response = await fetch(imgElement.src, {
    headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
  });
  if (!response.ok) throw new Error('이미지 fetch 실패');

  const originalBlob = await response.blob();
  const objectUrl = URL.createObjectURL(originalBlob);
  try {
    const img = await new Promise((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error('이미지 로드 실패'));
      el.src = objectUrl;
    });

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, width, height);

    const blob = await new Promise((resolve) =>
      canvas.toBlob(resolve, REUPLOAD_TYPE, REUPLOAD_QUALITY)
    );
    if (!blob) throw new Error('Blob 변환 실패');

    return blob;
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

/** 메인 컴포넌트 */
const QuillEditor = function QuillEditor(
  {
    value,
    onChange,
    authToken,
    uploadUrl = '/api/v1/book/ed/img',
    fileField = 'img',
    height = 400,
    placeholder = '내용을 입력하세요...',
  },
  ref
) {
  const quillRef = useRef(null);
  const [isEditorReady, setIsEditorReady] = useState(false);
  const [modulesRegistered, setModulesRegistered] = useState(false);

  /** 외부에서 에디터 인스턴스 접근 필요 시 */
  useImperativeHandle(ref, () => ({
    getEditor: () => quillRef.current?.getEditor?.(),
    focus: () => quillRef.current?.focus?.(),
  }));

  /** Quill 모듈(이미지 리사이즈) 등록 */
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (typeof window === 'undefined' || modulesRegistered) return;
      try {
        const { Quill } = await import('react-quill-new');
        const ImageResize = (await import('quill-image-resize-module-react')).default;

        // Parchment가 준비되어 있어야 함
        const Parchment = Quill.import('parchment');
        if (Parchment) {
          Quill.register('modules/imageResize', ImageResize);
          if (!cancelled) setModulesRegistered(true);
          // console.log('이미지 리사이즈 모듈 등록 완료');
        } else {
          console.warn('Parchment를 찾을 수 없습니다');
          if (!cancelled) setModulesRegistered(true); // 에디터는 계속 사용
        }
      } catch (err) {
        console.error('모듈 등록 실패:', err);
        if (!cancelled) setModulesRegistered(true); // 실패해도 계속 사용
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [modulesRegistered]);

  /** 에디터 준비 상태 감지 */
  useEffect(() => {
    if (!modulesRegistered) return;
    let alive = true;

    const tick = () => {
      if (!alive) return;
      const editor = quillRef.current?.getEditor?.();
      if (editor) {
        setIsEditorReady(true);
        return;
      }
      setTimeout(tick, EDITOR_POLL_MS);
    };
    tick();
    return () => {
      alive = false;
    };
  }, [modulesRegistered]);

  /** 서버 업로드 후 에디터에 삽입 */
  const uploadAndInsert = useCallback(
    async (file) => {
      if (!file) return;
      const editor = quillRef.current?.getEditor?.();
      if (!editor) return;

      const imageUrl = await uploadImageFile({ file, uploadUrl, fileField, authToken });
      const range = editor.getSelection(true) || { index: editor.getLength(), length: 0 };
      editor.insertEmbed(range.index, 'image', imageUrl, 'user');
      editor.setSelection(range.index + 1);
    },
    [authToken, uploadUrl, fileField]
  );

  /** 툴바 이미지 버튼 → 파일 선택 → 업로드 */
  const imageHandler = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.click();
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      try {
        await uploadAndInsert(file);
      } catch (e) {
        console.error(e);
        alert('이미지 업로드에 실패했습니다.');
      }
    };
  }, [uploadAndInsert]);

  /** 붙여넣기 이미지 업로드 */
  useEffect(() => {
    if (!isEditorReady) return;
    const editor = quillRef.current?.getEditor?.();
    if (!editor) return;

    const onPaste = async (e) => {
      const cd = e.clipboardData;
      if (!cd) return;

      const items = Array.from(cd.items || []);
      const imageItem = items.find((it) => it.type?.startsWith('image/'));
      if (!imageItem) return;

      e.preventDefault();
      e.stopPropagation();
      const file = imageItem.getAsFile();
      if (!file) return;

      try {
        await uploadAndInsert(file);
      } catch (err) {
        console.error(err);
        alert('이미지 붙여넣기에 실패했습니다.');
      }
    };

    const root = editor.root;
    root.addEventListener('paste', onPaste);
    return () => root.removeEventListener('paste', onPaste);
  }, [isEditorReady, uploadAndInsert]);

  /** 드래그&드롭 이미지 업로드 */
  useEffect(() => {
    if (!isEditorReady) return;
    const editor = quillRef.current?.getEditor?.();
    if (!editor) return;
    const root = editor.root;

    const onDrop = async (e) => {
      e.preventDefault();
      e.stopPropagation();
      const files = Array.from(e.dataTransfer?.files || []).filter((f) => f.type.startsWith('image/'));
      if (files.length === 0) return;

      try {
        // 순차 업로드 (필요 시 Promise.all로 병렬 변경)
        for (const f of files) {
          await uploadAndInsert(f);
        }
      } catch (err) {
        console.error(err);
        alert('이미지 업로드에 실패했습니다.');
      }
    };

    const onDragOver = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };

    root.addEventListener('drop', onDrop, true);
    root.addEventListener('dragover', onDragOver, true);
    return () => {
      root.removeEventListener('drop', onDrop, true);
      root.removeEventListener('dragover', onDragOver, true);
    };
  }, [isEditorReady, uploadAndInsert]);

  /** 이미지 리사이즈 감지 → 현재 보이는 크기로 재인코딩 → 서버에 재업로드 → URL 교체 */
  useEffect(() => {
    if (!isEditorReady) return;
    const editor = quillRef.current?.getEditor?.();
    if (!editor) return;
    const root = editor.root;

    const timers = new Map();

    const reuploadResizedImage = async (img) => {
      try {
        const src = img.src;
        const fileName = src.substring(src.lastIndexOf('/')+1);

        const { width, height } = img;
        if (!width || !height) return;

        const blob = await imageElementToBlob(img, width, height, authToken);
        const file = new File([blob], fileName, { type: REUPLOAD_TYPE });
        const newUrl = await uploadImageFile({ file, uploadUrl, fileField, authToken });

        // URL 교체
        img.src = newUrl;
      } catch (err) {
        console.error('이미지 재업로드 실패:', err);
      }
    };

    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.type !== 'attributes') continue;
        const target = m.target;
        if (!(target instanceof HTMLImageElement)) continue;

        // 디바운스 처리 > 이벤트 발생마다 이전 타이머 정지 
        if (timers.has(target)) clearTimeout(timers.get(target));
        const t = setTimeout(() => {
          reuploadResizedImage(target);
          timers.delete(target);
        }, RESIZE_DEBOUNCE_MS);

        //사용자가 0.5초 멈춰야 이벤트 발생 
        timers.set(target, t);
      }
    });

    observer.observe(root, {
      attributes: true,
      attributeFilter: ['style', 'width', 'height'],
      subtree: true,
      attributeOldValue: true,
    });

    return () => {
      timers.forEach((t) => clearTimeout(t));
      timers.clear();
      observer.disconnect();
    };
  }, [isEditorReady, authToken, uploadUrl, fileField]);

  /** Quill 모듈/포맷 */
  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, 3, false] }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          [{ color: [] }, { background: [] }],
          [{ align: [] }],
          ['link', 'image'],
          ['clean'],
        ],
        handlers: { image: imageHandler },
      },
      imageResize: { modules: ['Resize', 'DisplaySize'] },
    }),
    [imageHandler]
  );

  const formats = useMemo(
    () => [
      'header',
      'bold',
      'italic',
      'underline',
      'strike',
      'list',
      'color',
      'background',
      'align',
      'link',
      'image',
    ],
    []
  );

  if (!modulesRegistered) return <p>에디터 로딩중...</p>;

  return (
    <ReactQuill
      ref={quillRef}
      theme="snow"
      value={value}
      onChange={onChange}
      modules={modules}
      formats={formats}
      placeholder={placeholder}
      style={{ height, marginBottom: 50 }}
    />
  );
};

export default QuillEditor;
