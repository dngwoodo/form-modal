import { useEffect, useRef } from 'react';

// 전역 포커스 저장소
const globalFocusManager = {
  savedElement: null as HTMLElement | null,
  saveFocus: () => {
    const activeElement = document.activeElement as HTMLElement;
    if (activeElement && activeElement !== document.body) {
      globalFocusManager.savedElement = activeElement;
      return true;
    }
    return false;
  },
  getSavedElement: () => globalFocusManager.savedElement,
  clearSavedElement: () => {
    globalFocusManager.savedElement = null;
  },
};

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
      // 전역 저장소에서 미리 저장된 요소 가져오기
      const savedElement = globalFocusManager.getSavedElement();
      if (savedElement) {
        previousActiveElement.current = savedElement;
      } else {
        // fallback: 현재 활성 요소 저장
        const activeElement = document.activeElement as HTMLElement;
        if (activeElement && activeElement !== document.body) {
          previousActiveElement.current = activeElement;
        }
      }
    }

    // 모든 모달이 닫혔을 때 (1+ → 0)
    if (previousModalCount.current > 0 && modalCount === 0) {
      if (previousActiveElement.current) {
        // 포커스 복원
        requestAnimationFrame(() => {
          if (previousActiveElement.current) {
            previousActiveElement.current.focus();

            // 복원이 실패한 경우 한 번 더 시도
            if (document.activeElement !== previousActiveElement.current) {
              setTimeout(() => {
                previousActiveElement.current?.focus();
              }, 50);
            }

            previousActiveElement.current = null;
            globalFocusManager.clearSavedElement();
          }
        });
      }
    }

    previousModalCount.current = modalCount;
  }, [modalCount]);
};

// 외부에서 포커스를 미리 저장할 수 있도록 export
export { globalFocusManager };
