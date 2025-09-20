import { useModals } from '../../../shared/ui/modal';

interface ConfirmModalButtonProps {
  onResult?: (confirmed: boolean) => void;
}

export function ConfirmModalButton({ onResult }: ConfirmModalButtonProps) {
  const { openConfirmModal } = useModals();

  const handleOpenConfirmModal = async () => {
    const confirmed = await openConfirmModal({
      title: '삭제 확인',
      message:
        '정말로 이 항목을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.',
      confirmText: '삭제',
      cancelText: '취소',
      onConfirm: async () => {
        // 실제 삭제 로직
        await new Promise((resolve) => setTimeout(resolve, 1000));
        console.log('삭제 작업 완료');
      },
    });

    // confirmed는 boolean 타입으로 보장
    if (confirmed) {
      alert('항목이 삭제되었습니다!');
    } else {
      alert('삭제가 취소되었습니다.');
    }

    onResult?.(confirmed);
  };

  return (
    <button
      type="button"
      onClick={handleOpenConfirmModal}
      style={{
        padding: '12px 24px',
        backgroundColor: '#dc3545',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        fontSize: '16px',
        cursor: 'pointer',
      }}
    >
      ❓ ConfirmModal 열기
    </button>
  );
}
