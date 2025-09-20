import { useModals, type FormModalContext } from '../../../shared/ui/modal';
import { CustomContactForm, type ContactFormData } from './CustomContactForm';

export function ModalFormPage() {
  const { openModal } = useModals();

  const handleOpenFormModal = async () => {
    const result = await openModal<ContactFormData>('form', {
      title: '문의사항 작성 (FormModal)',
      children: (context: FormModalContext<ContactFormData>) => (
        <CustomContactForm context={context} />
      ),
      onSubmit: async (data) => {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        alert(
          `폼이 제출되었습니다!\n이름: ${data.name} \n이메일: ${data.email} \n메시지: ${data.message}`,
        );
      },
    });

    console.log('Form result:', result);
  };

  const handleOpenBaseModal = async () => {
    const result = await openModal('base', {
      title: '알림',
      children: (
        <div>
          <p>이것은 Provider에 등록된 BaseModal입니다!</p>
          <p>
            modalRegistry에서 'base' 타입으로 등록된 컴포넌트가 렌더링됩니다.
          </p>
        </div>
      ),
    });

    console.log('Base modal result:', result);
  };

  const handleOpenSuccessModal = async () => {
    const result = await openModal('success', {
      title: '성공!',
      children: (
        <div>
          <p>작업이 성공적으로 완료되었습니다!</p>
          <p>이것은 AppProvider에서 등록한 커스텀 모달입니다.</p>
        </div>
      ),
    });

    console.log('Success modal result:', result);
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>모달 주입 시스템</h1>
      <p>ModalManagerProvider에 미리 등록된 모달들을 사용하는 예제입니다.</p>

      <div
        style={{
          display: 'flex',
          gap: '1rem',
          marginBottom: '2rem',
          flexWrap: 'wrap',
        }}
      >
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
          FormModal 열기
        </button>

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
          BaseModal 열기
        </button>

        <button
          type="button"
          onClick={handleOpenSuccessModal}
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
          SuccessModal 열기
        </button>
      </div>

      <div
        style={{
          backgroundColor: '#f8f9fa',
          padding: '1.5rem',
          borderRadius: '8px',
          fontSize: '14px',
        }}
      >
        <ul>
          <li>
            ✅ <strong>중앙 집중식 관리</strong> - 모든 모달이 AppProvider에서
            등록
          </li>
          <li>
            ✅ <strong>확장성</strong> - 새로운 모달 타입을 쉽게 추가
          </li>
        </ul>
      </div>
    </div>
  );
}
