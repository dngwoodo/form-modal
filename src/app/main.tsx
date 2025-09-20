import 'modern-normalize';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AppProvider } from './provider/AppProvider';
import { ModalFormPage } from '../pages/modal-form';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProvider>
      <ModalFormPage />
    </AppProvider>
  </StrictMode>,
);
