import { useEffect, type MouseEvent, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import type { BaseModalProps } from '../type/types';
import { useFocusManagement, useFocusTrap } from '../lib/useFocusManagement';
import { useBodyScrollLock } from '../lib/useBodyScrollLock';
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
  const modalRef = useFocusManagement(true);
  const reducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)',
  ).matches;

  useFocusTrap(modalRef, true);
  useBodyScrollLock(true);

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
