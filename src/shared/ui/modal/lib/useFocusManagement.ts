import { useEffect, useRef, type RefObject } from 'react';

export const useFocusManagement = (isOpen: boolean) => {
  const previousActiveElement = useRef<HTMLElement | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      // 모달이 열릴 때 현재 포커스된 요소 저장
      previousActiveElement.current = document.activeElement as HTMLElement;

      // 모달 내부의 첫 번째 포커스 가능한 요소에 포커스
      const focusModal = () => {
        if (modalRef.current) {
          const titleElement = modalRef.current.querySelector(
            '[data-modal-title]',
          ) as HTMLElement;
          if (titleElement) {
            titleElement.focus();
          } else {
            modalRef.current.focus();
          }
        }
      };

      // 다음 프레임에서 포커스 설정 (DOM이 완전히 렌더링된 후)
      requestAnimationFrame(focusModal);
    }

    return () => {
      // 모달이 닫힐 때 원래 요소로 포커스 복원
      if (!isOpen && previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    };
  }, [isOpen]);

  return modalRef;
};

export const useFocusTrap = (
  modalRef: RefObject<HTMLDivElement | null>,
  isOpen: boolean,
) => {
  useEffect(() => {
    if (!isOpen || !modalRef.current) return;

    const modal = modalRef.current;

    const getFocusableElements = () => {
      const focusableSelectors = [
        'button:not([disabled])',
        'input:not([disabled])',
        'textarea:not([disabled])',
        'select:not([disabled])',
        'a[href]',
        '[tabindex]:not([tabindex="-1"])',
        '[contenteditable="true"]',
      ].join(', ');

      return Array.from(
        modal.querySelectorAll(focusableSelectors),
      ) as HTMLElement[];
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;

      const focusableElements = getFocusableElements();
      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    };

    modal.addEventListener('keydown', handleKeyDown);

    return () => {
      modal.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, modalRef]);
};
