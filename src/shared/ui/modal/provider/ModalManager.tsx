import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useRef,
  type ReactNode,
} from 'react';
import type {
  FormModalProps,
  ConfirmModalProps,
  AlertModalProps,
  BaseModalProps,
  ModalItem,
} from '../type/types';
import { FormModal } from '../ui/FormModal';
import { ConfirmModal } from '../ui/ConfirmModal';
import { AlertModal } from '../ui/AlertModal';
import { BaseModal } from '../ui/BaseModal';
import { useModalFocusManagement } from '../lib/useModalFocusManagement';
import { modalItemsReducer } from '../lib/modalItemsReducer';

interface ModalContextType {
  openFormModal: <T = unknown>(props: FormModalProps<T>) => Promise<T | null>;
  openConfirmModal: (props: ConfirmModalProps) => Promise<boolean>;
  openAlertModal: (props: AlertModalProps) => Promise<void>;
  openBaseModal: (props: Omit<BaseModalProps, 'id'>) => Promise<void>;
}

const ModalContext = createContext<ModalContextType | null>(null);

interface ModalManagerProps {
  children: ReactNode;
}

export function ModalManagerProvider({ children }: ModalManagerProps) {
  const [modalItems, dispatch] = useReducer(modalItemsReducer, []);
  const modalIdCounter = useRef(0);

  // 포커스 관리 훅 사용
  useModalFocusManagement(modalItems.length);

  const generateId = useCallback(() => {
    modalIdCounter.current += 1;
    return `modal-${modalIdCounter.current}`;
  }, []);

  // Simplified closeModal function using reducer
  const closeModal = useCallback((id: string, result?: unknown) => {
    dispatch({ type: 'REMOVE_MODAL', payload: { id, result } });
  }, []);

  // FormModal 전용 함수
  const openFormModal = useCallback(
    <T = unknown>(props: FormModalProps<T>) => {
      return new Promise<T | null>((resolve) => {
        const id = generateId();
        const modalItem: ModalItem = {
          id,
          type: 'form',
          props: {
            ...props,
            id,
            onSubmit: async (data: T) => {
              try {
                await props.onSubmit?.(data);
                closeModal(id, data);
              } catch (error) {
                console.error('Form submission failed:', error);
                closeModal(id, null);
              }
            },
            onCancel: () => {
              props.onCancel?.();
              closeModal(id, null);
            },
            onClose: () => {
              props.onClose?.();
              closeModal(id, null);
            },
          },
          resolve: resolve as (value: unknown) => void,
        };
        dispatch({ type: 'ADD_MODAL', payload: modalItem });
      });
    },
    [generateId, closeModal],
  );

  // ConfirmModal 전용 함수
  const openConfirmModal = useCallback(
    (props: ConfirmModalProps) => {
      return new Promise<boolean>((resolve) => {
        const id = generateId();
        const modalItem: ModalItem = {
          id,
          type: 'confirm',
          props: {
            ...props,
            id,
            onConfirm: async () => {
              try {
                await props.onConfirm?.();
                closeModal(id, true);
              } catch (error) {
                console.error('Confirm action failed:', error);
                closeModal(id, false);
              }
            },
            onCancel: () => {
              props.onCancel?.();
              closeModal(id, false);
            },
            onClose: () => {
              props.onClose?.();
              closeModal(id, false);
            },
          },
          resolve: resolve as (value: unknown) => void,
        };
        dispatch({ type: 'ADD_MODAL', payload: modalItem });
      });
    },
    [generateId, closeModal],
  );

  // AlertModal 전용 함수
  const openAlertModal = useCallback(
    (props: AlertModalProps) => {
      return new Promise<void>((resolve) => {
        const id = generateId();
        const modalItem: ModalItem = {
          id,
          type: 'alert',
          props: {
            ...props,
            id,
            onClose: () => {
              props.onClose?.();
              closeModal(id, undefined);
            },
          },
          resolve: resolve as (value: unknown) => void,
        };
        dispatch({ type: 'ADD_MODAL', payload: modalItem });
      });
    },
    [generateId, closeModal],
  );

  // BaseModal 전용 함수
  const openBaseModal = useCallback(
    (props: Omit<BaseModalProps, 'id'>) => {
      return new Promise<void>((resolve) => {
        const id = generateId();
        const modalItem: ModalItem = {
          id,
          type: 'base',
          props: {
            ...props,
            id,
            onClose: () => {
              props.onClose?.();
              closeModal(id, undefined);
            },
          },
          resolve: resolve as (value: unknown) => void,
        };
        dispatch({ type: 'ADD_MODAL', payload: modalItem });
      });
    },
    [generateId, closeModal],
  );

  const contextValue: ModalContextType = {
    openFormModal,
    openConfirmModal,
    openAlertModal,
    openBaseModal,
  };

  const renderModal = (modal: ModalItem) => {
    switch (modal.type) {
      case 'form':
        return (
          <FormModal
            key={modal.id}
            {...(modal.props as unknown as FormModalProps<unknown> & {
              id: string;
            })}
          />
        );
      case 'confirm':
        return (
          <ConfirmModal
            key={modal.id}
            {...(modal.props as unknown as ConfirmModalProps & { id: string })}
          />
        );
      case 'alert':
        return (
          <AlertModal
            key={modal.id}
            {...(modal.props as unknown as AlertModalProps & { id: string })}
          />
        );
      case 'base':
        return (
          <BaseModal
            key={modal.id}
            {...(modal.props as unknown as BaseModalProps)}
          />
        );
      default:
        console.error(
          `Unknown modal type: ${(modal as { type: string }).type}`,
        );
        return null;
    }
  };

  return (
    <ModalContext.Provider value={contextValue}>
      {children}
      {modalItems.map(renderModal)}
    </ModalContext.Provider>
  );
}

export function useModals() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModals must be used within a ModalManagerProvider');
  }
  return context;
}
