import { type ReactNode } from 'react';
import { ModalManagerProvider } from '../../shared/ui/modal';

export const AppProvider = ({ children }: { children: ReactNode }) => {
  return <ModalManagerProvider>{children}</ModalManagerProvider>;
};
