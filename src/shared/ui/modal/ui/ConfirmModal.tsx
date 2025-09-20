import { BaseModal } from './BaseModal';
import type { ConfirmModalProps } from '../type/types';
import styles from '../style/Modal.module.css';

export function ConfirmModal(props: ConfirmModalProps & { id: string }) {
  const {
    id,
    title = '확인',
    message = '계속하시겠습니까?',
    confirmText = '확인',
    cancelText = '취소',
    onConfirm,
    onCancel,
    children,
    ...baseProps
  } = props;

  const handleConfirm = async () => {
    await onConfirm?.();
  };

  return (
    <BaseModal id={id} title={title} {...baseProps} onClose={onCancel}>
      <div className={styles.confirmContent}>
        {children ? (
          children
        ) : (
          <p className={styles.confirmMessage}>{message}</p>
        )}
      </div>
      <div className={styles.footer}>
        <button
          type="button"
          className={`${styles.button} ${styles.secondary}`}
          onClick={onCancel}
        >
          {cancelText}
        </button>
        <button
          type="button"
          className={`${styles.button} ${styles.primary}`}
          onClick={handleConfirm}
        >
          {confirmText}
        </button>
      </div>
    </BaseModal>
  );
}
