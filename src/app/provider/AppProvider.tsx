import { type ReactNode } from 'react';
import {
  ModalManagerProvider,
  FormModal,
  BaseModal,
} from '../../shared/ui/modal';

// 커스텀 모달 컴포넌트 예시
interface SuccessModalProps {
  id?: string;
  title?: string;
  children?: ReactNode;
  onClose?: () => void;
}

const SuccessModal = ({ title, children, onClose }: SuccessModalProps) => (
  <div
    style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    }}
  >
    <div
      style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '12px',
        maxWidth: '400px',
        width: '90%',
        border: '3px solid #28a745',
        boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
        <h2 style={{ color: '#28a745', marginBottom: '1rem' }}>{title}</h2>
        {children}
        <button
          type="button"
          onClick={onClose}
          style={{
            marginTop: '1.5rem',
            padding: '10px 20px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '16px',
          }}
        >
          확인
        </button>
      </div>
    </div>
  </div>
);

const modalRegistry = {
  form: FormModal,
  base: BaseModal,
  success: SuccessModal,
  // 여기에 더 많은 모달 타입들을 추가할 수 있습니다
};

export const AppProvider = ({ children }: { children: ReactNode }) => {
  return (
    <ModalManagerProvider modals={modalRegistry}>
      {children}
    </ModalManagerProvider>
  );
};
