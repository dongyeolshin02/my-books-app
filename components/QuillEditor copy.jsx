'use client';

import { useMemo, useRef, useEffect, useCallback, useState } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill-new'), {
  ssr: false,
  loading: () => <p>에디터 로딩중...</p>,
});

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

  // Quill 이미지 리사이즈 모듈 등록
  useEffect(() => {
    const registerModules = async () => {
      if (typeof window !== 'undefined' && !modulesRegistered) {
        try {
          const Quill = (await import('react-quill-new')).Quill;
          const ImageResize = (await import('quill-image-resize-module-react')).default;

          // Parchment 가져오기
          const Parchment = Quill.import('parchment');

          // ImageResize 모듈 등록 전에 Parchment 설정
          if (Parchment) {
            Quill.register('modules/imageResize', ImageResize);
            console.log('이미지 리사이즈 모듈 등록 완료');
          } else {
            console.warn('Parchment를 찾을 수 없습니다');
          }

          setModulesRegistered(true);
        } catch (error) {
          console.error('모듈 등록 실패:', error);
          // 모듈 로드 실패해도 에디터는 작동하도록
          setModulesRegistered(true);
        }
      }
    };

    registerModules();
  }, [modulesRegistered]);

  // 에디터 준비 확인
  useEffect(() => {
    if (!modulesRegistered) return;

    const checkEditor = () => {
      const editor = quillRef.current?.getEditor()
      if (editor) {
        console.log('에디터 준비 완료')
        setIsEditorReady(true)
      } else {
        console.log('에디터 대기 중...')
        setTimeout(checkEditor, 100)
      }
    }

    checkEditor()
  }, [modulesRegistered])

  // 이미지 업로드 → URL 반환 → 에디터 삽입
  const uploadAndInsert = useCallback(async (file) => {
    if (!file) return;
    const editor = quillRef.current?.getEditor?.();
    if (!editor) return;

    const fd = new FormData();
    fd.append(fileField, file);

    const res = await fetch(uploadUrl, {
      method: 'POST',
      headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
      body: fd,
    });

    if (!res.ok) throw new Error('이미지 업로드 실패');

    const data = await res.json();
    const imageUrl = data.imageUrl || data.url;
    if (!imageUrl) throw new Error('서버 응답에 이미지 URL이 없습니다');

    const range = editor.getSelection(true);
    editor.insertEmbed(range.index, 'image', imageUrl, 'user');
    editor.setSelection(range.index + 1);
  }, [authToken, uploadUrl, fileField]);

  // 툴바 이미지 버튼 핸들러
  const imageHandler = useCallback(() => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file')
    input.setAttribute('accept', 'image/*')
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

  // 복사/붙여넣기 이미지 업로드
  useEffect(() => {
    if (!isEditorReady) return;

    const editor = quillRef.current?.getEditor?.();
    if (!editor) return;
    const root = editor.root;

    const onPaste = async (e) => {
      console.log('붙여넣기 이벤트 발생')
      const clipboardData = e.clipboardData;
      
      if (!clipboardData) return;

      const items = Array.from(clipboardData.items);
      const imageItem = items.find(item => item.type.startsWith('image/'));

      if (imageItem) {
        console.log('이미지 아이템 발견:', imageItem.type)
        e.preventDefault()
        e.stopPropagation()

        const file = imageItem.getAsFile();
        if (!file) return;

        try {
          console.log('파일 추출 성공:', file.name)
          await uploadAndInsert(file);
        } catch (err) {
          console.error(err);
          alert('이미지 붙여넣기에 실패했습니다.');
        }
      }
    };

    root.addEventListener('paste', onPaste);
    return () => {
      root.removeEventListener('paste', onPaste);
    };
  }, [isEditorReady, uploadAndInsert]);

  // 드래그앤드롭 업로드
  useEffect(() => {
    if (!isEditorReady) return;

    const editor = quillRef.current?.getEditor?.();
    if (!editor) return;
    const root = editor.root;

    const onDrop = async (e) => {
      console.log('드롭 이벤트 발생')
      e.preventDefault()
      e.stopPropagation()

      const files = e.dataTransfer?.files
      if (!files || files.length === 0) {
        console.log('드롭된 파일 없음')
        return
      }

      console.log('드롭된 파일:', Array.from(files).map(f => f.name))

      const imageFiles = Array.from(files).filter(file => file.type.startsWith('image/'))
      console.log('이미지 파일:', imageFiles.map(f => f.name))

      try {
        for (const file of imageFiles) {
          await uploadAndInsert(file)
        }
      } catch (err) {
        console.error(err);
        alert('이미지 업로드에 실패했습니다.');
      }
    };

    const handleDragOver = (e) => {
      e.preventDefault()
      e.stopPropagation()
    }

    const editorElement = editor.root
    editorElement.addEventListener('drop', onDrop, true)
    editorElement.addEventListener('dragover', handleDragOver, true)

    return () => {
      console.log('드래그/드롭 핸들러 제거')
      editorElement.removeEventListener('drop', onDrop, true)
      editorElement.removeEventListener('dragover', handleDragOver, true)
    };
  }, [isEditorReady, uploadAndInsert]);

  // 이미지 리사이즈 감지 및 재업로드
  useEffect(() => {
    if (!isEditorReady) return;

    const editor = quillRef.current?.getEditor?.();
    if (!editor) return;
    const root = editor.root;

    // 리사이즈된 이미지를 Blob으로 변환
    const imageToBlob = async (imgElement, width, height) => {
      return new Promise(async (resolve, reject) => {
        try {
          // fetch를 사용하여 이미지 가져오기 (CORS 문제 해결)
          const response = await fetch(imgElement.src, {
            headers: authToken ? { Authorization: `Bearer ${authToken}` } : {}
          });

          if (!response.ok) {
            throw new Error('이미지 fetch 실패');
          }

          const originalBlob = await response.blob();
          const img = new Image();

          const objectUrl = URL.createObjectURL(originalBlob);

          img.onload = () => {
            try {
              const canvas = document.createElement('canvas');
              canvas.width = width;
              canvas.height = height;

              const ctx = canvas.getContext('2d');
              ctx.drawImage(img, 0, 0, width, height);

              canvas.toBlob((blob) => {
                // ObjectURL 메모리 해제
                URL.revokeObjectURL(objectUrl);

                if (blob) {
                  resolve(blob);
                } else {
                  reject(new Error('Blob 변환 실패'));
                }
              }, 'image/jpeg', 0.9);
            } catch (error) {
              URL.revokeObjectURL(objectUrl);
              reject(error);
            }
          };

          img.onerror = () => {
            URL.revokeObjectURL(objectUrl);
            reject(new Error('이미지 로드 실패'));
          };

          // Blob을 ObjectURL로 변환하여 사용 (CORS 우회)
          img.src = objectUrl;
        } catch (error) {
          reject(error);
        }
      });
    };

    // 리사이즈된 이미지를 서버에 업로드하고 URL 교체
    const reuploadResizedImage = async (imgElement) => {
      try {
        const width = imgElement.width;
        const height = imgElement.height;
        const oldSrc = imgElement.src;

        console.log('이미지 리사이즈 감지:', { width, height, src: oldSrc });

        // 이미지를 Blob으로 변환
        const blob = await imageToBlob(imgElement, width, height);

        // FormData 생성
        const fd = new FormData();
        const fileName = `resized_${Date.now()}.jpg`;
        const file = new File([blob], fileName, { type: 'image/jpeg' });
        fd.append(fileField, file);

        // 서버에 업로드
        
        const res = await fetch(uploadUrl, {
          method: 'POST',
          headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
          body: fd,
        });

        if (!res.ok) throw new Error('이미지 재업로드 실패');

        const data = await res.json();
        const newImageUrl = data.imageUrl || data.url;

        if (!newImageUrl) throw new Error('서버 응답에 이미지 URL이 없습니다');

        console.log('이미지 재업로드 성공:', newImageUrl);

        // 에디터에서 이미지 URL 교체
        imgElement.src = newImageUrl;

      } catch (error) {
        console.error('이미지 재업로드 실패:', error);
      }
    };

    // 리사이즈 완료 감지를 위한 타이머 맵
    const resizeTimers = new Map();

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' &&
            mutation.target.tagName === 'IMG') {
          const img = mutation.target;

          // 기존 타이머가 있으면 취소
          if (resizeTimers.has(img)) {
            clearTimeout(resizeTimers.get(img));
          }

          // 리사이즈가 완료된 후 500ms 후에 업로드 (사용자가 리사이즈를 완료할 때까지 대기)
          const timer = setTimeout(() => {
            reuploadResizedImage(img);
            resizeTimers.delete(img);
          }, 500);

          resizeTimers.set(img, timer);
        }
      });
    });

    observer.observe(root, {
      attributes: true,
      attributeFilter: ['style', 'width', 'height'],
      subtree: true,
      attributeOldValue: true
    });

    return () => {
      // 모든 타이머 정리
      resizeTimers.forEach(timer => clearTimeout(timer));
      resizeTimers.clear();
      observer.disconnect();
    };
  }, [isEditorReady, authToken, uploadUrl, fileField]);

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
      imageResize: {
        modules: ['Resize', 'DisplaySize']
      },
    }),
    [imageHandler]
  );

  const formats = [
    'header',
    'bold', 'italic', 'underline',
    'strike', 'list', 'color', 'background',
    'align', 'link', 'image'
  ];

  if (!modulesRegistered) {
    return <p>에디터 로딩중...</p>;
  }

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