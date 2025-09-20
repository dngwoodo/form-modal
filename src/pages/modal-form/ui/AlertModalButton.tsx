import { useModals } from '../../../shared/ui/modal';

interface AlertModalButtonProps {
  onComplete?: () => void;
}

export function AlertModalButton({ onComplete }: AlertModalButtonProps) {
  const { openAlertModal } = useModals();

  const handleOpenAlertModal = async () => {
    await openAlertModal({
      title: '알림',
      message: '작업이 성공적으로 완료되었습니다!',
      buttonText: '확인',
    });

    console.log('알림 모달이 닫혔습니다');
    onComplete?.();
  };

  return (
    <button
      type="button"
      onClick={handleOpenAlertModal}
      style={{
        padding: '12px 24px',
        backgroundColor: '#28a745',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        fontSize: '16px',
        cursor: 'pointer',
      }}
    >
      💡 AlertModal 열기
    </button>
  );
}
