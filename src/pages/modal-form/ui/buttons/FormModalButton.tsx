import { useModals, type FormModalContext } from '../../../../shared/ui/modal';
import { CustomContactForm, type ContactFormData } from '../CustomContactForm';

interface FormModalButtonProps {
  onResult?: (result: ContactFormData | null) => void;
}

export function FormModalButton({ onResult }: FormModalButtonProps) {
  const { openFormModal } = useModals();

  const handleOpenFormModal = async () => {
    const result = await openFormModal<ContactFormData>({
      title: '문의사항 작성',
      children: (context: FormModalContext<ContactFormData>) => (
        <CustomContactForm context={context} />
      ),
      onSubmit: async (data) => {
        // data는 ContactFormData 타입으로 완벽하게 추론됨
        await new Promise((resolve) => setTimeout(resolve, 1500));
        console.log('제출된 데이터:', data);
        alert(
          `폼이 제출되었습니다!\n이름: ${data.name}\n이메일: ${data.email}\n메시지: ${data.message}`,
        );
      },
    });

    // result는 ContactFormData | null 타입
    if (result) {
      console.log('Form result:', result);
    } else {
      console.log('Form was cancelled');
    }

    onResult?.(result);
  };

  return (
    <button
      type="button"
      onClick={handleOpenFormModal}
      style={{
        padding: '12px 24px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        fontSize: '16px',
        cursor: 'pointer',
      }}
    >
      📝 FormModal 열기
    </button>
  );
}
