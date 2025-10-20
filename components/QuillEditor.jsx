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
          
          Quill.register('modules/imageResize', ImageResize);
          
          console.log('이미지 리사이즈 모듈 등록 완료');
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
      // 이미지 리사이즈 모듈 추가
      imageResize: {
        parchment: typeof window !== 'undefined' ? require('react-quill-new').Quill?.import('parchment') : undefined,
        modules: ['Resize', 'DisplaySize', 'Toolbar']
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