import { useModals, type FormModalContext } from '../../../shared/ui/modal';
import { CustomContactForm, type ContactFormData } from './CustomContactForm';

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
        await new Promise((resolve) => setTimeout(resolve, 1500));
        console.log('onSubmit data:', data);
      },
    });

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
        height: 'fit-content',
      }}
    >
      📝 FormModal 열기
    </button>
  );
}
