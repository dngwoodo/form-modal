import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  type ReactNode,
  type ComponentType,
} from 'react';
import type { BaseModalProps } from '../type/types';

interface ModalRegistry {
  [key: string]: ComponentType<BaseModalProps>;
}

interface ModalContextType {
  openModal: <T = unknown>(
    modalType: string,
    props: Omit<BaseModalProps, 'id' | 'children'> & {
      onSubmit?: (data: T) => void | Promise<void>;
      children?: React.ReactNode | ((context: any) => React.ReactNode);
    },
  ) => Promise<T | null>;
}

const ModalContext = createContext<ModalContextType | null>(null);

interface ModalManagerProps {
  children: ReactNode;
  modals: ModalRegistry;
}

interface ModalItem {
  id: string;
  type: string;
  props: any;
  resolve?: (value: any) => void;
}

export function ModalManagerProvider({
  children,
  modals: modalRegistry,
}: ModalManagerProps) {
  const [modalItems, setModalItems] = useState<ModalItem[]>([]);
  const modalIdCounter = useRef(0);

  const generateId = useCallback(() => {
    modalIdCounter.current += 1;
    return `modal-${modalIdCounter.current}`;
  }, []);

  const closeModal = useCallback((id: string, result?: unknown) => {
    setModalItems((prev) => {
      const modalToClose = prev.find((modal) => modal.id === id);
      if (modalToClose?.resolve) {
        modalToClose.resolve(result ?? null);
      }
      return prev.filter((modal) => modal.id !== id);
    });
  }, []);

  const openModal = useCallback(
    <T = unknown>(
      modalType: string,
      props: Omit<BaseModalProps, 'id' | 'children'> & {
        onSubmit?: (data: T) => void | Promise<void>;
        children?: React.ReactNode | ((context: any) => React.ReactNode);
      },
    ) => {
      return new Promise<T | null>((resolve) => {
        const id = generateId();
        const modalItem: ModalItem = {
          id,
          type: modalType,
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
          resolve,
        };

        setModalItems((prev) => [modalItem, ...prev]);
      });
    },
    [generateId, closeModal],
  );

  const contextValue: ModalContextType = {
    openModal,
  };

  const renderModal = (modal: ModalItem) => {
    const ModalComponent = modalRegistry[modal.type];

    if (!ModalComponent) {
      console.error(`Modal type "${modal.type}" is not registered`);
      return null;
    }

    return <ModalComponent key={modal.id} {...modal.props} />;
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
