import { useEffect, useRef } from 'react';

/**
 * 모달의 포커스 관리를 담당하는 훅
 * - 모달이 열릴 때 현재 포커스된 요소 저장
 * - 모든 모달이 닫힐 때 원래 요소로 포커스 복원
 */
export const useModalFocusManagement = (modalCount: number) => {
  const previousActiveElement = useRef<HTMLElement | null>(null);
  const previousModalCount = useRef(0);

  useEffect(() => {
    // 모달이 처음 열릴 때 (0 → 1)
    if (previousModalCount.current === 0 && modalCount === 1) {
      // 현재 활성 요소 저장
      const activeElement = document.activeElement as HTMLElement; // modal button 을 의미
      if (activeElement && activeElement !== document.body) {
        previousActiveElement.current = activeElement;
      }
    }

    // 모든 모달이 닫혔을 때 (1+ → 0)
    if (previousModalCount.current > 0 && modalCount === 0) {
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
        previousActiveElement.current = null;
      }
    }

    previousModalCount.current = modalCount;
  }, [modalCount]);
};
