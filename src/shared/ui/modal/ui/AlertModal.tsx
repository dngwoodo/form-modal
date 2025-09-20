import { BaseModal } from './BaseModal';
import type { AlertModalProps } from '../type/types';
import styles from '../style/Modal.module.css';

export function AlertModal(props: AlertModalProps & { id: string }) {
  const {
    id,
    title = '알림',
    message,
    buttonText = '확인',
    onClose,
    children,
    ...baseProps
  } = props;

  return (
    <BaseModal id={id} title={title} {...baseProps} onClose={onClose}>
      <div className={styles.alertContent}>
        {children
          ? children
          : message && <p className={styles.alertMessage}>{message}</p>}
      </div>
      <div className={styles.footer}>
        <button
          type="button"
          className={`${styles.button} ${styles.primary}`}
          onClick={onClose}
        >
          {buttonText}
        </button>
      </div>
    </BaseModal>
  );
}
