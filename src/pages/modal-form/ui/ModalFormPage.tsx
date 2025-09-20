import {
  FormModalButton,
  ConfirmModalButton,
  AlertModalButton,
  BaseModalButton,
} from './buttons';

export function ModalFormPage() {
  return (
    <div style={{ padding: '2rem' }}>
      <div
        style={{
          display: 'flex',
          gap: '1rem',
          marginBottom: '2rem',
          flexWrap: 'wrap',
        }}
      >
        <FormModalButton
          onResult={(result) => {
            console.log('FormModal result:', result);
          }}
        />
        <ConfirmModalButton
          onResult={(confirmed) => {
            console.log('ConfirmModal result:', confirmed);
          }}
        />
        <AlertModalButton
          onComplete={() => {
            console.log('AlertModal completed');
          }}
        />
        <BaseModalButton
          onComplete={() => {
            console.log('BaseModal completed');
          }}
        />
      </div>
    </div>
  );
}
