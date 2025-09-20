import { useEffect } from 'react';

export const useBodyScrollLock = (isLocked: boolean) => {
  useEffect(() => {
    if (!isLocked) return;

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
