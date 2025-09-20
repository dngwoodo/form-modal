import { useState } from 'react';
import type { FormModalProps, FormModalContext } from '../type/types';
import { BaseModal } from './BaseModal';

export function FormModal<T = unknown>(
  props: FormModalProps<T> & { id: string },
) {
  const {
    id,
    title = '폼 작성',
    size = 'md',
    centered = true,
    withCloseButton = true,
    closeOnEscape = true,
    closeOnClickOutside = true,
    children,
    onSubmit,
    onCancel,
    isLoading = false,
  } = props;

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCancel = () => {
    onCancel?.();
  };

  const handleSubmit = async (data: T) => {
    setIsSubmitting(true);
    try {
      await onSubmit?.(data);
    } catch (error) {
      console.error('Form submission failed:', error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const loading = isLoading || isSubmitting;

  const context: FormModalContext<T> = {
    submit: handleSubmit,
    cancel: handleCancel,
    isSubmitting,
    isLoading: loading,
  };

  return (
    <BaseModal
      id={id}
      title={title}
      size={size}
      centered={centered}
      withCloseButton={withCloseButton}
      closeOnEscape={closeOnEscape}
      closeOnClickOutside={closeOnClickOutside}
      onClose={handleCancel}
    >
      {typeof children === 'function' ? children(context) : children}
    </BaseModal>
  );
}
