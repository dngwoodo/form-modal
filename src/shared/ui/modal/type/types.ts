import type { ReactNode } from 'react';

export interface BaseModalProps {
  id: string;
  title?: string;
  children?: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  centered?: boolean;
  withCloseButton?: boolean;
  closeOnEscape?: boolean;
  closeOnClickOutside?: boolean;
  onClose?: () => void;
  onCancel?: () => void;
}

// FormModal 컨텍스트 - 폼 제출을 위한 API 제공
export interface FormModalContext<T = unknown> {
  submit: (data: T) => Promise<void>;
  cancel: () => void;
  isSubmitting: boolean;
  isLoading: boolean;
}

export interface FormModalProps<T = unknown>
  extends Omit<BaseModalProps, 'children'> {
  children?: ReactNode | ((context: FormModalContext<T>) => ReactNode);
  onSubmit?: (data: T) => void | Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
}

export interface ModalState {
  modals: BaseModalProps[];
}

export type ModalType = 'base' | 'form';
