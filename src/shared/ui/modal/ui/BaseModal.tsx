import { useEffect, useRef, type MouseEvent, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import type { BaseModalProps } from '../type/types';
import { useModalFocusTrap } from '../lib/useModalFocusTrap';
import { useModalBodyScrollLock } from '../lib/useModalBodyScrollLock';
import styles from '../style/Modal.module.css';

interface ModalProps extends BaseModalProps {
  children?: ReactNode;
}

export function BaseModal({
  id,
  title,
  children,
  size = 'md',
  centered = true,
  withCloseButton = true,
  closeOnEscape = true,
  closeOnClickOutside = true,
  onClose,
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const reducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)',
  ).matches;

  useModalFocusTrap(modalRef, true);
  useModalBodyScrollLock(true);

  // 모달이 열릴 때 제목에 포커스 설정 (포커스 저장 후 실행)
  useEffect(() => {
    // 포커스 저장이 완료된 후 제목에 포커스 설정
    const focusTimer = setTimeout(() => {
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
    }, 10);

    return () => clearTimeout(focusTimer);
  }, []);

  // ESC 키 처리
  useEffect(() => {
    if (!closeOnEscape) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose?.();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [closeOnEscape, onClose]);

  // 오버레이 클릭 처리
  const handleOverlayClick = (event: MouseEvent) => {
    if (closeOnClickOutside && event.target === event.currentTarget) {
      onClose?.();
    }
  };

  const overlayClassName = [
    styles.overlay,
    centered && styles.centered,
    reducedMotion && styles.reducedMotion,
  ]
    .filter(Boolean)
    .join(' ');

  const modalClassName = [
    styles.modal,
    styles[size],
    reducedMotion && styles.reducedMotion,
  ]
    .filter(Boolean)
    .join(' ');

  const modalContent = (
    <div
      className={overlayClassName}
      onClick={handleOverlayClick}
      onKeyDown={(e) =>
        e.key === 'Enter' && handleOverlayClick(e as unknown as MouseEvent)
      }
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? `modal-title-${id}` : undefined}
    >
      <div ref={modalRef} className={modalClassName} tabIndex={-1}>
        {(title || withCloseButton) && (
          <div className={styles.header}>
            {title && (
              <h2
                id={`modal-title-${id}`}
                className={styles.title}
                data-modal-title
                tabIndex={-1}
              >
                {title}
              </h2>
            )}
            {withCloseButton && (
              <button
                type="button"
                className={styles.closeButton}
                onClick={onClose}
                aria-label="모달 닫기"
              >
                ✕
              </button>
            )}
          </div>
        )}

        <div className={styles.body}>{children}</div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
