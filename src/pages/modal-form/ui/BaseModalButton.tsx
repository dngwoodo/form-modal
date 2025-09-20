import { useModals } from '../../../shared/ui/modal';

interface BaseModalButtonProps {
  onComplete?: () => void;
}

export function BaseModalButton({ onComplete }: BaseModalButtonProps) {
  const { openBaseModal } = useModals();

  const handleOpenBaseModal = async () => {
    await openBaseModal({
      title: '기본 모달',
      children: (
        <div>
          <p>이것은 기본 모달입니다.</p>
          <p>간단한 내용을 표시할 때 사용합니다.</p>
        </div>
      ),
    });

    console.log('기본 모달이 닫혔습니다');
    onComplete?.();
  };

  return (
    <button
      type="button"
      onClick={handleOpenBaseModal}
      style={{
        padding: '12px 24px',
        backgroundColor: '#6c757d',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        fontSize: '16px',
        cursor: 'pointer',
      }}
    >
      📄 BaseModal 열기
    </button>
  );
}
