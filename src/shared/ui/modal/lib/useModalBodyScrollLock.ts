import { useEffect } from 'react';

/**
 * 모달이 열려있을 때 배경 스크롤을 방지하는 훅
 * - 모달이 열리면 body 스크롤 비활성화
 * - 모달이 닫히면 body 스크롤 복원
 */
export const useModalBodyScrollLock = (isLocked: boolean) => {
  useEffect(() => {
    if (!isLocked) {
      return;
    }

    const originalStyle = window.getComputedStyle(document.body).overflow;
    const originalPaddingRight = document.body.style.paddingRight;

    // 스크롤바 너비 계산
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;

    // 스크롤 잠금
    document.body.style.overflow = 'hidden';

    // 스크롤바가 사라지면서 생기는 레이아웃 시프트 방지
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      // 원래 스타일 복원
      document.body.style.overflow = originalStyle;
      document.body.style.paddingRight = originalPaddingRight;
    };
  }, [isLocked]);
};
