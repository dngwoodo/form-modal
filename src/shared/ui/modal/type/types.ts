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

// 각 모달별 특화된 Props 타입
export interface FormModalProps<T = unknown>
  extends Omit<BaseModalProps, 'id' | 'children'> {
  children?: ReactNode | ((context: FormModalContext<T>) => ReactNode);
  onSubmit?: (data: T) => void | Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
}

export interface ConfirmModalProps
  extends Omit<BaseModalProps, 'id' | 'children'> {
  children?: ReactNode;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void;
}

export interface AlertModalProps
  extends Omit<BaseModalProps, 'id' | 'children'> {
  children?: ReactNode;
  message?: string;
  buttonText?: string;
}

// 모달 아이템 인터페이스
export interface ModalItem {
  id: string;
  type: 'form' | 'confirm' | 'alert' | 'base';
  props: any;
  resolve?: (value: any) => void;
}
